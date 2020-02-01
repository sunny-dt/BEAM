
const {config, sql} = require('../helpers/db-config-helper');
const {logger} = require('../helpers/logging-helper');


module.exports = {

    // //Validation DONE
    index : async (req, res, next) =>{
        
        logger.debug(`Controller method productconfigs -> index`);

        if(Object.keys(req.query).length <= 0)
        {
            try{
                logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
                const pool = await new sql.ConnectionPool(config).connect();
                logger.trace(`connected to mssql, will create request and execute query`);
                let request =  pool.request();
                let productconfigs = await request.query`select id, product_name, product_id from ProductConfig`;
                logger.debug(`executed query, result : ${JSON.stringify(productconfigs)}`);
                logger.trace(`closing sql connection`);
                sql.close();
                logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(productconfigs.recordset)}`);
                res.status(200).json(productconfigs.recordset);
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
        else
        {
            try {

                logger.debug(`find productconfig query params  : ${JSON.stringify(req.query)}`);
                logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
                const pool = await new sql.ConnectionPool(config).connect();
                logger.trace(`connected to mssql, will create request`);
                let request =  pool.request();
        
                logger.debug(`will execute stored procedure spFindProductConfigs with`);
        
                for (var queryParamName in req.query) {
                    if (req.query.hasOwnProperty(queryParamName)) {
        
                        
                        switch(queryParamName.toLowerCase())
                        {
                            case 'filter':
                            {
                                request.input('Id', parseInt(req.query[queryParamName]) || 0);
                                logger.debug('@Id', parseInt(req.query[queryParamName]) || 0);
        
                                request.input('Name',  req.query[queryParamName]);
                                logger.debug('@Name', req.query[queryParamName]);

                                break;
                            }
        
                            case 'page':
                            {
                                request.input('PageNo',  parseInt(req.query[queryParamName]) || 1);
                                logger.debug('@PageNo', parseInt(req.query[queryParamName]) || 1);
        
                                break;
                            }
        
                            case 'pagesize':
                            {
                                request.input('PageSize',  parseInt(req.query[queryParamName]) || 10);
                                logger.debug('@PageSize', parseInt(req.query[queryParamName]) || 10);
        
                                break;
                            }
        
                            case 'sortby':
                            {
                                switch(req.query[queryParamName].toLowerCase())
                                {
                                    case 'id':
                                    case 'name':
                                    {
                                        request.input('SortColumn',  req.query[queryParamName]);
                                        logger.debug('@SortColumn', req.query[queryParamName]);
                                        break;
                                    }
                                }
                        
                                break;
                            }
        
                            case 'sortorder':
                            {
                                
                                switch(req.query[queryParamName].toLowerCase())
                                {
                                    case 'asc':
                                    case 'desc':
                                    {
                                        request.input('SortOrder',  req.query[queryParamName]);
                                        logger.debug('@SortOrder', req.query[queryParamName]);
                                        break;
                                    }
                                }
        
                                break;
                            }

                            case 'g3productid':
                            {
                                request.input('G3ProductId',  req.query[queryParamName]);
                                logger.debug('@G3ProductId', req.query[queryParamName]);
                                break;
                            }
                        }
                        
                    }
                }
        
                
                result = await request.execute('spFindProductConfigs');
                
                logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
                let productconfigs = result.recordset;
                productconfigs = productconfigs.map(({TotalCount, ROWNUM, id, product_name, product_id}) => ({id, product_name, product_id}));
                const totalCount = result.recordset.length > 0 ? result.recordset[0]['TotalCount'] : 0 ;
                const response = {totalCount : totalCount, items : productconfigs};
                logger.trace(`will close sql connection`);
                sql.close();
                logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(response)}`);
                res.status(200).json(response);
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
    
    },

    //Validation DONE
    newProductConfig: async (req, res, next) =>{

        logger.debug('Controller method productconfigs -> newProductConfig');

        try{

            const g3ProductId = parseInt(req.query['g3productId']);
            const newProductConfigBody = req.value.body;
            logger.debug(`add ProductConfig request body  : ${JSON.stringify(req.value.body)}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            logger.debug(`will query for the existence of the productConfig in the db`);

            let result = await request.query`select count(*) as count from ProductConfig where product_name=${newProductConfigBody.product_name}`;
            logger.debug(`executed query, result : ${JSON.stringify(result.recordset)}`);
            const count = result.recordset[0].count;

            if(count > 0)
            {
                const message = "A Config with the supplied values already exists.";
                logger.trace(`${message} aborting and closing sql conn`);
                sql.close();
                logger.debug(`sql connection closed, sending 409  response to client`);
    
                res.status(409).send(message);
                return;
            }
           

            request =  pool.request();

            logger.debug(`will execute stored procedure spAddProductConfig @ProductName =  ${newProductConfigBody.product_name}, @G3ProductId=${g3ProductId}`);
            request.input('ProductName', newProductConfigBody.product_name);
            request.input('G3ProductId', g3ProductId);
            
            result = await request.execute('spAddProductConfig');
            
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            const productConfig = result.recordset;
            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(productConfig)}`);
            res.status(201).json(productConfig);

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
    getFacets: async(req, res, next) =>{
        logger.debug('Controller method productconfigs -> getFacets');

        try{
            const {productConfigId} = req.value.params;
            logger.debug(`getFacets by productConfig id  : ${productConfigId}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            logger.debug(`will execute stored procedure spGetAllFacetsForProductConfig @ProductConfigId=${productConfigId}`);
            request.input('ProductConfigId', productConfigId);
            let result = await request.execute('spGetAllFacetsForProductConfig');
            
            let facets = result.recordset;

            let data = {items : facets};
            logger.debug(`executed procedure result : ${JSON.stringify(data)}`);
            
            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(data)}`);
            
            res.status(200).json(data);
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


    getChambers: async(req, res, next) =>{
        logger.debug('Controller method productconfigs -> getChambers');

        try{
            const {productConfigId} = req.value.params;
            logger.debug(`getFacets by productConfig id  : ${productConfigId}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            logger.debug(`will execute stored procedure spGetAllChambersForProductConfig @ProductConfigId=${productConfigId}`);
            request.input('ProductConfigId', productConfigId);
            let result = await request.execute('spGetAllChambersForProductConfig');
            
            let chambers = result.recordset;

            let data = {items : chambers};
            logger.debug(`executed procedure result : ${JSON.stringify(data)}`);
            
            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(data)}`);
            
            res.status(200).json(data);
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

    // //Validation DONE
    // replaceProduct: async(req, res, next) =>{
    //     const {productId} = req.value.params;
    //     const newProduct = req.value.body;
    //     const result = await Product.findByIdAndUpdate(productId, newProduct);
    //     res.status(200).json({success : true});
    // },

     //Validation DONE
     updateProductConfig: async(req, res, next) =>{
        
        logger.debug('Controller method productconfigs -> updateProductConfig');
        try{

            const {productConfigId} = req.value.params;
            const modifications = req.value.body;

            logger.debug(`update productConfig id  : ${productConfigId}`);
            logger.debug(`update productConfig request body  : ${JSON.stringify(req.value.body)}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            logger.debug(`will query for the existence of other productConfig in the db having same values`);

            let result = await request.query`select count(*) as count from ProductConfig where id <> ${productConfigId} and product_name=${modifications.product_name}`;
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
            logger.debug(`will execute stored procedure spUpdateProductConfig @Id=${productConfigId} @ProductName =  ${modifications.product_name}`);
            request.input('Id', productConfigId);
            request.input('ProductName', modifications.product_name);
            
            result = await request.execute('spUpdateProductConfig');
            
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
    removeProductConfig: async(req, res, next) =>{
        
        logger.debug('Controller method productconfigs -> removeProductConfig');

        try{
            const {productConfigId} = req.value.params;
            logger.debug(`delete productConfig id  : ${productConfigId}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            // logger.debug(`will query for the existence of productConfigs in the db having dependency on this productConfig`);
            // logger.debug(`will execute stored procedure spGetProductConfigDependentsCount @ProductConfigId=${productConfigId}`);
            // request.input('ProductConfigId', productConfigId);
            // result = await request.execute('spGetProductConfigDependentsCount');
            
            // logger.debug(`executed procedure result : ${JSON.stringify(result.recordset)}`);

            // if(result.recordset[0]['dependents_count'] > 0)
            // {
            //     const message = `There ${result.recordset[0]['dependents_count'] <= 1 ? 'is' : 'are'} ${result.recordset[0]['dependents_count']} mappings dependent on this ProductConfig. Please delete ${result.recordset[0]['dependents_count'] <= 1 ? 'it' : 'them'} first.`;
            //     logger.trace(`${message} aborting and closing sql conn`);
            //     sql.close();
            //     logger.debug(`sql connection closed, sending 409  response to client`);
    
            //     res.status(409).send(message);
            //     return;
            // }


            // request =  pool.request();
            logger.debug(`will execute stored procedure spDeleteProductConfig @Id=${productConfigId}`);
            request.input('Id', productConfigId);
            result = await request.execute('spDeleteProductConfig');
            
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