const fileModel = require("../models/file.model");
const folderModel = require("../models/folder.model");
const { deleteFileAWS, getSignedUrlAWS } = require("../s3/s3");

const getUrl = async(req, res)=>{

    const {key} = req.params
    try {

        const url = await getSignedUrlAWS(key);

        res.json({
            status: 'success',
            url 
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            res: false,
            msj: 'there is a problem with the server, talk to the administrator'
        })
    }
}

const getFile = async(req, res) => {

    const {id} = req.params

    try {

        const fileDB = await fileModel.findById(id);
        if (!fileDB) {
            return res.status(404).json({
                message: 'there isnt a folder with that id'
            })
        }

        res.json({
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

const getFiles = async(req, res) => {

    const { uid, amount } = req.params;

    try {

        // in case the frontend need all the files
        if (parseInt(amount) === 0) {

            const filesDB = await fileModel.find({user:uid})

            return res.json({
                status: "success",
                filesDB
            })
        }

        // in case the frontend need only the more recent files
        const filesDB = await fileModel.find({user:uid}).sort({_id:-1}).limit(parseInt(amount));

        res.json({
            status: "success",
            filesDB
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            res: false,
            msj: 'there is a problem with the server, talk to the administrator'
        })
    }

}

const uptadeFile = async(req, res) => {

    const {id} = req.params;
    const {newName} = req.body;

    try {

        const fileUpdated = await fileModel.findByIdAndUpdate(id,{name: newName},{new:true});

        res.json({
            status: "success",
            fileUpdated
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            res: false,
            msj: 'there is a problem with the server, talk to the administrator'
        })
    }

}

const deleteFile = async(req, res) => { 

    const {fid} = req.params;

    try {

        const deletedFile = await fileModel.findByIdAndRemove(fid, {new:true})

        // delete the file in AWS
        deleteFileAWS(deletedFile.aws_key)
        .then(result => console.log(result))
        .catch(err=> console.log(err))
        

        // delete from the folders
        const foldersWithFile = await folderModel.find({files:fid})

        for (const folder of foldersWithFile) {

            const indexFile = folder.files.findIndex(file=>file === fid)
            folder.files.splice(indexFile, 1);
            await folderModel.findByIdAndUpdate(folder._id, folder, {new: true})

        }

        res.json({
            status: "success",
            deletedFile
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
    getFile,
    getFiles,
    uptadeFile,
    deleteFile,
    getUrl
}