const express = require('express');
const fs = require('fs');
const { ApolloServer, UserInputError } = require('apollo-server-express');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const { MongoClient } = require('mongodb');
require('dotenv').config()

let aboutMessage = "Issue Tracker API";

const dbUsername = process.env.MONGODB_USER;
const dbPass = process.env.MONGOB_PW;
const database = "issueTracker";


const url = `mongodb+srv://${dbUsername}:${dbPass}@cluster0.0fhve.mongodb.net/${database}?retryWrites=true&w=majority`;

let db;

async function issueList() {
    const issuesDB = await db.collection('issues').find({}).toArray();
    return issuesDB;
}

async function connectToDB() {
    const client = new MongoClient(url,  { useNewUrlParser: true });
    await client.connect();
    console.log('connected to mongodb');
    db = client.db();
}

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
        issueList,
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
    issueValidate(issue);
    issue.created = new Date();
    issue.id = issuesDB.length + 1;
    if (issue.status == undefined) issue.status = 'New';
    issue.effort = 1;
    issuesDB.push(issue);
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





(async function() {
    try {
        await connectToDB();
        app.listen(3001, function() {
            console.log('App started on port 3001')
        });
    } catch (err) {
        console.log("error:", err)
    }
})();
