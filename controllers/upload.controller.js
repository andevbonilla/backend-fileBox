const { uploadFile, getSignedUrlAWS } = require("../s3/s3");

const fs = require('fs');
const util = require('util');
const fileModel = require("../models/file.model");
const folderModel = require("../models/folder.model");
const removeFile = util.promisify(fs.unlink);

const uploadImage = async(req, res) => {

    try {

        const file = req.file;

        const folderID = req.params.fid;

        const resultAWS = await uploadFile(file)

        const typeOfFile = resultAWS.Location.split('.').reverse()[0]

        let typeFile;

        if (typeOfFile === 'png' || typeOfFile === 'jpeg' || typeOfFile === 'jpg' || typeOfFile === 'gif') {
            typeFile = 'image'
        }

        if (typeOfFile === 'mp4') {
            typeFile = 'video'
        }

        if (typeOfFile === 'mp3') {
            typeFile = 'audio'
        }

        if (typeOfFile === 'pdf') {
            typeFile = 'pdf'
        }


        const fileObject = new fileModel({
            name: file.originalname,
            user: req.params.uid,
            type: typeFile,
            aws_key: resultAWS.Key
        });

        const fileDB = await fileObject.save();

        await removeFile(file.path)

        if (folderID !== "no-folder") {


            const folderDB = await folderModel.findById(folderID);
            if (!folderDB) {
                return res.status(404).json({
                    message: 'there isnt a folder with that id'
                })
            }
            
            folderDB.files.push(fileDB._id); 

            const newFolder = await folderModel.findByIdAndUpdate(folderID, folderDB,{new:true}).populate({path: 'files', model: 'file'})

            return res.status(200).json({
                status: 'success',
                fileDB,
                newFolder
            })

        }

        res.status(200).json({
            status: 'success',
            fileDB
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
    uploadImage
}