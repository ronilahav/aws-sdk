const { CreateTableCommand, ListTablesCommand, DescribeTableCommand, DeleteTableCommand, PutItemCommand, GetItemCommand, DeleteItemCommand, BatchWriteItemCommand, BatchGetItemCommand, ScanCommand } = require("@aws-sdk/client-dynamodb");
const { ddb } = require('./clients.js');

const createTable = async (tableName, attributeDefinitions, keySchema, tags) => {
    const params = {
        TableName: tableName,
        AttributeDefinitions: attributeDefinitions,
        KeySchema: keySchema,
        Tags: tags,
        ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
        },
    };

    try {
        const data = await ddb.send(new CreateTableCommand(params));
        console.log("Table Created", data);
        return data;
    } catch (err) {
        console.log("Error", err);
    }
};

const listTables = async () => {
    try {
        const data = await ddb.send(new ListTablesCommand({}));
        console.log(data.TableNames.join("\n"));
        return data.TableNames;
    } catch (err) {
        console.error(err);
    }
};

const describeTable = async (tableName) => {
    const params = { TableName: tableName };

    try {
        const data = await ddb.send(new DescribeTableCommand(params));
        console.log("Success", data.Table);
        return data.Table;
    } catch (err) {
        console.log("Error", err);
    }
};

const deleteTable = async (tableName) => {
    const params = { TableName: tableName };

    try {
        const data = await ddb.send(new DeleteTableCommand(params));
        console.log("Success, table deleted", data);
        return data;
    } catch (err) {
        if (err && err.code === "ResourceNotFoundException") {
            console.log("Error: Table not found");
        } else if (err && err.code === "ResourceInUseException") {
            console.log("Error: Table in use");
        }
    }
};

const putItem = async (tableName, item) => {
    const params = {
        TableName: tableName,
        Item: item
    };

    try {
        const data = await ddb.send(new PutItemCommand(params));
        console.log(data);
        return data;
    } catch (err) {
        console.error(err);
    }
};

const putItems = async (tableName, items) => {
    const putRequests = items.map((item) => ({
        PutRequest: {
            Item: item
        }
    }));

    const params = {
        RequestItems: {
            [tableName]: putRequests
        }
    };

    try {
        const data = await ddb.send(new BatchWriteItemCommand(params));
        console.log("Success, items inserted", data);
        return data;
    } catch (err) {
        console.log("Error", err);
    }
};

const getItem = async (tableName, key) => {
    const params = {
        TableName: tableName,
        Key: key
    };

    const data = await ddb.send(new GetItemCommand(params));
    console.log("Success", data.Item);
    return data;
};

const getItems = async (tableName, keys) => {
    const params = {
        RequestItems: {
            [tableName]: {
                Keys: keys
            },
        },
    };

    try {
        const data = await ddb.send(new BatchGetItemCommand(params));
        console.log("Success, items retrieved", data.Responses[tableName]);
        return data.Responses[tableName];
    } catch (err) {
        console.log("Error", err);
    }
};

const deleteItem = async (tableName, key) => {
    const params = {
        TableName: tableName,
        Key: key
    };

    try {
        const data = await ddb.send(new DeleteItemCommand(params));
        console.log("Success, item deleted", data);
        return data;
    } catch (err) {
        console.log("Error", err);
    }
};

const deleteItems = async (tableName, keys) => {
    const deleteRequest = keys.map((key) => ({
        DeleteRequest: {
            Key: key
        }
    }));

    const params = {
        RequestItems: {
            [tableName]: deleteRequest
        }
    };

    try {
        const data = await ddb.send(new BatchWriteItemCommand(params));
        console.log("Success, items deleted", data);
        return data;
    } catch (err) {
        console.log("Error", err);
    }
};

const query = async (tableName, attributeValues, filterExpression, projectionAttributes) => {
    const params = {
        ExpressionAttributeValues: attributeValues,
        FilterExpression: filterExpression,
        ProjectionExpression: `${projectionAttributes.join(',')}`,
        TableName: tableName
    };

    try {
        const data = await ddb.send(new ScanCommand(params));
        console.log(data.Items);
        return data.Items;
    } catch (err) {
        console.log("Error", err);
    }
};

module.exports = { createTable, listTables, describeTable, deleteTable, putItem, putItems, getItem, getItems, deleteItem, deleteItems, query };
