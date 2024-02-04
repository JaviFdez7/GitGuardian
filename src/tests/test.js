const assert = require('assert');
const fs = require('fs');
const path = require('path');

const _dirname = __dirname;
const configPath = path.resolve(_dirname, `../config.json`);
const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const { assignedIssuesFromRepository } = require('../metrics/assignedIssues.js');
const { commentsInClosedIssuesFromRepository } = require('../metrics/commentsInClosedIssues.js');
//const { ghProjectsAssignedToIssuesFromRepository } = require('../metrics/ghProjectsAssignedToIssues.js');



describe(`Analyzing owner ${configData.projectOwner}'s ${configData.projectName} repository\n`, () => {
  if (configData.metrics.assignedIssues.activeMetric) { // ASSIGNED ISSUES TEST
    it(`More than ${configData.metrics.assignedIssues.acceptancePercentage}% of the issues must be assigned to at least ${configData.metrics.assignedIssues.minimumAssignedMembersPerIssue} member`, async () => {      
      const result = await assignedIssuesFromRepository();

      var assignedIssues = 0;
      var unassignedIssues = 0;

      for (var i = 0; i < result.data.repository.issues.nodes.length; i++) {
        if (result.data.repository.issues.nodes[i].assignees?.nodes.length >= configData.metrics.assignedIssues.minimumAssignedMembersPerIssue)
          assignedIssues++;
        else{
          console.log("This issue doesn't comply with the assigned issue policy: ", result.data.repository.issues.nodes[i].bodyUrl)
          unassignedIssues++;
        } 
      }

      var obtainedPercentage = (100 * assignedIssues) / (assignedIssues + unassignedIssues);

      console.log("\nAssigned issues summary:");
      console.table([
        { Type: `Issues with at least ${configData.metrics.assignedIssues.minimumAssignedMembersPerIssue} assigned members`, Count: assignedIssues },
        { Type: `Issues with less than ${configData.metrics.assignedIssues.minimumAssignedMembersPerIssue} assigned members`, Count: unassignedIssues },
        { Type: 'Obtained Percentage', Count: obtainedPercentage.toFixed(2) + '%' },
        { Type: 'Target Percentage', Count: configData.metrics.assignedIssues.acceptancePercentage.toFixed(2) + '%' }
      ]);

      assert.ok(obtainedPercentage >= configData.metrics.assignedIssues.acceptancePercentage, `Expected acceptance percentage: ${configData.metrics.assignedIssues.acceptancePercentage}%, Obtained: ${obtainedPercentage.toFixed(2)}%`);
    }).timeout(60000);
  }

  if (configData.metrics.commentsInClosedIssues.activeMetric) { // COMMENTS IN CLOSED ISSUES
    it(`More than ${configData.metrics.commentsInClosedIssues.acceptancePercentage}% of the closed issues must have at least ${configData.metrics.commentsInClosedIssues.minimumCommentsPerClosedIssue} comments`, async () => {  
      const result = await commentsInClosedIssuesFromRepository();

      var commentedCloseIssues = 0;
      var uncommentedCloseIssues = 0;

      for (var i = 0; i < result.data.repository.issues.nodes.length; i++) {
        if (result.data.repository.issues.nodes[i].comments?.nodes.length >= configData.metrics.commentsInClosedIssues.minimumCommentsPerClosedIssue)
          commentedCloseIssues++;
        else{
          console.log("This issue doesn't comply with the minimum comments in the closed issues policy: ", result.data.repository.issues.nodes[i].bodyUrl)
          uncommentedCloseIssues++;
        } 
      }

      var obtainedPercentage = (100 * commentedCloseIssues) / (commentedCloseIssues + uncommentedCloseIssues);

      console.log("\nComments in closed issues Summary:");
      console.table([
        { Type: `Closed issues with at least ${configData.metrics.commentsInClosedIssues.minimumCommentsPerClosedIssue} comments`, Count: commentedCloseIssues },
        { Type: `Closed issues with less than ${configData.metrics.commentsInClosedIssues.minimumCommentsPerClosedIssue} comments`, Count: uncommentedCloseIssues },
        { Type: 'Obtained Percentage', Count: obtainedPercentage.toFixed(2) + '%' },
        { Type: 'Target Percentage', Count: configData.metrics.commentsInClosedIssues.acceptancePercentage.toFixed(2) + '%' }
      ]);

      assert.ok(obtainedPercentage >= configData.metrics.commentsInClosedIssues.acceptancePercentage, `Expected acceptance percentage: ${configData.metrics.commentsInClosedIssues.acceptancePercentage}%, Obtained: ${obtainedPercentage.toFixed(2)}%`);

    }).timeout(60000);  
    }
});
