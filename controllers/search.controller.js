const fileModel = require("../models/file.model");
const folderModel = require("../models/folder.model");


searchFoldersFiles = async(req, res) =>{

    try {

        const searchParam = req.params.search;
     

        const regex = new RegExp(searchParam, 'i');

        const [fileResults, folderResults] = await Promise.all([
            fileModel.find({ name: regex, user: req.uid}),
            folderModel.find({ name: regex, user: req.uid})
        ])

        res.json({
            status: 'success',
            fileResults,
            folderResults
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
    searchFoldersFiles
}