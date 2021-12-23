const { uploadFile } = require("../s3/s3");
const fileModel = require("../models/file.model");
const folderModel = require("../models/folder.model");

const uploadImage = async(req, res) => {

    try {
            
        const file = req.file;

        const folderID = req.params.fid;

        // const resultAWS = await uploadFile(file)

        const fileObject = new fileModel({
            name: file.originalname,
            user: req.params.uid,
            aws_key: file.key
        });

        const fileDB = await fileObject.save();

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
            error,
            msj: 'there is a problem with the server, talk to the administrator'
        })
    }

}

module.exports = {
    uploadImage
}