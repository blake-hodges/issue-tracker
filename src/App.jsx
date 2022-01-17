
const issues = [
    {
        id: 1,
        status: 'New',
        owner: 'Ravan',
        effort: 5,
        created: new Date('2022-01-17'),
        due: undefined,
        title: 'Error in console when clicking Add'
    },
    {
        id: 2,
        status: 'Assigned',
        owner: 'Eddie',
        effort: 14,
        created: new Date('2022-01-15'),
        due: new Date('2022-01-20'),
        title: 'Missing bottom border on panel'

    }
]



class IssueFilter extends React.Component {
    render() {
        return (
            <div>This is a placeholder for the issue salkdjfk filter.</div>
        );
    }
}

class IssueTable extends React.Component {
    render() {
        const rowStyle = {border: "1px solid silver", padding: 4};
        const issueRows = issues.map((issue) => <IssueRow key={issue.id} rowStyle={rowStyle} issue={issue} />);
        return (
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
        );
    }
}

class IssueRow extends React.Component {
    render() {
        const style = this.props.rowStyle;
        const issue = this.props.issue;
        return (
            <tr style={style}>
                <td>{issue.id}</td>
                <td>{issue.status}</td>
                <td>{issue.owner}</td>
                <td>{issue.effort}</td>
                <td>{issue.created.toDateString()}</td>
                <td>{issue.due ? issue.due.toDateString() : ''}</td>
                <td>{issue.title}</td>

            </tr>
        )
    }
}

class IssueAdd extends React.Component {
    render() {
        return (
            <div>This is a placeholder for a form to add an issue.</div>
        );
    }
}

class IssueList extends React.Component {
    render() {
        return (
            <React.Fragment>
                <h1>Issue Tracker</h1>
                <IssueFilter />
                <hr />
                <IssueTable />
                <hr />
                <IssueAdd />
            </React.Fragment>
        )
    }
}

const element = <IssueList />


ReactDOM.render(element, document.getElementById("content"));
