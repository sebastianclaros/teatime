import {moveIssue} from "./github-graphql.mjs";

const issueNumber = process.argv[2];
const columnName  = process.argv[3];
const result = await moveIssue(issueNumber, columnName);