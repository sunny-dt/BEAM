
const {config, sql} = require('../helpers/db-config-helper');
const {logger} = require('../helpers/logging-helper');


module.exports = {

    // //Validation DONE
    // index : async (req, res, next) =>{
        
    //     logger.debug(`Controller method recommended -> index`);

    //     try {

    //         const {explorermenunodeId} = req.value.params;

    //         logger.debug(`find recommended query params  : ${JSON.stringify(req.query)}`);
    //         logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
    //         const pool = await new sql.ConnectionPool(config).connect();
    //         logger.trace(`connected to mssql, will create request`);
    //         let request =  pool.request();
    


    //         logger.debug(`will execute stored procedure spGetRecommendedForMenuNode with @MenuNodeId = ${explorermenunodeId}`);
    
    //         request.input('MenuNodeId', explorermenunodeId);
    //         result = await request.execute('spGetRecommendedForMenuNode');
            
    //         logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
    //         let recommended = result.recordset;
    //         const totalCount = recommended.length;
    //         const totalCount = result.recordset.length > 0 ? result.recordset[0]['TotalCount'] : 0 ;
    //         const response = {totalCount : totalCount, items : recommended};
    //         logger.trace(`will close sql connection`);
    //         sql.close();
    //         logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(response)}`);
    //         res.status(200).json(response);
    //     }
    //     catch(error)
    //     {
    //         logger.error(error);
    //         logger.trace(`error caught, closing sql connection`);
    //         sql.close();
    //         logger.debug(`sql connection closed, sending 500 error response to client`);
    
    //         res.status(500).send(error.name || '');
    //     }
        
    // },

    //Validation DONE
    newRecommended: async (req, res, next) =>{

        logger.debug('Controller method recommended -> newRecommended');

        try{

            const newRecommendedBody = req.value.body;
            logger.debug(`add Recommended request body  : ${JSON.stringify(req.value.body)}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            // logger.debug(`will query for the existence of the recommended in the db`);

            // let result = await request.query`select count(*) as count from G2ProductType where name=${newG2ProductBody.name} OR rnd_product_name=${newG2ProductBody.rnd_product_name} OR rnd_product_code=${newG2ProductBody.rnd_product_code}`;
            // logger.debug(`executed query, result : ${JSON.stringify(result.recordset)}`);
            // const count = result.recordset[0].count;

            // if(count > 0)
            // {
            //     const message = "A g2product with the supplied values already exists.";
            //     logger.trace(`${message} aborting and closing sql conn`);
            //     sql.close();
            //     logger.debug(`sql connection closed, sending 409  response to client`);
    
            //     res.status(409).send(message);
            //     return;
            // }
           

            // request =  pool.request();






            logger.debug(`will execute stored procedure spAddRecommended @UiType =  ${newRecommendedBody.ui_type}, @LinkedElementType = ${newRecommendedBody.linked_element_type}, @LinkedElementId=${newRecommendedBody.linked_element_id}, @TypeTitle=${newRecommendedBody.type_title}, @Title=${newRecommendedBody.title}, @Subtitle=${newRecommendedBody.sub_title}, @ImageLink=${newRecommendedBody.image_link}, @SerialOrder=${newRecommendedBody.serial_order}, @CreatedById=${req.user.employeeID || ''}, @CreatedByName=${req.user.firstname || ''} ${req.user.lastname || ''} `);
            request.input('UiType', newRecommendedBody.ui_type);
            request.input('LinkedElementType', newRecommendedBody.linked_element_type);
            request.input('LinkedElementId', newRecommendedBody.linked_element_id);
            request.input('TypeTitle', newRecommendedBody.type_title);
            request.input('Title', newRecommendedBody.title);
            request.input('Subtitle', newRecommendedBody.sub_title);
            request.input('ImageLink', newRecommendedBody.image_link);
            request.input('ImageFilename', newRecommendedBody.image_filename);
            request.input('SerialOrder', newRecommendedBody.serial_order);
            request.output('RecommendedCreatedId', sql.Int, 0);

            request.input('CreatedById', `${req.user.employeeID || ''}`);
            request.input('CreatedByName', `${req.user.firstname || ''} ${req.user.lastname || ''}`);

            
            
            result = await request.execute('spAddRecommended');

            const featureId = request.parameters.RecommendedCreatedId.value;
            
            
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            logger.trace(`featureId (request.parameters.RecommendedCreatedId.value)  : ${featureId}`);

            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify({success : true})}`);
            res.status(201).json({success : true});

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
    updateRecommended: async(req, res, next) =>{
        
        logger.debug('Controller method recommended -> updateRecommended');
        try{

            const {recommendedId} = req.value.params;
            const modifications = req.value.body;

            logger.debug(`update recommended id  : ${recommendedId}`);
            logger.debug(`update recommendedId request body  : ${JSON.stringify(req.value.body)}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            // logger.debug(`will query for the existence of other g2product in the db having same values`);

            // let result = await request.query`select count(*) as count from G2ProductType where id <> ${g2productId} and (name=${modifications.name} OR rnd_product_name=${modifications.rnd_product_name} OR rnd_product_code=${modifications.rnd_product_code})`;
            // logger.debug(`executed query, result : ${JSON.stringify(result.recordset)}`);
            // const count = result.recordset[0].count;

            // if(count > 0)
            // {
            //     const message = "No two g2products can have same value for name, r&d product name or r&d product code";
            //     logger.trace(`${message} aborting and closing sql conn`);
            //     sql.close();
            //     logger.debug(`sql connection closed, sending 409  response to client`);
    
            //     res.status(409).send(message);
            //     return;
            // }

            // request = pool.request();



            logger.debug(`will execute stored procedure spUpdateRecommended @Id=${recommendedId} @UiType =  ${modifications.ui_type}, @LinkedElementType = ${modifications.linked_element_type}, @LinkedElementId=${modifications.linked_element_id}, @TypeTitle=${modifications.type_title}, @Title=${modifications.title}, @Subtitle=${modifications.sub_title}, @ImageLink=${modifications.image_link}, @SerialOrder=${modifications.serial_order}, @ModifiedById=${req.user.employeeID || ''}, @ModifiedByName=${req.user.firstname || ''} ${req.user.lastname || ''}`);
            request.input('Id', recommendedId);
            request.input('UiType', modifications.ui_type);
            request.input('LinkedElementType', modifications.linked_element_type);
            request.input('LinkedElementId', modifications.linked_element_id);
            request.input('TypeTitle', modifications.type_title);
            request.input('Title', modifications.title);
            request.input('Subtitle', modifications.sub_title);
            request.input('ImageLink', modifications.image_link);
            request.input('ImageFilename', modifications.image_filename);
            request.input('SerialOrder', modifications.serial_order);

            request.input('ModifiedById', `${req.user.employeeID || ''}`);
            request.input('ModifiedByName', `${req.user.firstname || ''} ${req.user.lastname || ''}`);
            
            result = await request.execute('spUpdateRecommended');
            
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
    removeRecommended: async(req, res, next) =>{
        
        logger.debug('Controller method recommended -> removeRecommended');

        try{
            const {recommendedId} = req.value.params;
            logger.debug(`delete recommended id  : ${recommendedId}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            // logger.debug(`will query for the existence of g3products in the db having dependency on this g2product`);
            // logger.debug(`will execute stored procedure spGetG2ProductDependentsCount @G2ProductId=${g2productId}`);
            // request.input('G2ProductId', g2productId);
            // result = await request.execute('spGetG2ProductDependentsCount');
            
            // logger.debug(`executed procedure result : ${JSON.stringify(result.recordset)}`);

            // if(result.recordset[0]['dependents_count'] > 0)
            // {
            //     const message = `There ${result.recordset[0]['dependents_count'] <= 1 ? 'is' : 'are'} ${result.recordset[0]['dependents_count']} G3 Products dependent on this G2 Product. Please delete ${result.recordset[0]['dependents_count'] <= 1 ? 'it' : 'them'} first.`;
            //     logger.trace(`${message} aborting and closing sql conn`);
            //     sql.close();
            //     logger.debug(`sql connection closed, sending 409  response to client`);
    
            //     res.status(409).send(message);
            //     return;
            // }


            // request =  pool.request();

            logger.debug(`will execute stored procedure spDeleteRecommended @Id=${recommendedId}`);
            request.input('Id', recommendedId);
            result = await request.execute('spDeleteRecommended');
            
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
};