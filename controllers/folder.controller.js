const folderModel = require("../models/folder.model");
const fileModel = require("../models/file.model");

const createFolder = async(req, res)=>{
    try {

        const folder = new folderModel({...req.body });

        const folderDB = await folder.save();

        res.status(200).json({
            status: 'success',
            folderDB
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            res: false,
            msj: 'there is a problem with the server, talk to the administrator'
        })
    }
}

const getFolders = async(req, res)=>{

    const {uid} = req.params
    try {

        const foldersDB = await folderModel.find({user:uid})
        
        res.status(200).json({
            status: 'success',
            foldersDB
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            res: false,
            msj: 'there is a problem with the server, talk to the administrator'
        })
    }
}

const getFolder = async(req, res)=>{

    const {id} = req.params
    try {

        const folderDB = await folderModel.findById(id).populate({ path: 'files', model: 'file' })
        if (!folderDB) {
            return res.status(404).json({
                res: false,
                msj: 'there isnt a folder with that id'
            })
        }
        
        res.status(200).json({
            status: 'success',
            folderDB
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            res: false,
            msj: 'there is a problem with the server, talk to the administrator'
        })
    }
}

const moveFileToFolder = async(req, res)=>{

    const {fileId,foldersIds} = req.body;


    try {

        const fileDB = await fileModel.findById(fileId);
        if (!fileDB) {
            return res.status(404).json({
                res: false,
                msj: 'there isnt a file with that id'
            })
        }

        for (const folderId of foldersIds) {

            const folderDB = await folderModel.findById(folderId);
            if (!folderDB) {
                return res.status(404).json({
                    res: false,
                    msj: 'some of the folder ids is not a correct id'
                })
            }

            const result = folderDB.files.find(id=> id.toString() === (fileDB._id).toString());

            if (result === undefined) {

                await folderModel.findByIdAndUpdate(folderId, {files: [...folderDB.files, fileDB._id]} ,{new:true})
            
            }
              
        }
        
        res.status(200).json({
            status: 'success',
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            res: false,
            msj: 'there is a problem with the server, talk to the administrator'
        })
    }
}

const deleteFolder = async(req, res)=>{

    const {id} = req.params;
    try {

        const folderDB = await folderModel.findByIdAndDelete(id, {new:true});
        
        res.status(200).json({
            status: 'success',
            folderDB
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            res: false,
            msj: 'there is a problem with the server, talk to the administrator'
        })
    }

}

const updateFolder = async(req, res)=>{

    const {id} = req.params;
    const {newName} = req.body;
    try {

        const folderDB = await folderModel.findByIdAndUpdate(id, {name: newName} , {new:true});
        
        res.status(200).json({
            status: 'success',
            folderDB
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
    createFolder,
    getFolders,
    getFolder,
    moveFileToFolder,
    deleteFolder,
    updateFolder
}