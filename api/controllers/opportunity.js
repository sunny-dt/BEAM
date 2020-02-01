// const Opportunity = require('../models/opportunity');
// const Product = require('../models/product');

const {config, sql} = require('../helpers/db-config-helper');
const {logger} = require('../helpers/logging-helper');

module.exports = {

    //Validation DONE
    index : async (req, res, next) =>{
        
        logger.debug('Controller method opportunities -> index');

        try {

            logger.debug(`find opportunties query params  : ${JSON.stringify(req.query)}`);
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            logger.debug(`will execute stored procedure spFindOpportunities with`);

            for (var queryParamName in req.query) {
                if (req.query.hasOwnProperty(queryParamName)) {

                    switch(queryParamName.toLowerCase())
                    {
                        case 'filter':
                        {
                            request.input('Id', parseInt(req.query[queryParamName]) || 0);
                            logger.debug('@Id', parseInt(req.query[queryParamName]) || 0);

                            request.input('OpId',  req.query[queryParamName]);
                            logger.debug('@OpId', req.query[queryParamName]);

                            request.input('CreatedById',  req.query[queryParamName]);
                            logger.debug('@CreatedById', req.query[queryParamName]);

                            request.input('CreatedByName',  req.query[queryParamName]);
                            logger.debug('@CreatedByName', req.query[queryParamName]);

                            request.input('ProductName',  req.query[queryParamName]);
                            logger.debug('@ProductName', req.query[queryParamName]);

                            request.input('ProductCode',  req.query[queryParamName]);
                            logger.debug('@ProductCode', req.query[queryParamName]);

                            request.input('PlatformName',  req.query[queryParamName]);
                            logger.debug('@PlatformName', req.query[queryParamName]);

                            request.input('NearestProductConfigName',  req.query[queryParamName]);
                            logger.debug('@NearestProductConfigName', req.query[queryParamName]);



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
                                case 'op_id':
                                case 'created_by_id':
                                case 'created_by_name':
                                case 'product_name':
                                case 'product_code':
                                case 'platform_name':
                                case 'nearest_product_config_name':
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

            
            result = await request.execute('spFindOpportunities');
            
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            let opportunities = result.recordset;
            opportunities = opportunities.map(({TotalCount, ROWNUM, id, op_id, created_by_id, created_by_name, product_name, product_code, platform_name, nearest_product_config_name, c_date, m_date}) => ({id, op_id, created_by_id, created_by_name, product_name, product_code, platform_name, nearest_product_config_name, c_date, m_date}));
            const totalCount = result.recordset.length > 0 ? result.recordset[0]['TotalCount'] : 0 ;
            const response = {totalCount : totalCount, items : opportunities};
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
        
    },

    //Validation DONE
    newOpportunity: async (req, res, next) =>{

        logger.debug('Controller method opportunities -> newOpportunity');

        try{

            const opRequestBody = req.value.body;
            logger.debug(`opRequestBody  : ${JSON.stringify(req.value.body)}`);
            
            const productConfigInfo = new sql.Table('ProductConfigList');
            productConfigInfo.columns.add('product_id', sql.Int)
            productConfigInfo.columns.add('product_name', sql.VarChar(100));
            productConfigInfo.columns.add('product_code', sql.VarChar(50));
            productConfigInfo.columns.add('nearest_product_config_id', sql.Int);
            productConfigInfo.columns.add('nearest_product_config_name', sql.VarChar(100));
            productConfigInfo.columns.add('platform_name', sql.VarChar(50));
            productConfigInfo.columns.add('mode_svg_url', sql.VarChar(50));
            productConfigInfo.rows.add(null, opRequestBody.product_name, opRequestBody.product_code, null, opRequestBody.nearest_product_config_name, opRequestBody.platform_name, '');



            let chamberConfigArray = opRequestBody.configuration;

            
            const chamberConfigInfo = new sql.Table('ChamberConfigList');
            chamberConfigInfo.columns.add('facet_name', sql.VarChar(10));
            chamberConfigInfo.columns.add('chamber_name', sql.VarChar(50));
            for(var chamberConfig of chamberConfigArray)
            {
                chamberConfigInfo.rows.add(chamberConfig.facet_name, chamberConfig.chamber_name);
            }

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();
            logger.debug(`will execute stored procedure spAddOpportunity @OpId =  ${opRequestBody.op_id}, @CreatedById=${req.user.employeeID || ''}, @CreatedByName=${req.user.firstname || ''} ${req.user.lastname || ''},  @ProductInfo=${productConfigInfo}, @ChamberConfigInfo=${chamberConfigInfo}, @OpCreatedId Bigint out variable`);
            request.input('OpId', opRequestBody.op_id);
            request.input('CreatedById', `${req.user.employeeID || ''}`);
            request.input('CreatedByName', `${req.user.firstname || ''} ${req.user.lastname || ''}`);
            request.input('ProductInfo', productConfigInfo);
            request.input('ChamberConfigInfo', chamberConfigInfo);
            request.output('OpCreatedId', sql.Int, 0);
            const result = await request.execute('spAddOpportunity');
            const opportunityId = request.parameters.OpCreatedId.value;
            logger.debug(`executed procedure result : ${result}`);
            logger.trace(`opportunityId (request.parameters.OpCreatedId.value)  : ${opportunityId}`);
            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify({success : true})}`);
            res.status(201).json({success : true});
        }
        catch(error){
            logger.error(error);
            logger.trace(`error caught, closing sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 500 error response to client`);
            res.status(500).send(error.name || '');

        };

        
    }

   


};