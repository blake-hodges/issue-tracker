const express = require('express');
const fs = require('fs');
const { ApolloServer, UserInputError } = require('apollo-server-express');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

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

const GraphQLDate = new GraphQLScalarType({
    name: 'GraphQLDate',
    description: 'A Date() type in GraphQL as a scalar',
    serialize(value) {
        return value.toISOString();
    },
    parseValue(value) {
        const dateValue = new Date(value);
        return isNaN(dateValue) ? undefined : dateValue;
    },
    parseLiteral(ast) {
        if (ast.kind == Kind.STRING) {
            const value = new Date(ast.value);
            return isNaN(value) ? undefined : value;
        }
    },
});




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

function issueValidate(issue) {
    const errors = [];
    if (issue.title.length < 3) {
        errors.push('Field "title" must be at least 3 characters long.');
    }
    if (issue.status == 'Assigned' && !issue.owner) {
        errors.push('Field "owner" is required when status is "Assigned"');
    }
    if (errors.length > 0) {
        throw new UserInputError('Invalid input(s)', { errors });
    }
}


function issueAdd(_, { issue }) {
    console.log(issue);
    issueValidate(issue);
    issue.created = new Date();
    issue.id = issueDB.length + 1;
    if (issue.status == undefined) issue.status = 'New';
    issue.effort = 1;
    issueDB.push(issue);
    return issue;
}



const server = new ApolloServer({
    typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
    resolvers,
    formatError: error => {
        console.log(error);
        return error;
    },
});


const app = express();

app.use('/', express.static('public'));

server.applyMiddleware({ app, path: '/graphql' });

app.listen(3001, function() {
    console.log('App started on port 3001')
});
