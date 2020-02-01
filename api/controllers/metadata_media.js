

const {config, sql} = require('../helpers/db-config-helper');
const {logger} = require('../helpers/logging-helper');


module.exports = {


   updateMedia : async(req, res, next) => {

    logger.debug('Controller method metadata_media -> updateMedia');
    try{

        const {mediaId} = req.value.params;
        const modifications = req.value.body;

    

        logger.debug(`update media id  : ${mediaId}`);
        logger.debug(`update media request body  : ${JSON.stringify(req.value.body)}`);

        logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
        const pool = await new sql.ConnectionPool(config).connect();
        logger.trace(`connected to mssql, will create request`);
        let request =  pool.request();

        logger.debug(`will execute stored procedure spUpdateMedia @Id = ${mediaId} @MediaFilename =  ${modifications.media_filename} @MediaFileUrl = ${modifications.media_file_url} @MediaType = ${modifications.media_type} @SerialOrder = ${modifications.serial_order}  `);
        request.input('Id', mediaId);
        request.input('MediaFilename', modifications.media_filename);
        request.input('MediaFileUrl', modifications.media_file_url);
        request.input('MediaType', modifications.media_type);
        request.input('SerialOrder', modifications.serial_order);
        request.input('ModifiedById', `${req.user.employeeID || ''}`);
        request.input('ModifiedByName', `${req.user.firstname || ''} ${req.user.lastname || ''}`);
        
        
        result = await request.execute('spUpdateMedia');
        
        logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
        logger.trace(`will close sql connection`);
        sql.close();
        logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify({success : true})}`);

        res.status(200).json({success : true});
    }
    catch(error)
    {
        logger.error(error);
        logger.trace(`error caught, closing sql connection`);
        sql.close();
        logger.debug(`sql connection closed, sending 500 error response to client`);

        res.status(500).send(error.name || '');
    }
   },

    //Validation DONE
    removeMedia: async(req, res, next) =>{

        logger.debug('Controller method metadata_media -> removeMedia');

        try{
            const {mediaId} = req.value.params;
            logger.debug(`delete media id  : ${mediaId}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

        

            logger.debug(`will execute stored procedure spDeleteMedia @Id=${mediaId}`);
            request.input('Id', mediaId);
            result = await request.execute('spDeleteMedia');
            
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            
            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify({success : true})}`);
            
            res.status(200).json({success : true});
        }
        catch(error)
        {
            logger.error(error);
            logger.trace(`error caught, closing sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 500 error response to client`);

            res.status(500).send(error.name || '');
        }
    
    }

}