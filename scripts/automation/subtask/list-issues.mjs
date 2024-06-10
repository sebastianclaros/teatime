import {getIssuesByState, getMyIssues, getIssueObject, getIssue} from "./github-graphql.mjs";
import {getColored} from "./color.mjs";

const filterType  = process.argv[2] || 'mine';

if ( filterType === 'json' ) {
    const issueNumber = process.argv[3];
    const result = await getIssueObject(issueNumber);
    console.log(result);
}

if ( filterType === 'issue' ) {
    const issueNumber = process.argv[3];
    const result = await getIssue(issueNumber);
    console.log( result.title );
    // Branch    
    if ( result.linkedBranches ) {
        console.log( result.linkedBranches.nodes[0].ref.name );
    } else {
        console.log( 'sin branch' );
    }

    // Labels
    if ( result.labels ) {
        const labels = [];
        for ( const label of result.labels.nodes){
            labels.push ( getColored(label.name, label.color) );
        }    
    
        console.log( labels.join( ' ' ) );
    }

    // Body
    if ( result.body ) {
        console.log( result.body);
    }

    // Comments
    if ( result.comments ) {
        console.log( result.comments);
    }
}

if ( filterType === 'state' ) {
    const state = process.argv[3];
    const result = await getIssuesByState(state);
    console.log( result );
}

if ( filterType === 'mine' ) {
    const result = await getMyIssues();
    console.log( result );
}