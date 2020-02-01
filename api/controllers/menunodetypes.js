
const {config, sql} = require('../helpers/db-config-helper');
const {logger} = require('../helpers/logging-helper');
const fs = require('fs');

module.exports = {

    //Validation DONE
    index : async (req, res, next) =>{
        
        logger.debug(`Controller method menunodetypes -> index`);

        if(Object.keys(req.query).length <= 0)
        {
            try{
                logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
                const pool = await new sql.ConnectionPool(config).connect();
                logger.trace(`connected to mssql, will create request and execute query`);
                let request =  pool.request();
                let menuNodeTypes = await request.query`select id, name from MenuNodeType`;
                logger.debug(`executed query, result : ${JSON.stringify(menuNodeTypes)}`);
                
        

                logger.trace(`closing sql connection`);
                sql.close();
                logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(menuNodeTypes.recordset)}`);
                res.status(200).json(menuNodeTypes.recordset);
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

                logger.debug(`find menuNodeType query params  : ${JSON.stringify(req.query)}`);
                logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
                const pool = await new sql.ConnectionPool(config).connect();
                logger.trace(`connected to mssql, will create request`);
                let request =  pool.request();
        
                logger.debug(`will execute stored procedure spFindMenuNodeTypes with`);
        
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
                        }
                        
                    }
                }
        
                
                result = await request.execute('spFindMenuNodeTypes');
                
                logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
                let menuNodeTypes = result.recordset;

                menuNodeTypes = menuNodeTypes.map(({TotalCount, ROWNUM, id, name}) => ({id, name}));
                const totalCount = result.recordset.length > 0 ? result.recordset[0]['TotalCount'] : 0 ;
                const response = {totalCount : totalCount, items : menuNodeTypes};


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
    newMenuNodeType: async (req, res, next) =>{

        logger.debug('Controller method menuNodeTypes -> newMenuNodeType');

        try{

            const newMenuNodeTypeBody = req.value.body;
            logger.debug(`add menuNodeType request body  : ${JSON.stringify(req.value.body)}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            logger.debug(`will query for the existence of the menuNodeType in the db`);

            let result = await request.query`select count(*) as count from MenuNodeType where name=${newMenuNodeTypeBody.name}`;
            logger.debug(`executed query, result : ${JSON.stringify(result.recordset)}`);
            const count = result.recordset[0].count;

            if(count > 0)
            {
                const message = "A menuNodeType with the supplied values already exists.";
                logger.trace(`${message} aborting and closing sql conn`);
                sql.close();
                logger.debug(`sql connection closed, sending 409  response to client`);
    
                res.status(409).send(message);
                return;
            }
           

            request =  pool.request();

            logger.debug(`will execute stored procedure spAddMenuNodeType @Name =  ${newMenuNodeTypeBody.name.toUpperCase()}`);
            request.input('Name', newMenuNodeTypeBody.name.toUpperCase());

            result = await request.execute('spAddMenuNodeType');
            
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            const menuNodeType = result.recordset;
            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(menuNodeType)}`);
            res.status(201).json(menuNodeType);

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
    removeMenuNodeType: async(req, res, next) =>{
        
        logger.debug('Controller method menuNodeTypes -> removeMenuNodeType');

        try{
            const {menuNodeTypeId} = req.value.params;
            logger.debug(`delete menuNodeType id  : ${menuNodeTypeId}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            // logger.debug(`will query for the existence of Facets and G2ProductTypes in the db having dependency on this menuNodeType`);
            // logger.debug(`will execute stored procedure spGetMenuNodeTypeDependentsCount @MenuNodeTypeId=${menuNodeTypeId}`);
            // request.input('MenuNodeTypeId', menuNodeTypeId);
            // let result = await request.execute('spGetMenuNodeTypeDependentsCount');
            
            // logger.debug(`executed procedure result : ${JSON.stringify(result.recordset)}`);

            // if(result.recordset[0]['dependents_count'] > 0)
            // {
            //     const message = `There ${result.recordset[0]['dependents_count'] <= 1 ? 'is' : 'are'} ${result.recordset[0]['dependents_count']} Facets and/or G2ProductTypes dependent on this menuNodeType. Please delete ${result.recordset[0]['dependents_count'] <= 1 ? 'it' : 'them'} first.`;
            //     logger.trace(`${message} aborting and closing sql conn`);
            //     sql.close();
            //     logger.debug(`sql connection closed, sending 409  response to client`);
    
            //     res.status(409).send(message);
            //     return;
            // }


            // request =  pool.request();


            logger.debug(`will execute stored procedure spDeleteMenuNodeType @Id=${menuNodeTypeId}`);
            request.input('Id', menuNodeTypeId);
            result = await request.execute('spDeleteMenuNodeType');
            
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