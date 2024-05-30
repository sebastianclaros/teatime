import { Octokit} from "octokit";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const owner = 'sebastianclaros';
const repo = 'teatime';

const octokit = new Octokit({
    auth: GITHUB_TOKEN
});


export async function getValidateIssueColumn(issueNumber, columnName) {
    const issue = await getIssue(issueNumber);
    console.log( issue);
    
}

export async function getIssue(issueNumber){
    const result = await octokit.request(`GET /repos/${owner}/${repo}/issues/${issueNumber}`, {
        headers: {
        'X-GitHub-Api-Version': '2022-11-28'
    }
    });
    if ( result.status === 200 ) {
        return result.data;
    }
    return null;
}

export async function getIssues(){
    let issues = [];
    const result = await octokit.request(`GET /repos/${owner}/${repo}/issues`, {
        headers: {
        'X-GitHub-Api-Version': '2022-11-28'
    }
    });
    if ( result.status === 200 ) {
        for ( const issue of result.data) {
            const labels = issue.labels.map( label=> label.name );
            const assignees = issue.assignees.map( assignee => assignee.login );
            issues.push( { body: issue.body, labels, assignees, state: issue.state, number: issue.number, title: issue.title } );
        }
    }
    return issues;
}