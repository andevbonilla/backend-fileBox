const { Schema, model } = require('mongoose');

const UserModel = Schema({
    username: {
        type: String,
        require: [true, 'the username is required'],
        trim: true
    },
    email: {
        type: String,
        require: [true, 'the email is required'],
        unique: [true, 'the email must be unique'],
        trim: true
    },
    password: {
        type: String,
        require: [true, 'the password is required'],
    },
    img: {
        type: String
    },
    createAt: {
        type: Date,
        default: Date.now()
    },
    google: {
        type: Boolean,
        default: false
    },
    passwordChangeAt: {
        type: Date
    }
})

UserModel.methods.changePasswordAfter = function(JWTtimeStamp) {

    if (this.passwordChangeAt) {

        const changeTimeStamp = parseInt(this.passwordChangeAt.getTime() / 1000, 10);

        console.log(changeTimeStamp, JWTtimeStamp, 'jjjj');

        return JWTtimeStamp < changeTimeStamp

    }
    return false;

}

module.exports = model('user', UserModel);