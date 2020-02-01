
const {config, sql} = require('../helpers/db-config-helper');
const {logger} = require('../helpers/logging-helper');


module.exports = {

    //Validation DONE
    index : async (req, res, next) =>{
        
        logger.debug(`Controller method nodeTypeAttributeNames -> index`);

        if(Object.keys(req.query).length <= 0)
        {
            try{
                logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
                const pool = await new sql.ConnectionPool(config).connect();
                logger.trace(`connected to mssql, will create request and execute query`);
                let request =  pool.request();
                let nodeTypeAttributeNames = await request.query`select id, name, node_type_id, attr_type_id from NodeTypeAttributeName`;
                logger.debug(`executed query, result : ${JSON.stringify(nodeTypeAttributeNames)}`);
                logger.trace(`closing sql connection`);
                sql.close();
                logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(nodeTypeAttributeNames.recordset)}`);
                res.status(200).json(nodeTypeAttributeNames.recordset);
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

                logger.debug(`find nodeTypeAttributeName query params  : ${JSON.stringify(req.query)}`);
                logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
                const pool = await new sql.ConnectionPool(config).connect();
                logger.trace(`connected to mssql, will create request`);
                let request =  pool.request();
        
                logger.debug(`will execute stored procedure spFindNodeTypeAttributeNames with`);
        
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
                                    case 'attr_type_id':
                                    case 'attr_type_name':
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

                            case 'nodetypeid':
                            {
                                request.input('NodeTypeId',  req.query[queryParamName]);
                                logger.debug('@NodeTypeId', req.query[queryParamName]);
                                break;
                            }
                        }
                        
                    }
                }
        
                
                result = await request.execute('spFindNodeTypeAttributeNames');
                
                logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
                let nodeTypeAttributeNames = result.recordset;
                nodeTypeAttributeNames = nodeTypeAttributeNames.map(({TotalCount, ROWNUM, id, name, position, node_type_id, attr_type_id, attr_type_name}) => ({id, name, position, node_type_id, attr_type_id, attr_type_name}));
                const totalCount = result.recordset.length > 0 ? result.recordset[0]['TotalCount'] : 0 ;
                const response = {totalCount : totalCount, items : nodeTypeAttributeNames};
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
    newNodeTypeAttributeName: async (req, res, next) =>{

        logger.debug('Controller method nodeTypeAttributeNames -> newNodeTypeAttributeName');

        try{

            const newNodeTypeAttributeNameBody = req.value.body;
            const nodeTypeId = parseInt(req.query['nodeTypeId']);

            logger.debug(`add nodeTypeAttributeName request body  : ${JSON.stringify(req.value.body)}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            logger.debug(`will query for the existence of the nodeType in the db`);

            let result = await request.query`select count(*) as count from MenuNodeType where id=${nodeTypeId}`;
            logger.debug(`executed query, result : ${JSON.stringify(result.recordset)}`);
            const count = result.recordset[0].count;

            if(count <= 0)
            {
                const message = "Invalid nodeType id.";
                logger.trace(`${message} aborting and closing sql conn`);
                sql.close();
                logger.debug(`sql connection closed, sending 409  response to client`);
    
                res.status(409).send(message);
                return;
            }
            

            request =  pool.request();

            logger.debug(`will execute stored procedure spAddNodeTypeAttributeName @Name =  ${newNodeTypeAttributeNameBody.name}, @NodeTypeId = ${nodeTypeId}, @AttrTypeId = ${newNodeTypeAttributeNameBody.attr_type_id}`);
            request.input('Name', newNodeTypeAttributeNameBody.name);
            request.input('AttrTypeId', newNodeTypeAttributeNameBody.attr_type_id);
            request.input('NodeTypeId', nodeTypeId);

            
            result = await request.execute('spAddNodeTypeAttributeName');
            
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            const nodeTypeAttributeName = result.recordset;
            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(nodeTypeAttributeName)}`);
            res.status(201).json(nodeTypeAttributeName);

        }
        catch(error)
        {
            logger.error(error);
            logger.trace(`error caught, closing sql connection`);
            sql.close();


            if(error.code == 'EREQUEST')
            {
                logger.debug(`sql connection closed, sending 409 error response to client ${error.originalError.info.message}`);
                res.status(409).send(error.originalError.info.message || '');
            }
            else
            {
                logger.debug(`sql connection closed, sending 500 error response to client`);
                res.status(500).send(error.name || '');
            }

            
        }
    },

    
    //Validation DONE
    updateNodeTypeAttributeName: async(req, res, next) =>{
        
        logger.debug('Controller method nodeTypeAttributeNames -> updateNodeTypeAttributeName');
        try{

            const {nodeTypeAttributeNameId} = req.value.params;
            const modifications = req.value.body;
            const nodeTypeId = parseInt(req.query['nodeTypeId']);

            logger.debug(`update nodeTypeAttributeName id  : ${nodeTypeAttributeNameId}`);
            logger.debug(`update nodeTypeAttributeName request body  : ${JSON.stringify(req.value.body)}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            logger.debug(`will query for the existence of other nodeTypeAttributeNames in the db having same values`);

            let result = await request.query`select count(*) as count from NodeTypeAttributeName where id <> ${nodeTypeAttributeNameId} and (name=${modifications.name}) and (attr_type_id = ${modifications.attr_type_id})`;
            logger.debug(`executed query, result : ${JSON.stringify(result.recordset)}`);
            const count = result.recordset[0].count;

            if(count > 0)
            {
                const message = "No two nodeTypeAttributeNames can have same value for name";
                logger.trace(`${message} aborting and closing sql conn`);
                sql.close();
                logger.debug(`sql connection closed, sending 409  response to client`);
    
                res.status(409).send(message);
                return;
            }


            request =  pool.request();
            logger.debug(`will execute stored procedure spUpdateNodeTypeAttributeName @Id=${nodeTypeAttributeNameId} @Name =  ${modifications.name} @AttrTypeId = ${modifications.attr_type_id}`);
            request.input('Id', nodeTypeAttributeNameId);
            request.input('AttrTypeId', modifications.attr_type_id);
            request.input('Name', modifications.name);

            result = await request.execute('spUpdateNodeTypeAttributeName');
            
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


    reorderAttributeName: async(req, res, next) =>{
        
        logger.debug('Controller method nodeTypeAttributeNames -> reorderAttributeName');
        try{

            const {nodeTypeAttributeNameId, newPosition} = req.value.params;

            logger.debug(` nodeTypeAttributeName id  : ${nodeTypeAttributeNameId}`);
            logger.debug(` nodeTypeAttributeName newPosition   : ${newPosition}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            logger.debug(`will execute stored procedure spSwapAttributeNamePosition @Id=${nodeTypeAttributeNameId}  @newPosition = ${newPosition}`);
            request.input('Id', nodeTypeAttributeNameId);
            request.input('newPosition', newPosition);

            result = await request.execute('spSwapAttributeNamePosition');
            
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
    removeNodeTypeAttributeName: async(req, res, next) =>{
        
        logger.debug('Controller method nodeTypeAttributeNames -> removeNodeTypeAttributeName');

        try{
            const {nodeTypeAttributeNameId} = req.value.params;
            const nodeTypeId = parseInt(req.query['nodeTypeId']);
            logger.debug(`delete nodeTypeAttributeName id  : ${nodeTypeAttributeNameId}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            // logger.debug(`will query for the existence of ProductConfigs in the db having dependency on this nodeType`);
            // logger.debug(`will execute stored procedure spGetNodeTypeAttributeNameDependentsCount @NodeTypeAttributeNameId=${nodeTypeAttributeNameId}, @NodeTypeId=${nodeTypeId}`);
            // request.input('NodeTypeAttributeNameId', nodeTypeAttributeNameId);
            // request.input('NodeTypeId', nodeTypeId);
            // result = await request.execute('spGetNodeTypeAttributeNameDependentsCount');
            
            // logger.debug(`executed procedure result : ${JSON.stringify(result.recordset)}`);

            // if(result.recordset[0]['dependents_count'] > 0)
            // {
            //     const message = `There ${result.recordset[0]['dependents_count'] <= 1 ? 'is' : 'are'} ${result.recordset[0]['dependents_count']} Product Configs dependent on this nodeTypeAttributeName. Please delete ${result.recordset[0]['dependents_count'] <= 1 ? 'it' : 'them'} first.`;
            //     logger.trace(`${message} aborting and closing sql conn`);
            //     sql.close();
            //     logger.debug(`sql connection closed, sending 409  response to client`);
    
            //     res.status(409).send(message);
            //     return;
            // }


            // request =  pool.request();
            logger.debug(`will execute stored procedure spDeleteNodeTypeAttributeName @Id=${nodeTypeAttributeNameId}, @NodeTypeId=${nodeTypeId}`);
            request.input('Id', nodeTypeAttributeNameId);
            request.input('NodeTypeId', nodeTypeId);
            result = await request.execute('spDeleteNodeTypeAttributeName');
            
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