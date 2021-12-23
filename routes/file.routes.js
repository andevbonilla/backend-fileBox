const { Router } = require('express');
const { getFile, getFiles, uptadeFile, deleteFile, getUrl } = require('../controllers/file.controller');
const { validateJWT } = require('../middlewares/validate-jwt');
const router = Router();
const { v4: uuidv4 } = require('uuid');

const multer = require('multer');
const multerS3 = require('multer-s3')
const { uploadImage } = require('../controllers/upload.controller');
const S3 = require('aws-sdk/clients/s3');

const s3 = new S3({
    region: process.env.AWS_BUCKET_REGION,
    accessKeyId: process.env.AWS_PUBLIC_KEY,
    secretAccessKey: process.env.AWS_PRIVATE_KEY,
    signatureVersion: 'v4'
})

// config to upload a file 
// const storage = multer.diskStorage({
//     destination: function(req, file, cb){
//         cb(null, 'uploads')
//     },
//     filename: function(req, file, cb){
//         cb(null, uuidv4() + '.' + file.mimetype.split('/').reverse()[0])
//     }
// })

const upload = multer(
    {
        storage: multerS3({
          s3: s3,
          bucket: process.env.AWS_BUCKET_NAME,
          metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
          },
          key: function (req, file, cb) {
            cb(null, uuidv4().toString() + '.' + file.mimetype.split('/').reverse()[0])
          }
        })
      }
)

// upload an image
router.post('/upload-image/:uid/:fid', [validateJWT, upload.single('fileImg')], uploadImage);

// get the file
router.get('/:id', validateJWT, getFile); 

// get files 
router.get('/files/:uid/:amount', validateJWT, getFiles);

// get files 
router.get('/url/:key', validateJWT, getUrl);

// uptade file
router.put('/:id', validateJWT, uptadeFile);

// delete a file
router.delete('/:fid', validateJWT, deleteFile)

module.exports = router;