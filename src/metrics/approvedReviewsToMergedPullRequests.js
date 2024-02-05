const { fetchData } = require('../utils.js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const _dirname = __dirname;
const configPath = path.resolve(_dirname, `../config.json`);
const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));

module.exports = { approvedReviewsToMergedPullRequestsFromRepository }; 

async function approvedReviewsToMergedPullRequestsFromRepository(){

  const query = `
  {
    repository(name: "${configData.projectName}", owner:"${configData.projectOwner}") {
      pullRequests(first:100, states: MERGED){
      	pageInfo {
          hasNextPage
          endCursor
        }
        totalCount
      	nodes{
          title
          url
          reviews(first:100){
            pageInfo {
              hasNextPage
              endCursor
            }
            totalCount
            nodes{
              state
            }
          }
        }
    	}
    }
  }`

  const result = await fetchData(query);

  return result;
}