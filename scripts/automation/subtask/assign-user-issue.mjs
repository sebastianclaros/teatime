import {assignIssueToMe} from "./github-graphql.mjs";

const issueNumber = process.argv[2];
const userName  = process.argv[3];
const result = await assignIssueToMe(issueNumber, userName);