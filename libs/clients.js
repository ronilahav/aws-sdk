const { S3Client } = require("@aws-sdk/client-s3");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");


const REGION = "us-east-1";
const s3 = new S3Client({ region: REGION });
const ddb = new DynamoDBClient({ region: REGION });

module.exports = { s3, ddb };
