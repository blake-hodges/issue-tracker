
const initialIssues = [
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

const sampleIssue = {
    status: 'New', owner: 'Pieta',
    title: 'Completion date should be optional'
};

const sampleIssue2 = {
    status: 'New', owner: 'Ravan',
    title: 'Completion datsdfsdfsdfsdfsdfsdfe should be optional'
};






class IssueFilter extends React.Component {
    render() {
        return (
            <div>This is a placeholder for the issue salkdjfk filter.</div>
        );
    }
}

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

function IssueRow(props) {
        const style = props.rowStyle;
        const issue = props.issue;
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

class IssueAdd extends React.Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        const form = document.forms.issueAdd;
        const issue = {
            owner: form.owner.value, title: form.title.value, status: 'New',
        }
        this.props.createIssue(issue);
        form.owner.value = ""; form.title.value = "";
    }

    render() {
        return (
            <form name="issueAdd" onSubmit={this.handleSubmit}>
                <input type="text" name="owner" placeholder="Owner" />
                <input type="text" name="title" placeholder="Title" />
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
        this.loadData();

    }

    loadData() {
        setTimeout(() => {
            this.setState({ issues: initialIssues });
        }, 500)
    }
    createIssue(issue) {
        issue.id = this.state.issues.length + 1;
        issue.created = new Date();
        const newIssueList = this.state.issues.slice();
        newIssueList.push(issue);
        this.setState({ issues: newIssueList });
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
