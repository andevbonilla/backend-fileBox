const { Router } = require('express');
const { getFile, getFiles, uptadeFile, deleteFile, getUrl } = require('../controllers/file.controller');
const { validateJWT } = require('../middlewares/validate-jwt');
const router = Router();
const { v4: uuidv4 } = require('uuid');

const multer = require('multer');
const { uploadImage } = require('../controllers/upload.controller');

// config to upload a file 
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads')
    },
    filename: function(req, file, cb){
        console.log(file.mimetype.split('/').reverse()[0],"lll")
        cb(null, uuidv4() + '.' + file.mimetype.split('/').reverse()[0])
    }
})

const upload = multer({storage: storage})

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