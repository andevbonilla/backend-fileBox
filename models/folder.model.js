const { Schema, model } = require('mongoose');

const folderModel = Schema({
    name: {
        type: String,
        require: [true, 'the name is required'],
        trim: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        require: [true, 'the owner is required']
    },
    files: [{
        type: Schema.Types.ObjectId,
        ref: 'file'
    }]
})


module.exports = model('folder', folderModel);