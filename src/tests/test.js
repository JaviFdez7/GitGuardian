const assert = require('assert');
const fs = require('fs');
const path = require('path');

const _dirname = __dirname;
const configPath = path.resolve(_dirname, `../config.json`);
const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const { assignedIssuesFromRepository } = require('../metrics/assignedIssues.js');
const { commentsInClosedIssuesFromRepository } = require('../metrics/commentsInClosedIssues.js');
const { assignedGHProjectsToIssuesFromRepository } = require('../metrics/assignedGHProjectsToIssues.js');
const { approvedReviewsToMergedPullRequestsFromRepository } = require('../metrics/approvedReviewsToMergedPullRequests.js');



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

      var commentedClosedIssues = 0;
      var uncommentedClosedIssues = 0;

      for (var i = 0; i < result.data.repository.issues.nodes.length; i++) {
        if (result.data.repository.issues.nodes[i].comments?.nodes.length >= configData.metrics.commentsInClosedIssues.minimumCommentsPerClosedIssue)
          commentedClosedIssues++;
        else{
          console.log("This issue doesn't comply with the minimum comments in the closed issues policy: ", result.data.repository.issues.nodes[i].bodyUrl)
          uncommentedClosedIssues++;
        } 
      }

      var obtainedPercentage = (100 * commentedClosedIssues) / (commentedClosedIssues + uncommentedClosedIssues);

      console.log("\nComments in closed issues summary:");
      console.table([
        { Type: `Closed issues with at least ${configData.metrics.commentsInClosedIssues.minimumCommentsPerClosedIssue} comments`, Count: commentedClosedIssues },
        { Type: `Closed issues with less than ${configData.metrics.commentsInClosedIssues.minimumCommentsPerClosedIssue} comments`, Count: uncommentedClosedIssues },
        { Type: 'Obtained Percentage', Count: obtainedPercentage.toFixed(2) + '%' },
        { Type: 'Target Percentage', Count: configData.metrics.commentsInClosedIssues.acceptancePercentage.toFixed(2) + '%' }
      ]);

      assert.ok(obtainedPercentage >= configData.metrics.commentsInClosedIssues.acceptancePercentage, `Expected acceptance percentage: ${configData.metrics.commentsInClosedIssues.acceptancePercentage}%, Obtained: ${obtainedPercentage.toFixed(2)}%`);

    }).timeout(60000);  
  }

  if (configData.metrics.assignedGHProjectsToIssues.activeMetric) { // ASSIGNED GITHUB PROJECT TO ISSUES
    it(`More than ${configData.metrics.assignedGHProjectsToIssues.acceptancePercentage}% of the issues must be assigned to at least ${configData.metrics.assignedGHProjectsToIssues.minimumGHProjectsPerIssue} github projects`, async () => {  
      const result = await assignedGHProjectsToIssuesFromRepository();

      var assignedGHProjectToIssues = 0;
      var unassignedGHProjectToIssues = 0;

      for (var i = 0; i < result.data.repository.issues.nodes.length; i++) {
        if (result.data.repository.issues.nodes[i].projectsV2?.nodes.length >= configData.metrics.assignedGHProjectsToIssues.minimumGHProjectsPerIssue)
          assignedGHProjectToIssues++;
        else{
          console.log("This issue doesn't comply with the minimum assigned github projects per issue policy: ", result.data.repository.issues.nodes[i].bodyUrl)
          unassignedGHProjectToIssues++;
        } 
      }

      var obtainedPercentage = (100 * assignedGHProjectToIssues) / (assignedGHProjectToIssues + unassignedGHProjectToIssues);

      console.log("\nAssigned github projects to issues summary:");
      console.table([
        { Type: `Issues with at least ${configData.metrics.assignedGHProjectsToIssues.minimumGHProjectsPerIssue} assigned github projects`, Count: assignedGHProjectToIssues },
        { Type: `Issues with less than ${configData.metrics.assignedGHProjectsToIssues.minimumGHProjectsPerIssue} assigned github projects`, Count: unassignedGHProjectToIssues },
        { Type: 'Obtained Percentage', Count: obtainedPercentage.toFixed(2) + '%' },
        { Type: 'Target Percentage', Count: configData.metrics.assignedGHProjectsToIssues.acceptancePercentage.toFixed(2) + '%' }
      ]);

      assert.ok(obtainedPercentage >= configData.metrics.assignedGHProjectsToIssues.acceptancePercentage, `Expected acceptance percentage: ${configData.metrics.assignedGHProjectsToIssues.acceptancePercentage}%, Obtained: ${obtainedPercentage.toFixed(2)}%`);

    }).timeout(60000);  
  }

  if (configData.metrics.approvedReviewsToMergedPullRequests.activeMetric) { // APPROVED REVIEWS TO PULL REQUESTS
    it(`More than ${configData.metrics.approvedReviewsToMergedPullRequests.acceptancePercentage}% of the merged pull requests must have at least ${configData.metrics.approvedReviewsToMergedPullRequests.minimumGHProjectsPerIssue} approved reviews`, async () => {  
      const result = await approvedReviewsToMergedPullRequestsFromRepository();

      var approvedReviewsToMergedPullRequests = 0;
      var unapprovedReviewsToMergedPullRequests = 0;

      for (var i = 0; i < result.data.repository.pullRequests.nodes.length; i++) {
        var approvedReviewsPerIssue = 0;

        for (var j = 0; j < result.data.repository.pullRequests.nodes[i].reviews.nodes.length; j++)
          if(result.data.repository.pullRequests.nodes[i].reviews.nodes[j].state == "APPROVED")
            approvedReviewsPerIssue++;

        if (approvedReviewsPerIssue >= configData.metrics.approvedReviewsToMergedPullRequests.minimumApprovedReviewsPerMergedPullRequests)
          approvedReviewsToMergedPullRequests++;
        else{
          console.log("This pull request doesn't comply with the minimum approved reviews per merged pull request policy: ", result.data.repository.pullRequests.nodes[i].url)
          unapprovedReviewsToMergedPullRequests++;
        } 
      }

      var obtainedPercentage = (100 * approvedReviewsToMergedPullRequests) / (approvedReviewsToMergedPullRequests + unapprovedReviewsToMergedPullRequests);

      console.log("\nApproved reviews to pull requests summary:");
      console.table([
        { Type: `Merged pull requests with at least ${configData.metrics.approvedReviewsToMergedPullRequests.minimumApprovedReviewsPerMergedPullRequests} approved reviews`, Count: approvedReviewsToMergedPullRequests },
        { Type: `Merged pull requests with less than ${configData.metrics.approvedReviewsToMergedPullRequests.minimumApprovedReviewsPerMergedPullRequests} approved reviews`, Count: unapprovedReviewsToMergedPullRequests },
        { Type: 'Obtained Percentage', Count: obtainedPercentage.toFixed(2) + '%' },
        { Type: 'Target Percentage', Count: configData.metrics.approvedReviewsToMergedPullRequests.acceptancePercentage.toFixed(2) + '%' }
      ]);

      assert.ok(obtainedPercentage >= configData.metrics.approvedReviewsToMergedPullRequests.acceptancePercentage, `Expected acceptance percentage: ${configData.metrics.approvedReviewsToMergedPullRequests.acceptancePercentage}%, Obtained: ${obtainedPercentage.toFixed(2)}%`);

    }).timeout(60000);  
  }
});
