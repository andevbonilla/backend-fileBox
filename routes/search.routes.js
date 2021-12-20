const { Router } = require('express');
const { searchFoldersFiles } = require('../controllers/search.controller');
const { validateJWT } = require('../middlewares/validate-jwt');
const router = Router();

// search files
router.get('/:search', validateJWT, searchFoldersFiles);


module.exports = router;