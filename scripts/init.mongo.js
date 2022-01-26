db.issues.remove({});

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
];

db.issues.insertMany(issuesDB);

const count = db.issues.count();
print('Inserted', count, 'issues');

db.issues.createIndex({ id: 1 }, { unique: true });
db.issues.createIndex({ status: 1 });
db.issues.createIndex({ owner: 1 });
db.issues.createIndex({ created: 1 });
