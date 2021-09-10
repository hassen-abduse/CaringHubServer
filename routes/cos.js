const IBM = require('ibm-cos-sdk');
const fs = require('fs')
const async = require('async')
const multer = require('multer')
const multerS3 = require('multer-s3')



const config = {
    endpoint: 's3.ap.cloud-object-storage.appdomain.cloud',
    apiKeyId: "qqUZmxXwFLhhJ_OUS5d6sUDrgy6yWndyo4MECrcvKbIG",
    serviceInstanceId: "crn:v1:bluemix:public:cloud-object-storage:global:a/27f357709a524adf89e61384dd782600:76a869b7-8f0b-4e4d-9be9-459c28240e40::",
    credentials: new IBM.Credentials('be8e4045e45f4a34990bac6ff9340872', '8195c18bf4c532395292874adf8afd8af833486c37cc2638', sessionToken = null),
    signatureVersion: 'v2',


}
var cos = new IBM.S3(config);

var upload = multer({
    storage: multerS3({
        s3: cos,
        bucket: 'caringhub',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, file.originalname)
        }
    })
})

function getItem(bucketName, itemName) {
    console.log(`Retrieving item from bucket: ${bucketName}, key: ${itemName}`);
    return cos.getObject({
        Bucket: bucketName,
        Key: itemName
    }).promise()
        .then((data) => {
            if (data != null) {
                const url = cos.getSignedUrl('getObject', { Bucket: bucketName, Key: itemName, Expires: 31536000 })
                console.log(url)
                return url
            }
        })
        .catch((e) => {
            console.error(`ERROR: ${e.code} - ${e.message}\n`);
        });
}

function multiPartUpload(bucketName, itemName, filePath) {
    var uploadID = null;

    if (!fs.existsSync(filePath)) {
        log.error(new Error(`The file \'${filePath}\' does not exist or is not accessible.`));
        return;
    }

    console.log(`Starting multi-part upload for ${itemName} to bucket: ${bucketName}`);
    return cos.createMultipartUpload({
        Bucket: bucketName,
        Key: itemName
    }).promise()
        .then((data) => {
            uploadID = data.UploadId;

            //begin the file upload        
            fs.readFile(filePath, (e, fileData) => {
                //min 5MB part
                var partSize = 1024 * 1024 * 5;
                var partCount = Math.ceil(fileData.length / partSize);

                async.timesSeries(partCount, (partNum, next) => {
                    var start = partNum * partSize;
                    var end = Math.min(start + partSize, fileData.length);

                    partNum++;

                    console.log(`Uploading to ${itemName} (part ${partNum} of ${partCount})`);

                    cos.uploadPart({
                        Body: fileData.slice(start, end),
                        Bucket: bucketName,
                        Key: itemName,
                        PartNumber: partNum,
                        UploadId: uploadID
                    }).promise()
                        .then((data) => {
                            next(e, { ETag: data.ETag, PartNumber: partNum });
                        })
                        .catch((e) => {
                            cancelMultiPartUpload(bucketName, itemName, uploadID);
                            console.error(`ERROR: ${e.code} - ${e.message}\n`);
                        });
                }, (e, dataPacks) => {
                    cos.completeMultipartUpload({
                        Bucket: bucketName,
                        Key: itemName,
                        MultipartUpload: {
                            Parts: dataPacks
                        },
                        UploadId: uploadID
                    }).promise()
                        .then(console.log(`Upload of all ${partCount} parts of ${itemName} successful.`))
                        .catch((e) => {
                            cancelMultiPartUpload(bucketName, itemName, uploadID);
                            console.error(`ERROR: ${e.code} - ${e.message}\n`);
                        });
                });
            });
        })
        .catch((e) => {
            console.error(`ERROR: ${e.code} - ${e.message}\n`);
        });
}

function cancelMultiPartUpload(bucketName, itemName, uploadID) {
    return cos.abortMultipartUpload({
        Bucket: bucketName,
        Key: itemName,
        UploadId: uploadID
    }).promise()
        .then(() => {
            console.log(`Multi-part upload aborted for ${itemName}`);
        })
        .catch((e) => {
            console.error(`ERROR: ${e.code} - ${e.message}\n`);
        });
}


module.exports = {
    multiPartUpload,
    getItem,
    upload
}