import {getValidateIssueColumn} from "./github.mjs";


const issueNumber = process.argv[2];
const column  = process.argv[3];
const issue = await getValidateIssueColumn(issueNumber, column);