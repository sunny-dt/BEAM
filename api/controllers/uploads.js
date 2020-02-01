const {config, sql} = require('../helpers/db-config-helper');
const {logger} = require('../helpers/logging-helper');
const subpaths = require('../helpers/assests-subpaths');


module.exports = {

 //Validation DONE
 newUpload : async (req, res, next) =>{
        
    logger.debug(`Controller method uploads -> newUpload`);

    
        try {

            console.debug('successfully saved the uploaded svg ', req.file);
            const response = {url : process.env.CLIENT_ASSETS_BASE_URI + subpaths.SVG_FILES + req.file.filename, filename : req.file.filename};
            console.debug(`sent 201 success response to client with json ${JSON.stringify(response)}`);
            res.status(201).json(response);
        }
        catch(error)
        {
            logger.error(error);
            logger.debug(`sending 500 error response to client`);
    
            res.status(500).send(error.name || '');
        }
    },

     //Validation DONE
 newFeaturedUpload : async (req, res, next) =>{
        
    logger.debug(`Controller method uploads -> newFeaturedUpload`);

    
        try {

            console.debug('successfully saved the uploaded png ', req.file);
            const response = {url : process.env.CLIENT_ASSETS_BASE_URI + subpaths.FEATURED_FILES + req.file.filename, filename : req.file.filename};
            console.debug(`sent 201 success response to client with json ${JSON.stringify(response)}`);
            res.status(201).json(response);
        }
        catch(error)
        {
            logger.error(error);
            logger.debug(`sending 500 error response to client`);
    
            res.status(500).send(error.name || '');
        }
    },

    //Validation DONE
 newLatestUpload : async (req, res, next) =>{
        
    logger.debug(`Controller method uploads -> newLatestUpload`);

    
        try {

            console.debug('successfully saved the uploaded png ', req.file);
            const response = {url : process.env.CLIENT_ASSETS_BASE_URI + subpaths.LATEST_FILES + req.file.filename, filename : req.file.filename};
            console.debug(`sent 201 success response to client with json ${JSON.stringify(response)}`);
            res.status(201).json(response);
        }
        catch(error)
        {
            logger.error(error);
            logger.debug(`sending 500 error response to client`);
    
            res.status(500).send(error.name || '');
        }
    },

        //Validation DONE
 newRecommendedUpload : async (req, res, next) =>{
        
    logger.debug(`Controller method uploads -> newRecommendedUpload`);

    
        try {


            console.debug('successfully saved the uploaded png ', req.file);

            const media_type = req.query['media_type'];

            let destFolderLastPathComp = '';
            switch(media_type)
            {
                case 'image':
                    destFolderLastPathComp = 'img/';
                    break;
                case 'video':
                    destFolderLastPathComp = 'vid/';
                    break;
                case 'ppt':
                    destFolderLastPathComp = 'ppt/';
                    break;
                case 'doc':
                    destFolderLastPathComp = 'doc/';
                    break;
                case 'excel':
                    destFolderLastPathComp = 'excel/';
                    break;
                case 'pdf':
                    destFolderLastPathComp = 'pdf/';
                    break;

                default :
                    const e = {name : 'Internal Server Error'};
                    logger.error(e);
                    logger.debug(`sending 500 error response to client`);
                    res.status(500).send(error.name || '');
                    break;

            }


            const response = {url : process.env.CLIENT_ASSETS_BASE_URI + subpaths.METADATA_MEDIA_FILES + destFolderLastPathComp + req.file.filename, filename : req.file.filename};
            console.debug(`sent 201 success response to client with json ${JSON.stringify(response)}`);
            res.status(201).json(response);
        }
        catch(error)
        {
            logger.error(error);
            logger.debug(`sending 500 error response to client`);
    
            res.status(500).send(error.name || '');
        }
    }

}
