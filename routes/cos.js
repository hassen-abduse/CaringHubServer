const IBM = require('ibm-cos-sdk');
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



module.exports = {
    getItem,
    upload,
}