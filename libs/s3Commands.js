const { CreateBucketCommand, ListBucketsCommand, PutObjectCommand, GetObjectCommand, ListObjectsCommand, DeleteBucketCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const path = require('path');
const fs = require('fs');
const { s3 } = require('./clients.js');


const createBucket = async (bucketName) => {
    const bucketParams = { Bucket: bucketName };
    try {
        const data = await s3.send(new CreateBucketCommand(bucketParams));
        console.log("Success", data.Location);
        return data;
    } catch (err) {
        console.log("Error", err);
    }
};

const deleteBucket = async (bucketName) => {
    const bucketParams = { Bucket: bucketName };

    try {
        const data = await s3.send(new DeleteBucketCommand(bucketParams));
        console.log("Success - bucket deleted");
        return data;
    } catch (err) {
        console.log("Error", err);
    }
};

const listBuckets = async () => {
    try {
        const data = await s3.send(new ListBucketsCommand({}));
        console.log("Success", data.Buckets);
        return data;
    } catch (err) {
        console.log("Error", err);
    }
};

const listObjects = async (bucketName) => {
    const bucketParams = { Bucket: bucketName };

    try {
        const data = await s3.send(new ListObjectsCommand(bucketParams));
        console.log("Success", data);
        return data;
    } catch (err) {
        console.log("Error", err);
    }
};

const uploadFile = async (bucketName, file, desPath) => {
    const fileStream = fs.createReadStream(file);
    const uploadParams = {
        Bucket: bucketName,
        Key: `${desPath || ''}${path.basename(file)}`,
        Body: fileStream
    };
    try {
        const data = await s3.send(new PutObjectCommand(uploadParams));
        console.log("Success", data);
        return data;
    } catch (err) {
        console.log("Error", err);
    }
};

const downloadFile = async (bucketName, key, desPath) => {
    const bucketParams = {
        Bucket: bucketName,
        Key: key,
    };

    try {
        const data = await s3.send(new GetObjectCommand(bucketParams));
        data.Body.pipe(fs.createWriteStream(desPath))
        console.log("Success", data);
        return data;
    } catch (err) {
        console.log("Error", err);
    }
};

const deleteObject = async (bucketName, key) => {
    const bucketParams = {
        Bucket: bucketName,
        Key: key,
    };

    try {
        const data = await s3.send(new DeleteObjectCommand(bucketParams));
        console.log("Success - object deleted");
        return data;
    } catch (err) {
        console.log("Error", err);
    }
};

module.exports = { createBucket, deleteBucket, listBuckets, listObjects, uploadFile, downloadFile, deleteObject };
