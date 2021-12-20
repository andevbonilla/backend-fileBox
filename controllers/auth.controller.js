const { generateJWT } = require("../helpers/jwt.helper");
const userModel = require("../models/user.model");
const bcrypt = require('bcrypt')

const login = async(req, res) => {

    const { email, password } = req.body;

    try {

        if (!email || !password) {
            return res.status(400).json({
                res: false,
                msj: 'the email and password are required'
            })
        }

        // vaidation if email exist
        const userDB = await userModel.findOne({ email })
        if (!userDB) {
            return res.status(404).json({
                res: false,
                message: 'the password or email are not correct'
            })
        }

        // validation of password
        const validPassword = bcrypt.compareSync(password, userDB.password);
        if (!validPassword) {
            return res.status(400).json({
                res: false,
                message: 'the password or email are not correct'
            })
        }

        // generate a jwt
        const token = await generateJWT(userDB.id);

        res.status(200).json({
            status: 'success',
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            res: false,
            msj: 'there is a problem with the server, talk to the administrator'
        })
    }

}

const renewToken = async(req, res) => {

    const uid = req.uid;

    // generate a jwt
    const token = await generateJWT(uid);

    // obtain user 
    const user = await userModel.findById(uid);
    if (!user) {
        return res.status(404).json({
            msj: 'there was an error'
        })
    }

    res.json({
        token,
        uid,
        user
    })
}



module.exports = {
    login,
    renewToken
}