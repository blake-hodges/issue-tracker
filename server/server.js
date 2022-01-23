const express = require('express');
const fs = require('fs');
const { ApolloServer } = require('apollo-server-express');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

let aboutMessage = "Issue Tracker API";

const issuesDB = [
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



const GraphQLDate = new GraphQLScalarType({
    name: 'GraphQLDate',
    description: 'A Date() type in GraphQL as a scalar',
    serialize(value) {
        return value.toISOString();
    },
    parseValue(value) {
        return new Date(value);
    },
    parseLiteral(ast) {
        return (ast.kind == Kind.STRING) ? new Date(ast.value) : undefined;
    },
});


const resolvers = {
    Query: {
        about: () => aboutMessage,
        issueList: () => issuesDB
    },
    Mutation: {
        setAboutMessage,
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
