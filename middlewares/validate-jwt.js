const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

const validateJWT = async(req, res, next) => {

    const xtoken = req.header('x-token');

    if (!xtoken) {
        return res.status(401).json({
            msj: 'there isnt token'
        })
    }

    try {

        // verify the token is valid
        const { id, iat } = jwt.verify(xtoken, process.env.SECRET_KEY_JWT);

        // check if the user exists
        const freshUser = await userModel.findById(id);
        if (!freshUser) {
            return res.status(401).json({
                msj: 'the user does not exist'
            })
        }

        // check if the user changed after the token was issued
        if (freshUser.changePasswordAfter(iat)) {
            return res.status(401).json({
                msj: 'the password has changed, so the token is now invalid'
            })
        }

        req.uid = id;
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msj: 'token not valid'
        })
    }


}


module.exports = {
    validateJWT
}