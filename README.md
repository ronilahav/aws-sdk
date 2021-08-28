# aws-sdk

A **Node.js** library for easy use of the **AWS-SDK** commands library for **S3** and **DynamoDB**.

### S3:
Buckets and Object creation, deletion and listing.
```javascript
const { createBucket } = require('./libs/s3Commands.js');


const bucketName = 'bucket-name';

createBucket(bucketName);
```

### DynamoDB:
Tables creating, deleting, listing and querying.  
Items inserting, getting and deleting.
```javascript
const { getItem } = require('./libs/dynamodbCommands.js');


const tableName = 'table-name';
const key = { key: { type: value } }

getItem(tableName, key);
```
