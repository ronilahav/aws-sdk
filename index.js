const { createBucket, deleteBucket, listBuckets, listObjects, uploadFile, downloadFile, deleteObject } = require('./libs/s3Commands.js');
const { createTable, listTables, describeTable, deleteTable, putItem, putItems, getItem, getItems, deleteItem, deleteItems, query } = require('./libs/dynamodbCommands.js');
const { dogBreeds } = require('./dogBreeds.json');

/*  S3 SDK calls examples   */
const bucketName = 'roni-lahav-sdk-bucket';
createBucket(bucketName);
listBuckets();
uploadFile(bucketName, '../item.json', 'folder/');
downloadFile(bucketName, 'item.json', '../s3-downloads/item.json');
listObjects(bucketName);
deleteObject(bucketName, 'item.json');
deleteBucket(bucketName);


/*  DynamoDB SDK calls examples   */
const convertDogItem = ({ breed, breedType, origin, popularity, temperament, hypoallergenic, intelligence, photo }) => ({
    breed: { S: breed },
    breedType: { S: breedType },
    origin: { S: origin },
    popularity: { S: popularity },
    temperament: { SS: temperament },
    hypoallergenic: { S: hypoallergenic },
    intelligence: { N: `${intelligence}` },
    photo: { S: photo }
});

const tableName = 'dogs';
const tags = [
    { Key: "breed", Value: "S" },
    { Key: "breedType", Value: "S" },
    { Key: "origin", Value: "S" },
    { Key: "popularity", Value: "S" },
    { Key: "temperament", Value: "SS" },
    { Key: "hypoallergenic", Value: "S" },
    { Key: "intelligence", Value: "N" },
    { Key: "photo", Value: "S" }
];

const attributeDefinitions = [{ AttributeName: "breed", AttributeType: "S" }];
const keySchema = [{ AttributeName: "breed", KeyType: "HASH", }];

const item = convertDogItem(dogBreeds[0]);
const items = dogBreeds.map((dog) => convertDogItem(dog));

const key = { breed: { S: 'German Shepard' } }
const keys = [
    { breed: { S: "Golden Retriever" } },
    { breed: { S: "French Bulldog" } }
];

const attributeValues = { ':n': { N: '9' } };
const filterExpression = 'intelligence = :n';
const projectionAttributes = ['breed', 'intelligence'];

createTable(tableName, attributeDefinitions, keySchema, tags);
listTables();
describeTable(tableName);
deleteTable(tableName);
putItem(tableName, item);
getItem(tableName, key);
deleteItem(tableName, key);
putItems(tableName, items);
getItems(tableName, keys);
deleteItems(tableName, keys);
query(tableName, attributeValues, filterExpression, projectionAttributes);
