const express = require('express');
const fs = require('fs');
const { ApolloServer } = require('apollo-server-express');
const GraphQLDate = require('./graphql_date.js');

let aboutMessage = "Issue Tracker API";

const issueDB = [
    {
        id: 1,
        status: 'New',
        owner: 'Ravan',
        effort: 5,
        created: new Date('2022-01-17'),
        due: new Date('2022-01-20'),
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

    },
    {
        id: 3,
        status: 'New',
        owner: 'Blake',
        effort: 1,
        created: new Date('2022-01-15'),
        due: new Date('2022-01-15'),
        title: ""
    }
]




const resolvers = {
    Query: {
        about: () => aboutMessage,
        issueList: () => issueDB,
    },
    Mutation: {
        setAboutMessage,
        issueAdd,
    },
    GraphQLDate,
};

function setAboutMessage(_, { message }) {
    return aboutMessage = message;
}


function issueAdd(_, { issue }) {
    issue.created = new Date();
    issue.id = issueDB.length + 1;
    if (issue.status = undefined) issue.status = 'New';
    issueDB.push(issue);
    console.log(issue);
    return issue;
}

const server = new ApolloServer({
    typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
    resolvers,
});


const app = express();

app.use('/', express.static('public'));

server.applyMiddleware({ app, path: '/graphql' });

app.listen(3001, function() {
    console.log('App started on port 3001')
});
