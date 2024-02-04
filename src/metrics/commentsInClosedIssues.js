const { fetchData } = require('../utils.js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const _dirname = __dirname;
const configPath = path.resolve(_dirname, `../config.json`);
const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));

module.exports = { commentsInClosedIssuesFromRepository }; 

async function commentsInClosedIssuesFromRepository(){

  const query = `
  {
    repository(name: "${configData.projectName}", owner:"${configData.projectOwner}") {
      issues(first: 100, states:CLOSED) {
        pageInfo {
          hasNextPage
          endCursor
        }
        totalCount
        nodes {
          title
          bodyUrl
          comments(first:100){
            pageInfo {
              hasNextPage
              endCursor
            }
            totalCount
            nodes{
              body
              author{
                login
              }
            }
          }
        }
      }
    }
  }`

  const result = await fetchData(query);

  return result;
}