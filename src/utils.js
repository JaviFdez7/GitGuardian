const { GQLPaginator } = require('gql-paginator');
const dotenv = require('dotenv');
dotenv.config();

const githubToken = process.env.GH_TOKEN;

const fetchData = async (graphqlQuery) => {
    try {
        const result = await GQLPaginator(graphqlQuery, githubToken, "github-v1.0.0");

        return result;
    } catch (error) {
        console.error("Error fetching data from GitHub:", error.message);
    }
};

module.exports = { fetchData };  