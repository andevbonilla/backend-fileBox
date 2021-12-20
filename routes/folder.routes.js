const { Router } = require('express');
const { createFolder, getFolders, getFolder, moveFileToFolder, updateFolder, deleteFolder } = require('../controllers/folder.controller');
const { validateJWT } = require('../middlewares/validate-jwt');
const router = Router();

// create a user
router.post('/create', validateJWT , createFolder);

// get user's folders
router.get('/:uid', validateJWT, getFolders);

// get one folder
router.get('/folder/:id', validateJWT, getFolder);

// update the files of the folder
router.put('/add/file', validateJWT, moveFileToFolder);

// update the name of the folder
router.put('/:id', validateJWT, updateFolder);

// delete the folder
router.delete('/:id', validateJWT, deleteFolder);


module.exports = router;