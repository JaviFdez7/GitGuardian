const { fetchData } = require('../utils.js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const _dirname = __dirname;
const configPath = path.resolve(_dirname, `../config.json`);
const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));

module.exports = { assignedIssuesFromRepository }; 

async function assignedIssuesFromRepository(){

  const query = `
  {
    repository(name: "${configData.projectName}", owner:"${configData.projectOwner}") {
      issues(first: 100) {
        pageInfo {
          hasNextPage
          endCursor
        }
        totalCount
        nodes {
          title
          bodyUrl
          assignees(first: 100) {
            pageInfo {
              hasNextPage
              endCursor
            }
            totalCount
            nodes {
              name
              email
            }
          }
        }
      }
    }
  }`;

  const result = await fetchData(query);

  return result;
}