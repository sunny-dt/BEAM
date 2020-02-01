
const {config, sql} = require('../helpers/db-config-helper');
const {logger} = require('../helpers/logging-helper');


module.exports = {

    //Validation DONE
    index : async (req, res, next) =>{
        
        logger.debug(`Controller method g2products -> index`);

        if(Object.keys(req.query).length <= 0)
        {
            try{
                logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
                const pool = await new sql.ConnectionPool(config).connect();
                logger.trace(`connected to mssql, will create request and execute query`);
                let request =  pool.request();
                let g2products = await request.query`select id, name, rnd_product_name, rnd_product_code, platform_id from G2ProductType`;
                logger.debug(`executed query, result : ${JSON.stringify(g2products)}`);
                logger.trace(`closing sql connection`);
                sql.close();
                logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(g2products.recordset)}`);
                res.status(200).json(g2products.recordset);
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

                logger.debug(`find g2product query params  : ${JSON.stringify(req.query)}`);
                logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
                const pool = await new sql.ConnectionPool(config).connect();
                logger.trace(`connected to mssql, will create request`);
                let request =  pool.request();
        
                logger.debug(`will execute stored procedure spFindG2Products with`);
        
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

                                request.input('RndProductName',  req.query[queryParamName]);
                                logger.debug('@RndProductName', req.query[queryParamName]);
        
                                request.input('RndProductCode',  req.query[queryParamName]);
                                logger.debug('@RndProductCode', req.query[queryParamName]);

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
                                    case 'rnd_product_name':
                                    case 'rnd_product_code':
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

                            case 'platformid':
                            {
                                request.input('PlatformId',  req.query[queryParamName]);
                                logger.debug('@PlatformId', req.query[queryParamName]);
                                break;
                            }
                        }
                        
                    }
                }
        
                
                result = await request.execute('spFindG2Products');
                
                logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
                let g2products = result.recordset;
                g2products = g2products.map(({TotalCount, ROWNUM, id, name, rnd_product_name, rnd_product_code, platform_id}) => ({id, name, rnd_product_name, rnd_product_code, platform_id}));
                const totalCount = result.recordset.length > 0 ? result.recordset[0]['TotalCount'] : 0 ;
                const response = {totalCount : totalCount, items : g2products};
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
    newG2Product: async (req, res, next) =>{

        logger.debug('Controller method g2products -> newG2Product');

        try{

            const newG2ProductBody = req.value.body;
            logger.debug(`add g2product request body  : ${JSON.stringify(req.value.body)}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            logger.debug(`will query for the existence of the g2product in the db`);

            let result = await request.query`select count(*) as count from G2ProductType where name=${newG2ProductBody.name} OR rnd_product_name=${newG2ProductBody.rnd_product_name} OR rnd_product_code=${newG2ProductBody.rnd_product_code}`;
            logger.debug(`executed query, result : ${JSON.stringify(result.recordset)}`);
            const count = result.recordset[0].count;

            if(count > 0)
            {
                const message = "A g2product with the supplied values already exists.";
                logger.trace(`${message} aborting and closing sql conn`);
                sql.close();
                logger.debug(`sql connection closed, sending 409  response to client`);
    
                res.status(409).send(message);
                return;
            }
           

            request =  pool.request();

            logger.debug(`will execute stored procedure spAddG2Product @Name =  ${newG2ProductBody.name}, @RndProductName = ${newG2ProductBody.rnd_product_name}, @RndProductCode=${newG2ProductBody.rnd_product_code}`);
            request.input('Name', newG2ProductBody.name);
            request.input('RndProductName', newG2ProductBody.rnd_product_name);
            request.input('RndProductCode', newG2ProductBody.rnd_product_code);
            request.input('PlatformId', parseInt(req.query['platformId']));
            
            result = await request.execute('spAddG2Product');
            
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            const g2product = result.recordset;
            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(g2product)}`);
            res.status(201).json(g2product);

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
    // getG2Product: async(req, res, next) =>{
    //     const {g2productId} = req.value.params;
    //     const g2product = await G2Product.findById(g2productId);
    //     if(!g2product)
    //     {
    //         return res.status(404).json({
    //             error: {
    //                 message: "The specified g2product doesn't exist"
    //             }
    //         });
    //     }
    //     res.status(200).json(g2product);
    // },

    // //Validation DONE
    // replaceG2Product: async(req, res, next) =>{
    //     const {g2productId} = req.value.params;
    //     const newG2Product = req.value.body;
    //     const result = await G2Product.findByIdAndUpdate(g2productId, newG2Product);
    //     res.status(200).json({success : true});
    // },

    //Validation DONE
    updateG2Product: async(req, res, next) =>{
        
        logger.debug('Controller method g2products -> updateG2Product');
        try{

            const {g2productId} = req.value.params;
            const modifications = req.value.body;

            logger.debug(`update g2product id  : ${g2productId}`);
            logger.debug(`update g2product request body  : ${JSON.stringify(req.value.body)}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            logger.debug(`will query for the existence of other g2product in the db having same values`);

            let result = await request.query`select count(*) as count from G2ProductType where id <> ${g2productId} and (name=${modifications.name} OR rnd_product_name=${modifications.rnd_product_name} OR rnd_product_code=${modifications.rnd_product_code})`;
            logger.debug(`executed query, result : ${JSON.stringify(result.recordset)}`);
            const count = result.recordset[0].count;

            if(count > 0)
            {
                const message = "No two g2products can have same value for name, r&d product name or r&d product code";
                logger.trace(`${message} aborting and closing sql conn`);
                sql.close();
                logger.debug(`sql connection closed, sending 409  response to client`);
    
                res.status(409).send(message);
                return;
            }

            request = pool.request();
            logger.debug(`will execute stored procedure spUpdateG2Product @Id=${g2productId} @Name =  ${modifications.name}, @RndProductName = ${modifications.rnd_product_name}, @RndProductCode=${modifications.rnd_product_code}`);
            request.input('Id', g2productId);
            request.input('Name', modifications.name);
            request.input('RndProductName', modifications.rnd_product_name);
            request.input('RndProductCode', modifications.rnd_product_code);
            
            result = await request.execute('spUpdateG2Product');
            
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
    removeG2Product: async(req, res, next) =>{
        
        logger.debug('Controller method g2products -> removeG2Product');

        try{
            const {g2productId} = req.value.params;
            logger.debug(`delete g2product id  : ${g2productId}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            logger.debug(`will query for the existence of g3products in the db having dependency on this g2product`);
            logger.debug(`will execute stored procedure spGetG2ProductDependentsCount @G2ProductId=${g2productId}`);
            request.input('G2ProductId', g2productId);
            result = await request.execute('spGetG2ProductDependentsCount');
            
            logger.debug(`executed procedure result : ${JSON.stringify(result.recordset)}`);

            if(result.recordset[0]['dependents_count'] > 0)
            {
                const message = `There ${result.recordset[0]['dependents_count'] <= 1 ? 'is' : 'are'} ${result.recordset[0]['dependents_count']} G3 Products dependent on this G2 Product. Please delete ${result.recordset[0]['dependents_count'] <= 1 ? 'it' : 'them'} first.`;
                logger.trace(`${message} aborting and closing sql conn`);
                sql.close();
                logger.debug(`sql connection closed, sending 409  response to client`);
    
                res.status(409).send(message);
                return;
            }


            request =  pool.request();
            logger.debug(`will execute stored procedure spDeleteG2Product @Id=${g2productId}`);
            request.input('Id', g2productId);
            result = await request.execute('spDeleteG2Product');
            
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

    // },

   

    // getG2ProductChambers : async(req, res, next) =>{

    //     logger.debug('Controller method g2products -> getG2ProductChambers');

    //     try
    //     {
    //         const {g2productId} = req.value.params;
    //         logger.debug(`params passed : ${JSON.stringify(req.value.params)}`);
    //         logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
    //         const pool = await new sql.ConnectionPool(config).connect();
    //         logger.trace(`connected to mssql, will create request`);
    //         let request =  pool.request();
    //         logger.debug(`will execute stored procedure spGetChambersByG2ProductId @SelectedG2ProductId =  ${g2productId}`);
    //         request.input('SelectedG2ProductId', g2productId);
    //         result = await request.execute('spGetChambersByG2ProductId');
    //         logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
    //         const chambers = result.recordset;
    //         logger.trace(`will close sql connection`);
    //         sql.close();
    //         logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(chambers)}`);
    //         res.status(200).json(chambers);
    //     }
    //     catch
    //     {
    //         logger.error(error);
    //         logger.trace(`error caught, closing sql connection`);
    //         sql.close();
    //         logger.debug(`sql connection closed, sending 500 error response to client`);
    //         res.status(500).send(error.name || '');

    //     }
       
     }
};