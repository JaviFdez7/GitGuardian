const { fetchData } = require('../utils.js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const _dirname = __dirname;
const configPath = path.resolve(_dirname, `../config.json`);
const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));

module.exports = { assignedGHProjectsToIssuesFromRepository }; 

async function assignedGHProjectsToIssuesFromRepository(){

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
          projectsV2(first:100){
            pageInfo {
              hasNextPage
              endCursor
            }
            totalCount
            nodes{
              title
            }
          }
        }
      }
    }
  }`

  const result = await fetchData(query);

  return result;
}