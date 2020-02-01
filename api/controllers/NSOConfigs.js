const {config, sql} = require('../helpers/db-config-helper');
const {logger} = require('../helpers/logging-helper');
const subpaths = require('../helpers/assests-subpaths');

module.exports = {

index : async (req, res, next) =>{
        
    logger.debug(`Controller method builders -> index`);
    
        try {

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();
            logger.debug(`will execute stored procedure spGetCustomers`);
            
            result = await request.execute('spGetCustomers');
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            const customers = result.recordset;
            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(customers)}`);
            res.status(200).json(customers);  
        }
        catch(error)
        {
            logger.error(error);
            logger.debug(`sending 500 error response to client`);
    
            res.status(500).send(error.name || '');
        }
    },

    addNSOConfiguration : async (req, res, next) =>{
    
        logger.debug(`Controller method builders -> addNSOConfiguration`);
        
        try {
    
			const opRequestBody = req.value.body;
			logger.debug(`opRequestBody addNSOConfiguration : ${JSON.stringify(req.value.body)}`);
			
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);

            // const customerId = opRequestBody.customer_id;
            // const configName = opRequestBody.config_name;
            
            // let checkConfigNameRequest =  pool.request();

            // logger.debug(`will execute stored procedure spGetCustomerConfiguration`);
			
			// checkConfigNameRequest.input('CustomerId', parseInt(customerId));
            // logger.debug('@customerId', parseInt(customerId));

            // checkConfigNameRequest.input('ConfigName', configName);
            // logger.debug('@configName', configName);
        
            // let checkConfigNameResult = await checkConfigNameRequest.execute('spGetBuilderConfigByName');
            // logger.debug(`executed procedure result : ${JSON.stringify(checkConfigNameResult)}`);
            
            // // let checkConfigNameResult = checkConfigNameResult.recordset;
            // const insertConfigName = checkConfigNameResult.recordset.length > 0 ? configName + "-1" : configName;

			// logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
			// const pool = await new sql.ConnectionPool(config).connect();
            // logger.trace(`connected to mssql, will create request`);
            
			let request =  pool.request();
			logger.debug(`will execute stored procedure addNSOConfiguration`);
			
			request.input('ConfigName', opRequestBody.config_name);
			request.input('CreatedById', opRequestBody.created_by_id);
			request.input('CreatedByName', opRequestBody.created_by_name);
			request.input('ModifiedById', opRequestBody.modified_by_id);
			request.input('ModifiedByName', opRequestBody.modified_by_name);
			request.input('G3PlatformId', opRequestBody.g3_platform_id);
			request.input('CustomerId', opRequestBody.customer_id);
			request.input('CustomerProjectNo', opRequestBody.customer_project_no);

			let chamberConfigArray = opRequestBody.configuration;

			const chamberConfigInfo = new sql.Table('BuilderConfigList');
			chamberConfigInfo.columns.add('id', sql.Int);
			chamberConfigInfo.columns.add('config_id', sql.Int);
			chamberConfigInfo.columns.add('explorer_chamber_name', sql.VarChar(100));
			chamberConfigInfo.columns.add('facet_name', sql.VarChar(10));
			chamberConfigInfo.columns.add('explorer_chamber_family_name', sql.VarChar(100));
			chamberConfigInfo.columns.add('explorer_chamber_id', sql.Int);
			chamberConfigInfo.columns.add('explorer_chamber_family_id', sql.Int);
			
			for(var chamberConfig of chamberConfigArray)
			{
				chamberConfigInfo.rows.add("", "", chamberConfig.explorer_chamber_name, chamberConfig.facet_name, chamberConfig.explorer_chamber_family_name, chamberConfig.explorer_chamber_id, chamberConfig.explorer_chamber_family_id);
			}
			
			request.input('BuilderConfigList', chamberConfigInfo);
			request.output('NSOConfigId', sql.Int, 0);

			logger.debug(`opRequestBody addConfiguration request : ${request}`);
			logger.debug(`will execute stored procedure spAddNSOConfig`);
			
			let result = await request.execute('spAddNSOConfig');
			// logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
			
			// let request2 =  pool.request();
			// logger.debug(`will execute stored procedure getNSOConfigurationDetails`);
			let configId = result.output.NSOConfigId;
			// request2.input('ConfigId', configId);
			// logger.debug('request2 @configId', configId);
	
			// let result2 = await request2.execute('spGetBuilderConfigDetails');
			// logger.debug(`executed procedure result2 : ${JSON.stringify(result2)}`);

			// const builderConfigById = result2.recordset;
			const response = result.output;
			
			// response['configuration'] = new Array();
			
			// response.configuration = builderConfigById;
            response.message = "Added successfully";
            response.NSOConfigId = configId;
			logger.trace(`will close sql connection`);
			sql.close();
			logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(response)}`);
			res.status(200).json(response);
			
		}
		catch(error)
		{
			logger.error(error);
			logger.debug(`sending 500 error response to client`);
	
			res.status(500).send(error.name || '');
		}
	},
	
    getNSOConfigurationByCustomerID: async (req, res, next) =>{
        
        logger.debug(`Controller method builders -> getNSOConfigurationByCustomerID`);
        
        try {

            // const customerId = parseInt(req.query['customerId']);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            for (var queryParamName in req.query) {

                if (req.query.hasOwnProperty(queryParamName)) {

                    switch(queryParamName.toLowerCase())
                    {
                        case 'customerid':
                        {

                            request.input('customerId',  parseInt(req.query[queryParamName]));
                            logger.debug('@customerId', parseInt(req.query[queryParamName]));

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
								case 'modified_date':
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
            
            logger.debug(`will execute stored procedure spGetNSOConfigByCustId`);
			
            let result = await request.execute('spGetNSOConfigByCustId');
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
    
            let nsoConfig = result.recordset;
            nsoConfig = nsoConfig.map(({TotalCount, ROWNUM, id, name, created_by_id, created_by_name, modified_by_id, modified_by_name, c_date, m_date, g3_platform_id, is_nso}) => ({ id, name, created_by_id, created_by_name, modified_by_id, modified_by_name, c_date, m_date, g3_platform_id, is_nso}));
            const totalCount = result.recordset.length > 0 ? result.recordset[0]['TotalCount'] : 0 ;
            const response = {totalCount : totalCount, items : nsoConfig};

            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(response)}`);
            res.status(200).json(response);
        }
        catch(error)
        {
            logger.error(error);
            logger.debug(`sending 500 error response to client`);
    
            res.status(500).send(error.name || '');
        }
    },
	
	getNSOConfigurationDetails: async (req, res, next) =>{
        
        logger.debug(`Controller method builders -> getNSOConfigurationDetails`);
        
        try {

            const configId = parseInt(req.query['ConfigId']);
            
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);

            //spGetNSOConfig
            let request =  pool.request();
            logger.debug(`will execute stored procedure spGetNSOConfig`);
            
			let configID = parseInt(configId);
			logger.debug(`opRequestBody configID spGetNSOConfig : ${JSON.stringify(configID)}`);
			
            request.input('ConfigId', configId);
            logger.debug('request input @configId', configId);
        
            let nsoConfig = await request.execute('spGetNSOConfig');
            logger.debug(`executed procedure spGetNSOConfig nsoConfig : ${JSON.stringify(nsoConfig)}`);
            nsoConfig = nsoConfig.recordset;
            logger.debug(`executed procedure spGetNSOConfig builderConfigs : ${JSON.stringify(nsoConfig)}`);

            //spGetNSOConfigDetails
            let request2 =  pool.request();
            logger.debug(`will execute stored procedure spGetNSOConfigDetails`);
			
            request2.input('ConfigId', configId);
            logger.debug('request2 @configId', configId);
        
            let result = await request2.execute('spGetNSOConfigDetails');
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
    
            const builderConfigDetails = result.recordset;
			logger.debug(`executed procedure spGetNSOConfigDetails builderConfigDetails : ${JSON.stringify(builderConfigDetails)}`);
			
			for (var configuration of nsoConfig) {
				
				//platforms
				let platformRequest =  pool.request();
				let platforms = await platformRequest.query`select model_svg_filename from Platform where id = ${nsoConfig[0].g3_platform_id}`;
				logger.debug(`executed query, result : ${JSON.stringify(platforms)}`);
            
				logger.debug(`appending base client-assets http path for platforms model filename`);
				let model_svg_url = "";
				for(let platform of platforms.recordset)
				{
					model_svg_url = process.env.CLIENT_ASSETS_BASE_URI + subpaths.SVG_FILES +  platform.model_svg_filename;
					logger.debug(`executed query, model_svg_url : ${JSON.stringify(model_svg_url)}`);
				}
			
                configuration['configuration'] = new Array();
                configuration.model_svg_url = model_svg_url;
				configuration.configuration = builderConfigDetails;
			}
			logger.debug(`executed procedure spGetBuilderConfigDetails nsoConfig : ${JSON.stringify(nsoConfig)}`);

			let finalResult = nsoConfig[0];
			
            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(finalResult)}`);
            res.status(200).json(finalResult);
            
        }
        catch(error)
        {
            logger.error(error);
            logger.debug(`sending 500 error response to client`);
    
            res.status(500).send(error.name || '');
        }
    },
	
	getAllPlatforms: async (req, res, next) =>{
        
        logger.debug(`Controller method builders -> getAllPlatforms`);
        
        try{          
            
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();
            logger.debug(`will execute stored procedure spGellAllPlatforms`);

            result = await request.execute('spGetAllPlatforms');
                
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            let platforms = result.recordset;
			
			  for(let platform of platforms)
                {
                    platform["model_svg_url"] = process.env.CLIENT_ASSETS_BASE_URI + subpaths.SVG_FILES +  platform.model_svg_filename;
                }


            platforms = platforms.map(({id, name, model_svg_filename, model_svg_url, facets_count, min_facetgroups_count}) => ({id, name,model_svg_filename, model_svg_url, facets_count, min_facetgroups_count}));
                
               
			
			const response = platforms;

            logger.debug(`appending base client-assets http path for platforms model filename`);
			
			
           

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
            

	
}
