const IBM = require('ibm-cos-sdk');
const multer = require('multer')
const multerS3 = require('multer-s3')



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