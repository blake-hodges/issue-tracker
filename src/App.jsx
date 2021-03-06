import React from 'react';
import ReactDOM from 'react-dom';
//import 'regenerator-runtime/runtime';

const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

function jsonDateReviver(key, value) {
    if (dateRegex.test(value)) return new Date(value);
    return value;
}


async function graphQLFetch(query, variables = {}) {
    try {
        const response = await fetch('/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables })
        });
        const body = await response.text();
        const result = JSON.parse(body, jsonDateReviver);
        if (result.errors) {
            const error = result.errors[0];
            if (error.extensions.code == 'BAD_USER_INPUT') {
                const details = error.extensions.exception.errors.join('\n ');
                alert(`${error.message}:\n ${details}`);
            } else {
                alert(`${error.extensions.code}: ${error.message}`);
            }
        }
        return result.data;
    } catch (e) {
        alert(`Error in sending data to server ${e.message}`);
    }
}


//placeholder for component to filter the list of issues

class IssueFilter extends React.Component {
    render() {
        return (
            <div>This is a placeholder for the issue salkdjfk filter.</div>
        );
    }
}

//component that contains the table of issues

function IssueTable(props) {
        const rowStyle = {border: "1px solid silver", padding: 4};
        const issueRows = props.issues.map((issue) => <IssueRow key={issue.id} rowStyle={rowStyle} issue={issue} />);
        return (
            <>
                <table style={{borderCollapse: "collapse"}}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Status</th>
                            <th>Owner</th>
                            <th>Effort</th>
                            <th>Created</th>
                            <th>Due</th>
                            <th>Title</th>
                        </tr>
                    </thead>
                    <tbody>
                        {issueRows}
                    </tbody>
                </table>
            </>
        )
}

//component that contains the row that holds an individual issue and its properties
function IssueRow(props) {
        const style = props.rowStyle;
        const issue = props.issue;
        return (
            <tr style={style}>
                <td>{issue.id ? issue.id : " "}</td>
                <td>{issue.status ? issue.status : " "}</td>
                <td>{issue.owner ? issue.owner : " "}</td>
                <td>{issue.effort ? issue.effort : " "}</td>
                <td>{issue.created.toDateString()}</td>
                <td>{issue.due ? issue.due.toDateString() : ' '}</td>
                <td>{issue.title ? issue.title : " "}</td>
            </tr>
        )
}

//component to hold a form to add a new issue
class IssueAdd extends React.Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    //function to handle the submitted data from the form
    handleSubmit(e) {
        e.preventDefault();
        const form = document.forms.issueAdd;
        const issue = {
            owner: form.owner.value,
            title: form.title.value,
            //set a new due date that is 10 days from now (ms*s*min*hours*days)
            due: new Date(new Date().getTime() + 1000*60*60*24*10),
            status: form.status.value
        }
        //pass new issue to the createIssue method passed in props from the IssueList component
        this.props.createIssue(issue);
        form.owner.value = ""; form.title.value = "";
    }

    render() {
        return (
            <form name="issueAdd" onSubmit={this.handleSubmit}>
                <input type="text" name="owner" placeholder="Owner" />
                <input type="text" name="title" placeholder="Title" />
                <select name="status">
                    <option value="New">New</option>
                    <option value="Assigned">Assigned</option>
                    <option value="Fixed">Fixed</option>
                    <option value="Closed">Closed</option>
                </select>
                <button>Add</button>
            </form>
        );
    }
}

class IssueList extends React.Component {
    constructor() {
        super();
        this.state = { issues: [] };
        this.createIssue = this.createIssue.bind(this);

    }

    componentDidMount() {
        this.loadData()
    }


    async loadData() {
        const query = `query {
            issueList {
                id
                title
                status
                owner
                created
                effort
                due
            }
        }`;

        const data = await graphQLFetch(query);
        if (data) {
            this.setState({ issues: data.issueList})
        }
    }

    async createIssue(issue) {

        const query = `mutation issueAdd($issue: IssueInputs!) {
            issueAdd(issue: $issue) {
                id
            }
        }`;

        const data = await graphQLFetch(query, { issue });
        if (data) {
            this.loadData();
        }
    }



    render() {
        return (
            <React.Fragment>
                <h1>Issue Tracker</h1>
                <IssueFilter />
                <hr />
                <IssueTable issues={this.state.issues}/>
                <hr />
                <IssueAdd createIssue={this.createIssue} />
            </React.Fragment>
        )
    }
}

const element = <IssueList />


ReactDOM.render(element, document.getElementById("content"));
