import {assignBranchToIssue} from "./github-graphql.mjs";

const issueNumber = process.argv[2];
const branchName  = process.argv[3];
const commitSha = process.argv[4];
const result = await assignBranchToIssue(issueNumber, branchName, commitSha);