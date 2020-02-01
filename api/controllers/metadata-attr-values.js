

const {config, sql} = require('../helpers/db-config-helper');
const {logger} = require('../helpers/logging-helper');


module.exports = {


    updateAttrValue : async(req, res, next) =>{

        logger.debug('Controller method metadata-attr-values -> updateAttrValue');
        try{

            const {attrValueMapId} = req.value.params;
            const modifications = req.value.body;

            logger.debug(`update attrValueMap id  : ${attrValueMapId}`);
            logger.debug(`update attrValueMap request body  : ${JSON.stringify(req.value.body)}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();


            logger.debug(`will execute stored procedure spUpdateAttrValue @Id=${attrValueMapId} @AttrNameId =  ${modifications.attr_name_id}, @Value = ${modifications.value}`);
            request.input('Id', attrValueMapId);
            request.input('AttrNameId', modifications.attr_name_id);
            request.input('Value', modifications.value);
 
            const attrValueDescription = new sql.Table('MenuMetadataAttrValueDescMap');
			attrValueDescription.columns.add('id', sql.Int);
			attrValueDescription.columns.add('descriptionValue', sql.VarChar(100));
            
            let valueDescriptionArray = modifications.descriptionValue;
			for(var descriptionValue of valueDescriptionArray) {
											 
				attrValueDescription.rows.add("", descriptionValue.description);
            }
            
            request.input('MenuMetadataAttrValueDescMap', attrValueDescription);
			
            result = await request.execute('spUpdateAttrValue');
            
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
    removeAttrValue: async(req, res, next) =>{

        logger.debug('Controller method metadata-attr-values -> removeAttrValue');

        try{
            const {attrValueMapId} = req.value.params;
            logger.debug(`delete media id  : ${attrValueMapId}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

        

            logger.debug(`will execute stored procedure spDeleteAttrValue @Id=${attrValueMapId}`);
            request.input('Id', attrValueMapId);
            result = await request.execute('spDeleteAttrValue');
            
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