
const {config, sql} = require('../helpers/db-config-helper');
const {logger} = require('../helpers/logging-helper');


module.exports = {

    // //Validation DONE
    index : async (req, res, next) =>{
        
        logger.debug(`Controller method g3products -> index`);

        if(Object.keys(req.query).length <= 0)
        {
            try{
                logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
                const pool = await new sql.ConnectionPool(config).connect();
                logger.trace(`connected to mssql, will create request and execute query`);
                let request =  pool.request();
                let g3products = await request.query`select id, name, code, g2_product_type_id from Product`;
                logger.debug(`executed query, result : ${JSON.stringify(g3products)}`);
                logger.trace(`closing sql connection`);
                sql.close();
                logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(g3products.recordset)}`);
                res.status(200).json(g3products.recordset);
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

                logger.debug(`find g3product query params  : ${JSON.stringify(req.query)}`);
                logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
                const pool = await new sql.ConnectionPool(config).connect();
                logger.trace(`connected to mssql, will create request`);
                let request =  pool.request();
        
                logger.debug(`will execute stored procedure spFindG3Products with`);
        
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

                                request.input('Code',  req.query[queryParamName]);
                                logger.debug('@Code', req.query[queryParamName]);

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
                                    case 'code':
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

                            case 'g2producttypeid':
                            {
                                request.input('G2ProductTypeId',  req.query[queryParamName]);
                                logger.debug('@G2ProductTypeId', req.query[queryParamName]);
                                break;
                            }
                        }
                        
                    }
                }
        
                
                result = await request.execute('spFindG3Products');
                
                logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
                let g3products = result.recordset;
                g3products = g3products.map(({TotalCount, ROWNUM, id, name,code, g2_product_type_id}) => ({id, name,code, g2_product_type_id}));
                const totalCount = result.recordset.length > 0 ? result.recordset[0]['TotalCount'] : 0 ;
                const response = {totalCount : totalCount, items : g3products};
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
      newG3Product: async (req, res, next) =>{

        logger.debug('Controller method g3products -> newG3Product');

        try{

            const g2ProductTypeId = parseInt(req.query['g2ProductTypeId']);
            const newG3ProductBody = req.value.body;
            logger.debug(`add g3product request body  : ${JSON.stringify(req.value.body)}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            logger.debug(`will query for the existence of the g3product in the db`);

            let result = await request.query`select count(*) as count from Product where name=${newG3ProductBody.name} OR code=${newG3ProductBody.code}`;
            logger.debug(`executed query, result : ${JSON.stringify(result.recordset)}`);
            const count = result.recordset[0].count;

            if(count > 0)
            {
                const message = "A G3 product with the supplied values already exists.";
                logger.trace(`${message} aborting and closing sql conn`);
                sql.close();
                logger.debug(`sql connection closed, sending 409  response to client`);
    
                res.status(409).send(message);
                return;
            }
           

            request =  pool.request();

            logger.debug(`will execute stored procedure spAddG3Product @Name =  ${newG3ProductBody.name}, @Code=${newG3ProductBody.code}, @G2ProductId=${g2ProductTypeId}`);
            request.input('Name', newG3ProductBody.name);
            request.input('Code', newG3ProductBody.code);
            request.input('G2ProductId', g2ProductTypeId);
            
            result = await request.execute('spAddG3Product');
            
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            const g3product = result.recordset;
            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(g3product)}`);
            res.status(201).json(g3product);

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
    updateG3Product: async(req, res, next) =>{
        
        logger.debug('Controller method g3products -> updateG3Product');
        try{

            const {g3productId} = req.value.params;
            const modifications = req.value.body;

            logger.debug(`update g3product id  : ${g3productId}`);
            logger.debug(`update g3product request body  : ${JSON.stringify(req.value.body)}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            logger.debug(`will query for the existence of other g3product in the db having same values`);

            let result = await request.query`select count(*) as count from Product where id <> ${g3productId} and (name=${modifications.name} OR code=${modifications.code})`;
            logger.debug(`executed query, result : ${JSON.stringify(result.recordset)}`);
            const count = result.recordset[0].count;

            if(count > 0)
            {
                const message = "No two G3 products can have same value for name or code";
                logger.trace(`${message} aborting and closing sql conn`);
                sql.close();
                logger.debug(`sql connection closed, sending 409  response to client`);
    
                res.status(409).send(message);
                return;
            }

            request = pool.request();
            logger.debug(`will execute stored procedure spUpdateG3Product @Id=${g3productId} @Name =  ${modifications.name},  @Code=${modifications.code}`);
            request.input('Id', g3productId);
            request.input('Name', modifications.name);
            request.input('Code', modifications.code);
            
            result = await request.execute('spUpdateG3Product');
            
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
    removeG3Product: async(req, res, next) =>{
        
        logger.debug('Controller method g3products -> removeG3Product');

        try{
            const {g3productId} = req.value.params;
            logger.debug(`delete g3product id  : ${g3productId}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            logger.debug(`will query for the existence of g3products in the db having dependency on this g3product`);
            logger.debug(`will execute stored procedure spGetG3ProductDependentsCount @G3ProductId=${g3productId}`);
            request.input('G3ProductId', g3productId);
            result = await request.execute('spGetG3ProductDependentsCount');
            
            logger.debug(`executed procedure result : ${JSON.stringify(result.recordset)}`);

            if(result.recordset[0]['dependents_count'] > 0)
            {
                const message = `There ${result.recordset[0]['dependents_count'] <= 1 ? 'is' : 'are'} ${result.recordset[0]['dependents_count']} Product Configs dependent on this G2 Product. Please delete ${result.recordset[0]['dependents_count'] <= 1 ? 'it' : 'them'} first.`;
                logger.trace(`${message} aborting and closing sql conn`);
                sql.close();
                logger.debug(`sql connection closed, sending 409  response to client`);
    
                res.status(409).send(message);
                return;
            }


            request =  pool.request();
            logger.debug(`will execute stored procedure spDeleteG3Product @Id=${g3productId}`);
            request.input('Id', g3productId);
            result = await request.execute('spDeleteG3Product');
            
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