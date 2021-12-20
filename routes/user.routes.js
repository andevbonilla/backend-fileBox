const { Router } = require('express');
const { createUser, getUser } = require('../controllers/user.controller');
const { validateJWT } = require('../middlewares/validate-jwt');
const router = Router();

// create a user
router.post('/create', createUser);

// get the user
router.get('/:id', validateJWT, getUser);


module.exports = router;