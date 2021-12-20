const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const createUser = async(req, res) => {

    try {

        const user = new userModel({...req.body });

        user.google = false;

        // encrypt password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(req.body.password, salt);

        const userDB = await user.save();

        const token = jwt.sign({ id: userDB._id }, process.env.SECRET_KEY_JWT, {
            expiresIn: '24h'
        })

        res.status(200).json({
            status: 'success',
            token,
            userDB
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            res: false,
            msj: error
        })
    }
}

const getUser = async(req, res) => {

    try {

        const userDB = await userModel.findById(req.params.id);

        if (!userDB) {
            return res.status(404).json({
                res: false,
                message: 'there isnt a user with that id'
            })
        }

        res.status(200).json({
            status: 'success',
            userDB
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            res: false,
            msj: 'there is a problem with the server, talk to the administrator'
        })
    }

}

module.exports = {
    createUser,
    getUser
}