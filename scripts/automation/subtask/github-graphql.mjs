import { graphql } from "@octokit/graphql";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OWNER = 'sebastianclaros';
const REPO = 'stockventa';
const PROJECT_NUMBER = 3;

const repoVar = { owner: OWNER, repo: REPO }
const graphqlAuth = graphql.defaults({
  headers: {
    authorization: `Bearer ${GITHUB_TOKEN}`,
    "X-Github-Next-Global-ID": 1
  },
});

async function getUser() {
  const query = `{
    viewer {
      login
      id
    }
  }`;
  const {viewer } = await graphqlAuth(query);
  return viewer;
}

async function getColumnValueMap() {
  const query = `
      query getFieldOptions($owner:String!, $repo: String!, $projectNumber: Int!) {
        repository(owner: $owner, name: $repo) {
          projectV2(number: $projectNumber) {
            field(name: "Status") {
              ... on ProjectV2SingleSelectField {
                id
                name
                options {
                  name
                  id
                }
              }                
            }
          }
        }
      }
  `; 

  const { repository } = await graphqlAuth(query, { projectNumber: PROJECT_NUMBER,...repoVar});

  let mapValues = {}
  for ( const option of repository.projectV2.field.options ) {
    mapValues[option.name] = option.id;
  }
  return mapValues;
}

export async function moveIssue(issueNumber, columnName) {
  const issue = await getIssue(issueNumber);
  const itemId = issue.projectItems.nodes[0].id;
  const projectId = issue.projectItems.nodes[0].project.id;
  const fieldId = issue.projectItems.nodes[0].fieldValueByName.field.id;
  const mapValues = await getColumnValueMap();
  const columnValue = mapValues[columnName]; 
  const mutation = `
  mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $columnValue: String!) {
    updateProjectV2ItemFieldValue(
      input: {
        projectId: $projectId,
        itemId: $itemId,
        fieldId: $fieldId,
        value: {singleSelectOptionId: $columnValue}
      }
    ) {
      clientMutationId
    }
  }`;
  const {clientMutationId } = await graphqlAuth(mutation, { projectId, itemId, fieldId, columnValue });
  return clientMutationId ? true: false ;  
}

export async function assignIssueToMe(issueNumber) {
  const user = await getUser();
  const issue = await getIssue(issueNumber);
  const mutation = `
    mutation assignUser( $issueId: ID!, $userId: ID!) { 
      addAssigneesToAssignable(input: {
        assignableId: $issueId
        assigneeIds: [ $userId ]
      }) {
        assignable {
          assignees {
            totalCount
          }
        }
      } 
    }    
  `;
  const {addAssigneesToAssignable } = await graphqlAuth(mutation, { issueId: issue.id, userId: user.id });
  return addAssigneesToAssignable.assignable.assignees.totalCount > 0 ;  
}

export async function getCommit(commitSha) {
  const query = `
    query getCommit($owner:String!, $repo: String!, $commitSha: String!) {
      repository(owner: $owner, name: $repo) {
        object(expression: $commitSha) {
              ... on Commit {
                id
                oid
              }
            }
      }
    } `; 
  const { repository } = await graphqlAuth(query, { commitSha,...repoVar});
  return repository.object; 
}

export async function assignBranchToIssue(issueNumber, branchName, commitSha) {
  const issue = await getIssue(issueNumber);  
  const commit = await getCommit(commitSha);
  const mutation = `
    mutation createLinkedBranch( $issueId: ID!, $oid: GitObjectID!, $branchName: String!) { 
      createLinkedBranch(input: {
        issueId: $issueId
        oid: $oid
        name: $branchName
      })
      {
        clientMutationId
      }
    }`;
  const {clientMutationId } = await graphqlAuth(mutation, { issueId: issue.id, oid: commit.oid, branchName });
  return clientMutationId ? true: false ;  

}

export async function getValidateIssueColumn(issueNumber, columnName) {
    const issue = await getIssue(issueNumber);
}


/*
query ($owner:String!, $repo: String!, $issueNumber: Int!) {
  repository(owner: $owner, name: $repo) {
    issue(number: $issueNumber) {
      title
      linkedBranches(last:1){
      	  nodes {
          	  ref {
          	    name
          	  }
          }
      }
    }
  }
}
*/  

export async function getIssueState(issueNumber){
  const issue = await getIssue(issueNumber);
  return issue.projectItems?.nodes[0]?.fieldValueByName?.name;
}

export async function getMyIssues(issueNumber){

}

export async function getIssueObject(issueNumber){
  const result = await getIssue(issueNumber);
  const addFields = {};
  if ( result.linkedBranches.nodes.length > 0 ) {
    addFields.branch = result.linkedBranches.nodes[0].ref.name;
    delete result.linkedBranches;
  }

  if ( result.projectItems.nodes.length > 0 ) {
    addFields.state = result.projectItems.nodes[0].fieldValueByName.name;
    delete result.projectItems;
  }

  return { ...addFields,  ...result};
}

export async function getRepository(){
  const query = `
      query getRepo($owner:String!, $repo: String!) {
        repository(owner: $owner, name: $repo) {
          id
        }
      }
  `; 

  const { repository } = await graphqlAuth(query, repoVar );

  return repository;
}

export async function getIssue(issueNumber){
  const query = `
      query getIssue($owner:String!, $repo: String!, $issueNumber: Int!) {
        repository(owner: $owner, name: $repo) {
          issue(number: $issueNumber) {
            title
            id
            labels(first:3, orderBy:  { field: CREATED_AT, direction: DESC}) {
              nodes {
                color
                name
              }
            }
            projectItems(last: 1) {
              nodes{
                id, 
                project {
                  id
                }
                fieldValueByName(name: "Status"){
      						... on ProjectV2ItemFieldSingleSelectValue {
                    name
                    id
                    field {
                      ... on ProjectV2SingleSelectField {
                        id
                      }
                    }
                  }
                }
              }
            }             
            linkedBranches(last:1){
                nodes {
                    ref {
                      id
                      name
                    }
                }
            }
          }
        }
      }
  `; 

  const { repository } = await graphqlAuth(query, { issueNumber: parseInt(issueNumber),...repoVar});

  return repository.issue;
}

export async function getIssuesByState(state){
    // let issues = [];
    // const result = await octokit.request(`GET /repos/${owner}/${repo}/issues`, {
    //     headers: {
    //     'X-GitHub-Api-Version': '2022-11-28'
    // }
    // });
    // if ( result.status === 200 ) {
    //     for ( const issue of result.data) {
    //         const labels = issue.labels.map( label=> label.name );
    //         const assignees = issue.assignees.map( assignee => assignee.login );
    //         issues.push( { body: issue.body, labels, assignees, state: issue.state, number: issue.number, title: issue.title } );
    //     }
    // }
    // return issues;
}