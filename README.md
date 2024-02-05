# GitGuardian
This system enables the analysis of GitHub repositories based on provided metrics. Given a configuration, the system will assess the repository and provide information to address metrics that are not met.

## Quick start
Clone this repository
```bash
git clone https://github.com/JaviFdez7/GitGuardian.git
```
Install the dependencies (from the root directory)
```bash
npm install
```
Create .env file from .env.example file
```
GH_TOKEN=<YOUR-GH-TOKEN>
```
Your github token must have read permissions

---

## Usage
# Configuration Documentation

To ensure proper functionality of the metrics analysis tests, it is essential to configure the `config.json` file located in the `src` directory. This configuration file contains parameters such as projectName, projectOwner, and various metrics settings, allowing you to tailor the analysis criteria according to your specific GitHub repository. 

This section provides information about the configuration parameters in the `config.json` file.

## Project Information

| Parameter      | Type   | Description                                       | Example            |
| -------------- | ------ | ------------------------------------------------- | ------------------ |
| `projectName`  | string | The name of the GitHub project.                   | `"psg2-2223-g6-63"`|
| `projectOwner` | string | The owner or organization of the GitHub project.  | `"gii-is-psg2"`    |

## Metrics Configuration

The `metrics` section contains configurations for various metrics analysis tests.

### Assigned Issues Metric

| Parameter                         | Type    | Description                                           | Example |
| --------------------------------- | ------- | ----------------------------------------------------- | ------- |
| `activeMetric`                    | boolean | Indicates whether the metric is active or not.        | `true`  |
| `minimumAssignedMembersPerIssue`  | integer | Minimum number of assigned members per issue.         | `1`     |
| `acceptancePercentage`            | integer | Target acceptance percentage for the metric.          | `50`    |

### Comments in Closed Issues Metric

| Parameter                           | Type    | Description                                              | Example |
| ----------------------------------- | ------- | -------------------------------------------------------- | ------- |
| `activeMetric`                      | boolean | Indicates whether the metric is active or not.           | `true`  |
| `minimumCommentsPerClosedIssue`     | integer | Minimum number of comments per closed issue.             | `1`     |
| `acceptancePercentage`              | integer | Target acceptance percentage for the metric.             | `30`    |

### Assigned GitHub Projects to Issues Metric

| Parameter                        | Type    | Description                                               | Example |
| -------------------------------- | ------- | --------------------------------------------------------- | ------- |
| `activeMetric`                   | boolean | Indicates whether the metric is active or not.            | `true`  |
| `minimumGHProjectsPerIssue`      | integer | Minimum number of GitHub projects per issue.              | `1`     |
| `acceptancePercentage`           | integer | Target acceptance percentage for the metric.             | `50`    |

### Approved Reviews to Merged Pull Requests Metric

| Parameter                                    | Type    | Description                                                     | Example |
| -------------------------------------------- | ------- | --------------------------------------------------------------- | ------- |
| `activeMetric`                               | boolean | Indicates whether the metric is active or not.                  | `true`  |
| `minimumApprovedReviewsPerMergedPullRequests` | integer | Minimum number of approved reviews per merged pull request.     | `1`     |
| `acceptancePercentage`                       | integer | Target acceptance percentage for the metric.                   | `50`    |

## Running Tests

Once you have configured the `config.json` file in the `src` directory to tailor the metrics analysis to your GitHub repository, you can execute the tests from the root directory of your project. To run the tests, use the following command in your terminal:

```bash
npm test
```
