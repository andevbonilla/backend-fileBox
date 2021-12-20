const { Router } = require('express');
const { login, renewToken } = require('../controllers/auth.controller');
const { validateJWT } = require('../middlewares/validate-jwt');
const router = Router();

router.post('/login', login);

router.get('/renew-token', validateJWT, renewToken);



module.exports = router;