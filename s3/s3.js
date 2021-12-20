const S3 = require('aws-sdk/clients/s3');
const fs = require('fs');

const s3 = new S3({
    region: process.env.AWS_BUCKET_REGION,
    accessKeyId: process.env.AWS_PUBLIC_KEY,
    secretAccessKey: process.env.AWS_PRIVATE_KEY,
    signatureVersion: 'v4'
})

// upload to s3
const uploadFile = (file) => {

    const fileStream = fs.createReadStream(file.path);

    let uploadParams;

    if (file.mimetype.toString() === 'application/pdf') {

        uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME, 
            Body: fileStream,
            Key: file.filename,
            ContentType: file.mimetype
        }
    
    }else{

        uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME, 
            Body: fileStream,
            Key: file.filename,
            // ContentType: file.mimetype
        }

    }

    return s3.upload(uploadParams).promise();
} 

// delete the file in AWS
const deleteFileAWS = (fileKey) => {

    const deleteParams = {
        Bucket: process.env.AWS_BUCKET_NAME, 
        Key: fileKey, 
    }

    return s3.deleteObject(deleteParams).promise();
} 

const getSignedUrlAWS = (fileKey) => {

    const getParams = {
        Bucket: process.env.AWS_BUCKET_NAME, 
        Key: fileKey,
    }
    return s3.getSignedUrlPromise('getObject', getParams )
} 


module.exports = {
    uploadFile,
    deleteFileAWS,
    getSignedUrlAWS
}