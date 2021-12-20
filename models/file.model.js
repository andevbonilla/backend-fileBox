const { Schema, model } = require('mongoose');

const fileModel = Schema({
    name: {
        type: String,
        require: [true, 'the name is required'],
        trim: true
    },
    type: {
        type: String,
    },
    aws_key:{
        type: String,
        require: [true, 'the aws key is required']
    },
    createAt: {
        type: Date,
        default: Date.now()
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        require: [true, 'the owner is required']
    }
})


module.exports = model('file', fileModel);