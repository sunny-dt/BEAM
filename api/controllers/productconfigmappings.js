
const {config, sql} = require('../helpers/db-config-helper');
const {logger} = require('../helpers/logging-helper');
const _ = require('underscore');

module.exports = {

    // //Validation DONE
    index : async (req, res, next) =>{
        
        logger.debug(`Controller method productconfigmappings -> index`);

        try{

            const productConfigId = parseInt(req.query['productConfigId']);
           
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();


            logger.debug(`will execute stored procedure spGetFacetGroupsAndChamberMappingsForProductConfig @ProductConfigId =  ${productConfigId}`);
            request.input('ProductConfigId', productConfigId);
            
            result = await request.execute('spGetFacetGroupsAndChamberMappingsForProductConfig');
            
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            const mappings = result.recordset;

            let groups = _.groupBy(mappings, function(value){
                return value.facet_group_name;
            });

            let data = _.map(groups, function(group){
                return {
                    facet_group_name: group[0].facet_group_name,
                    facet_group_id : group[0].facet_group_id,
                    chambers: _.pluck(group, 'chambers')
                }
            });

            data = {items : data};
            
            


            logger.debug(`result -> ${JSON.stringify(data)}`)

            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(data)}`);
            res.status(201).json(data);

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
    newProductConfigMapping: async (req, res, next) =>{

        logger.debug('Controller method productconfigmappings -> newProductConfigMapping');

        try{

            const productConfigId = parseInt(req.query['productConfigId']);
            const newProductConfigMappingBody = req.value.body;
            logger.debug(`add ProductConfigMapping request body  : ${JSON.stringify(req.value.body)}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();


            const facetIdsList = new sql.Table('IdList');
            facetIdsList.columns.add('id', sql.Int);
            for(var facetId of newProductConfigMappingBody.facetIds)
            {
                facetIdsList.rows.add(facetId);
            }


            const chamberIdsList = new sql.Table('IdList');
            chamberIdsList.columns.add('id', sql.Int);
            for(var chamberId of newProductConfigMappingBody.chamberIds)
            {
                chamberIdsList.rows.add(chamberId);
            }



            logger.debug(`will execute stored procedure spAddFacetsChambersGrouping @ProductConfigId=${productConfigId}, @FacetsList=${JSON.stringify(newProductConfigMappingBody.facetIds)}, @ChambersList = ${JSON.stringify(newProductConfigMappingBody.chamberIds)}`);
            request.input('ProductConfigId', productConfigId);
            request.input('FacetsList', facetIdsList);
            request.input('ChambersList', chamberIdsList);


            
            let result = await request.execute('spAddFacetsChambersGrouping');
            
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            
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

            if(error.class == 16)
            {

            }
            logger.debug(`sql connection closed, sending 500 error response to client`);

            res.status(500).send(error.message || '');
        }
        
    },


     //Validation DONE
     updateProductConfigMapping: async(req, res, next) =>{
        
        logger.debug('Controller method productconfigs -> updateProductConfigMapping');
        try{

            const {productConfigMappingId} = req.value.params;
            const modifications = req.value.body;

            logger.debug(`update productConfigMapping id  : ${productConfigMappingId}`);
            logger.debug(`update productConfigMapping request body  : ${JSON.stringify(req.value.body)}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            logger.debug(`will query for the existence of other productConfigMapping in the db having same values`);

            let result = await request.query`select count(*) as count from ProductConfigMapping where id <> ${productConfigMappingId} and product_name=${modifications.product_name}`;
            logger.debug(`executed query, result : ${JSON.stringify(result.recordset)}`);
            const count = result.recordset[0].count;

            if(count > 0)
            {
                const message = "No two Product Configs can have same value for name";
                logger.trace(`${message} aborting and closing sql conn`);
                sql.close();
                logger.debug(`sql connection closed, sending 409  response to client`);
    
                res.status(409).send(message);
                return;
            }

            request = pool.request();
            logger.debug(`will execute stored procedure spUpdateProductConfigMapping @Id=${productConfigMappingId} @ProductName =  ${modifications.product_name}`);
            request.input('Id', productConfigMappingId);
            request.input('ProductName', modifications.product_name);
            
            result = await request.execute('spUpdateProductConfigMapping');
            
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
    removeProductConfigMapping: async(req, res, next) =>{
        
        logger.debug('Controller method productconfigmappings -> removeProductConfigMapping');

        try{
            const productConfigId = parseInt(req.query['productConfigId']);
            const {facetGroupId} = req.value.params;
            logger.debug(`delete mappings for facetGroupId id  : ${facetGroupId}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

           
            // request =  pool.request();
            logger.debug(`will execute stored procedure spDeleteFacetsChambersGrouping @ProductConfigId=${productConfigId}, @FacetGroupId=${facetGroupId}`);
            request.input('ProductConfigId', productConfigId);
            request.input('FacetGroupId', facetGroupId);
            result = await request.execute('spDeleteFacetsChambersGrouping');
            
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