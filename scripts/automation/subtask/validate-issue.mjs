import assert from "assert";
import {getIssueState} from "./github-graphql.mjs";

const compareStates = ( state ) => state.toLocaleLowerCase().replace(' ', '');
const issueNumber = process.argv[2];
const column  = process.argv[3];
const state = await getIssueState(issueNumber);

if ( compareStates(column) === compareStates(state) ){
    process.exit(0) ;
} else {
    console.error(`El issue ${issueNumber} esta en ${state} en vez de ${column}`);
    process.exit(-1) ;
} 
