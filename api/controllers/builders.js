const {config, sql} = require('../helpers/db-config-helper');
const {logger} = require('../helpers/logging-helper');
const convert = require('xml-js');
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

     addConfiguration : async (req, res, next) =>{
    
        logger.debug(`Controller method builders -> addConfiguration`);
        
        try {
    
			const opRequestBody = req.value.body;
			logger.debug(`opRequestBody addConfiguration : ${JSON.stringify(req.value.body)}`);
			
            const customerId = opRequestBody.customer_id;
            const configName = opRequestBody.config_name;
            
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
			
            logger.trace(`connected to mssql, will create request`);
            let checkConfigNameRequest =  pool.request();

			checkConfigNameRequest.input('CustomerId', customerId);
            logger.debug('@customerId', customerId);

            let insertConfigName = '';
            if( configName == 'Untitled') {
				
				logger.debug('spGetBuilderConfigByName configName', configName);
            
                let checkConfigNameResult = await checkConfigNameRequest.execute('spGetBuilderConfigByName');
                logger.debug(`executed procedure checkConfigNameResult result : ${JSON.stringify(checkConfigNameResult)}`);
                  
                let checkConfigNm = checkConfigNameResult.recordset.map(record => record.name);
                
                logger.debug(`checkConfigNm length: ${JSON.stringify(checkConfigNm.length)}`);
                
                if(checkConfigNm.length > 0){
                
                    logger.debug(`checkConfigNm: ${JSON.stringify(checkConfigNm)}`);
					
					for (var i=0; i < checkConfigNm.length; i++) {

						checkConfigNm[i] = checkConfigNm[i].replace('Untitled','');
                    }
					
                    logger.debug(`checkConfigNm removed Untitled: ${JSON.stringify(checkConfigNm)}`);
					
					checkConfigNm.sort(function(a, b){return a-b});
                    logger.debug(`checkConfigNm after sort: ${JSON.stringify(checkConfigNm)}`);

                    if(checkConfigNm.length < 0){
                        
                        insertConfigName = configName + 1;
                    } else {
            
						let lastNumber = checkConfigNm[checkConfigNm.length-1];
						logger.debug(`lastNumber: ${JSON.stringify(lastNumber)}`);
						
						var add = parseInt(lastNumber)+1;
						logger.debug(`add: ${JSON.stringify(add)}`);
						newTitleSearch = 'Untitled' + '' + add;
						logger.debug(`newTitleSearch: ${JSON.stringify(newTitleSearch)}`);
                    
						insertConfigName = newTitleSearch;
                    
						logger.debug(`insertConfigName: ${JSON.stringify(insertConfigName)}`);
                    }
                } else {

                    if(configName == 'Untitled') {
                    
						insertConfigName = configName + 1;
                    } else {

                        insertConfigName = configName; 
                    }
                }
            } else {
                
				let request1 = pool.request();

				request1.input('ConfigName', configName);
				request1.input('CustomerId', customerId);
				request1.input('ConfigId', '0');
				
				logger.debug('spGetConfigNamesInBuilder configName', configName);
				
				let checkConfigName= await request1.execute('spGetConfigNamesInBuilder');
				logger.debug(`executed procedure spGetConfigNamesInBuilder checkConfigName : ${JSON.stringify(checkConfigName)}`);
				
				let opt = checkConfigName.returnValue;
				
				logger.debug(`opt  result : ${JSON.stringify(opt)}`);
				if(opt == 1) {
					
					insertConfigName = configName + '-1';
				} else {
					
					insertConfigName = configName;
				}
            }
            
			logger.debug(`insertConfigName: ${JSON.stringify(insertConfigName)}`);
            
			let request =  pool.request();
			logger.debug(`will execute stored procedure spAddBuilderConfig`);
			
			request.input('ConfigName', insertConfigName);
			request.input('CreatedById', opRequestBody.created_by_id);
			request.input('CreatedByName', opRequestBody.created_by_name);
			request.input('ModifiedById', opRequestBody.modified_by_id);
			request.input('ModifiedByName', opRequestBody.modified_by_name);
			request.input('CDate', opRequestBody.c_date);
			request.input('MDate', opRequestBody.m_date);
			request.input('PlatformId', opRequestBody.platform_family_id);
			request.input('CustomerId', opRequestBody.customer_id);

			let chamberConfigArray = opRequestBody.configuration;
			
			logger.debug(`chamberConfigArray : ${JSON.stringify(chamberConfigArray)}`);

			const chamberConfigInfo = new sql.Table('BuilderConfigList');
			chamberConfigInfo.columns.add('id', sql.Int);
			chamberConfigInfo.columns.add('config_id', sql.Int);
			chamberConfigInfo.columns.add('explorer_chamber_name', sql.VarChar(100));
			chamberConfigInfo.columns.add('facet_name', sql.VarChar(10));
			chamberConfigInfo.columns.add('explorer_chamber_family_name', sql.VarChar(100));
			chamberConfigInfo.columns.add('explorer_chamber_id', sql.Int);
			chamberConfigInfo.columns.add('explorer_chamber_family_id', sql.Int);
			
			for(var chamberConfig of chamberConfigArray) {
											 
				chamberConfigInfo.rows.add("", "", chamberConfig.chamber_name, chamberConfig.facet_name, chamberConfig.chamber_family_name, chamberConfig.chamber_id, chamberConfig.chamber_family_id);
			}
			
			request.input('BuilderConfigList', chamberConfigInfo);
			request.output('ConfigID', sql.Int, 0);

			logger.debug(`opRequestBody addConfiguration request : ${request}`);
			
			let result = await request.execute('spAddBuilderNewConfiguration');
			logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
			
			let request2 =  pool.request();
			logger.debug(`will execute stored procedure spAddBuilderNewConfiguration`);
			logger.debug(`will execute stored procedure getConfigurationDetails`);
			let configId = result.output.ConfigID;
			request2.input('ConfigId', configId);
			logger.debug('request2 @configId', configId);
	
			let result2 = await request2.execute('spGetNewBuilderConfigurationDetails');
			logger.debug(`executed procedure result2 : ${JSON.stringify(result2)}`);

			const builderConfigById = result2.recordset;
			
			for(var buildf of builderConfigById) {
				
				let getNewRequest= pool.request();
				getNewRequest.input('Name', buildf.chamber_name);
				logger.debug(`explorer_chamber_name : ${JSON.stringify(buildf.chamber_name)}`);
				
				let chamberGotCode = await getNewRequest.execute('spMasterGetChamberGotCodes');
				
                logger.debug(`executed procedure spMasterGetChamberGotCodes chamberCount : ${JSON.stringify(chamberGotCode)}`);
				let gotCodeRetrieved = chamberGotCode.recordset.map(record => record.gotCode);
				
				logger.debug(`gotCodeRetrieved : ${JSON.stringify(gotCodeRetrieved)}`);
				if(gotCodeRetrieved.length > 0 ){
				    buildf.gotCode = gotCodeRetrieved[0];
				}
				else{
					buildf.gotCode= '';

 				}
			}
			
			logger.debug(`configuration builderConfigById: ${JSON.stringify(builderConfigById)}`);
			const response = result.output;
			logger.debug(`configuration response: ${JSON.stringify(response)}`);
			response.config_name = insertConfigName;
			
			response['configuration'] = new Array();
			
			response.configuration = builderConfigById;				
			
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

	updateConfiguration : async (req, res, next) =>{
    
        logger.debug(`Controller method builders -> updateConfiguration`);
        
        try {
    
            const opRequestBody = req.value.body;
            logger.debug(`opRequestBody updateConfiguration : ${JSON.stringify(req.value.body)}`);
    
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            
            var configName= opRequestBody.config_name;
            var customerId= opRequestBody.customer_id;
	        var configId= opRequestBody.config_id;
            let request1 = pool.request();

            request1.input('ConfigName', configName);

            request1.input('CustomerId', customerId);
			
			request1.input('ConfigId',configId);
            
            let checkConfigName= await request1.execute('spGetConfigNamesInBuilder');
            logger.debug(`executed procedure checkConfigName : ${JSON.stringify(checkConfigName)}`);
            
			let opt = checkConfigName.returnValue;
			
            
			logger.debug(`opt  result : ${JSON.stringify(opt)}`);
			if(opt == 1)
			{ 
            response = { message : "Already Title Exists"};
           
            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(opt)}`);
            res.status(200).json(response);
			}
			
			else {


            let request =  pool.request();
            logger.debug(`will execute stored procedure spUpdateBuilderConfig`);
            
	        let configID = parseInt(opRequestBody.config_id);
	        logger.debug(`opRequestBody config_id spUpdateBuilderConfig : ${JSON.stringify(configID)}`);
			
            request.input('ConfigId', configID);
            request.input('ConfigName', opRequestBody.config_name);
            request.input('ModifiedById', opRequestBody.modified_by_id);
            request.input('ModifiedByName', opRequestBody.modified_by_name);
            request.input('MDate', opRequestBody.m_date);

            let chamberConfigArray = opRequestBody.configuration;

            const chamberConfigInfo = new sql.Table('BuilderConfigList');
	        chamberConfigInfo.columns.add('id', sql.Int);
	        chamberConfigInfo.columns.add('config_id', sql.Int);
            chamberConfigInfo.columns.add('explorer_chamber_name', sql.VarChar(100));
            chamberConfigInfo.columns.add('facet_name', sql.VarChar(100));
            chamberConfigInfo.columns.add('explorer_chamber_family_name', sql.VarChar(100));
	        chamberConfigInfo.columns.add('explorer_chamber_id', sql.Int);
	        chamberConfigInfo.columns.add('explorer_chamber_family_id', sql.Int);
			
            for(var chamberConfig of chamberConfigArray)		
			
            {			
				
                chamberConfigInfo.rows.add(chamberConfig.id, chamberConfig.config_id, chamberConfig.chamber_name, chamberConfig.facet_name, chamberConfig.chamber_family_name, chamberConfig.chamber_id, chamberConfig.chamber_family_id);
            }
            
            request.input('BuilderConfigList', chamberConfigInfo);
            
            result = await request.execute('spUpdateBuilderNewConfiguration');
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            let response= {message : "success" }
            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(response)}`);
            res.status(200).json(response);
         }
			
			
			
		
        }
        catch(error)
        {
            logger.error(error);
            logger.debug(`sending 500 error response to client`);
    
            res.status(500).send(error.name || '');
        }
    },




	
    getConfigurationByCustomerID: async (req, res, next) =>{
        
        logger.debug(`Controller method builders -> getConfigurationByCustomerID`);
        
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
            
            logger.debug(`will execute stored procedure GetBuilderConfigByCustId`);
			
            // request.input('CustomerId', customerId);
            // logger.debug('request @customerId', customerId);
        
            let result = await request.execute('spGetBuilderNewConfigByCustomerID');
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
    
            let builderConfig = result.recordset;	


            
			
				let model_svg_url = "";
				for(let platform of builderConfig)
				{
					model_svg_url = process.env.CLIENT_ASSETS_BASE_URI + subpaths.SVG_FILES +  platform.svg_image;
					//logger.debug(`executed query, model_svg_url : ${JSON.stringify(model_svg_url)}`);
					
					platform.svg_image = model_svg_url;
				}
			   //builderConfig.svg_image = model_svg_url;
			   
			   logger.debug(`executed query after model_svg_url append URL: ${JSON.stringify(builderConfig)}`);
                
					
			
            builderConfig = builderConfig.map(({TotalCount, ROWNUM, id, name, created_by_id, created_by_name, modified_by_id, modified_by_name, c_date, m_date, platform_family_id, is_nso , svg_image}) => ({ id, name, created_by_id, created_by_name, modified_by_id, modified_by_name, c_date, m_date, platform_family_id, is_nso, svg_image}));
            const totalCount = result.recordset.length > 0 ? result.recordset[0]['TotalCount'] : 0 ;
            const response = {totalCount : totalCount, items : builderConfig};

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
	
	getConfigurationDetails: async (req, res, next) =>{
        
        logger.debug(`Controller method builders -> getConfigurationDetails`);
        
        try {

            const configId = parseInt(req.query['ConfigId']);
            
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);

            //spGetBuilderNewConfig
            let request =  pool.request();
            logger.debug(`will execute stored procedure spGetBuilderNewConfig`);
            
			let configID = parseInt(configId);
			logger.debug(`opRequestBody configID spGetBuilderNewConfig : ${JSON.stringify(configID)}`);
			
            request.input('ConfigId', configId);
            logger.debug('request input @configId', configId);
        
            let builderConfig = await request.execute('spGetBuilderNewConfig');
            logger.debug(`executed procedure spGetBuilderNewConfig builderConfig : ${JSON.stringify(builderConfig)}`);
            builderConfigs = builderConfig.recordset;
            logger.debug(`executed procedure spGetBuilderNewConfig builderConfigs : ${JSON.stringify(builderConfigs)}`);

            //spGetNewBuilderConfigurationDetails
            let request2 =  pool.request();
            logger.debug(`will execute stored procedure spGetNewBuilderConfigurationDetails`);
			
            request2.input('ConfigId', configId);
            logger.debug('request2 @configId', configId);
        
            let result = await request2.execute('spGetNewBuilderConfigurationDetails');
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
    
            const builderConfigDetails = result.recordset;
			
			const tomsIndex = builderConfigDetails.findIndex(builderData => builderData.facet_name == 'A');
                builderConfigDetails.push(...builderConfigDetails.splice(0, tomsIndex));
				
		    logger.debug(`sorted Faccet : ${JSON.stringify(builderConfigDetails)}`); 
			
			
            for (var details of builderConfigDetails) {
				
				if(details.chamber_name === null){
					details.chamber_name = "";
					
				}
				else 
				{
					details.chamber_name = details.chamber_name;
				}
				
				
				if(details.chamber_family_name === null){
					details.chamber_family_name = "";
				}
				else 
				{
					details.chamber_family_name = details.chamber_family_name;
				}
				
				
				if(details.chamber_id === null){
					details.chamber_id = "0";
					
				}
				else 
				{
					details.chamber_id = details.chamber_id;
				}
				
				
				if(details.chamber_family_id === null){
					details.chamber_family_id = "0";
				}
				else 
				{
					details.chamber_family_id = details.chamber_family_id;
				}

				let getRequest1= pool.request();
				getRequest1.input('Name',details.chamber_name);
				
				let gotCheckedCode = await getRequest1.execute('spMasterGetChamberGotCodes');
				
                logger.debug(`executed procedure spMasterGetChamberGotCodes chamberCount : ${JSON.stringify(gotCheckedCode)}`);
				
				let chamberGtCd = gotCheckedCode.recordset.map(record => record.gotCode);
				logger.debug(`chamberGotCode : ${JSON.stringify(chamberGtCd)}`);	
				logger.debug(`chamberGotCode : ${JSON.stringify(chamberGtCd[0])}`);	
				
				if (chamberGtCd[0] == "") {

					details.gotCode = "";
				} else {
					
					details.gotCode = chamberGtCd[0];
				}
            }
			
			logger.debug(`executed procedure spGetBuilderConfigDetails builderConfigDetails : ${JSON.stringify(builderConfigDetails)}`);
			
			for (var configuration of builderConfigs) {
				
				//platforms
				let platformRequest =  pool.request();
				let platforms = await platformRequest.query`select svg_image from [dbo].[BuilderPlatformFamily] where id = ${builderConfigs[0].platform_family_id}`;
				logger.debug(`executed query, result : ${JSON.stringify(platforms)}`);
            
				logger.debug(`appending base client-assets http path for platforms model filename`);
				let model_svg_url = "";
				for(let platform of platforms.recordset)
				{
					model_svg_url = process.env.CLIENT_ASSETS_BASE_URI +subpaths.SVG_FILES+  platform.svg_image;
					logger.debug(`executed query, model_svg_url : ${JSON.stringify(model_svg_url)}`);
				}
			
                configuration['configuration'] = new Array();
                configuration.model_svg_url = model_svg_url;
				configuration.configuration = builderConfigDetails;
			}
			logger.debug(`executed procedure spGetBuilderConfigDetails builderConfigs : ${JSON.stringify(builderConfigs)}`);

			let finalResult = builderConfigs[0];
			
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
	
	deleteConfiguration: async (req, res, next) =>{
        
        logger.debug(`Controller method builders -> deleteConfiguration`);
        
        try {

            const configId = parseInt(req.query['ConfigId']);
            
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            logger.debug(`will execute stored procedure GetBuilderConfigByCustId`);
			
            request.input('ConfigId', configId);
            logger.debug('request @configId', configId);
        
            let result = await request.execute('spDeleteBuilderNewConfig');
            logger.debug(`executed procedure deleteConfiguration result : ${JSON.stringify(result)}`);
    
            const response = result.output;
			response.message = "success";
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

    copyConfiguration : async (req, res, next) =>{
    
        logger.debug(`Controller method builders -> copyConfiguration`);
        
        try {
    
            const configId = parseInt(req.query['ConfigId']);
            logger.trace(`builder copyConfiguration ${JSON.stringify(configId)}`);
    
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);

            //spGetBuilderNewConfig
            let request =  pool.request();
            logger.debug(`will execute stored procedure spGetBuilderNewConfig`);
            
			let configID = parseInt(configId);
			logger.debug(`opRequestBody configID spGetBuilderNewConfig : ${JSON.stringify(configID)}`);
			
            request.input('ConfigId', configId);
            logger.debug('request input @configId', configId);
        
            let builderConfig = await request.execute('spGetBuilderNewConfig');
            logger.debug(`executed procedure spGetBuilderNewConfig builderConfig : ${JSON.stringify(builderConfig)}`);
            builderConfigs = builderConfig.recordset;
            logger.debug(`executed procedure spGetBuilderNewConfig builderConfigs : ${JSON.stringify(builderConfig)}`);

            //spGetNewBuilderConfigurationDetails
            let configDetailsRequest =  pool.request();
            logger.debug(`will execute stored procedure spGetNewBuilderConfigurationDetails`);
			
            configDetailsRequest.input('ConfigId', configId);
            logger.debug('request input @configId', configId);
        
            let configDetailsResult = await configDetailsRequest.execute('spGetNewBuilderConfigurationDetails');
            logger.debug(`executed procedure spGetBuilderConfigDetails configDetailsResult : ${JSON.stringify(configDetailsResult)}`);
            configDetailsResult = configDetailsResult.recordset;
            logger.debug(`executed procedure spGetBuilderConfigDetails configDetailsResult.recordset : ${JSON.stringify(configDetailsResult)}`);

            //spAddBuilderConfig
            let addRequest =  pool.request();
			logger.debug(`will execute stored procedure spAddBuilderConfig`);
			
			for(let configuration of builderConfigs) {
                
                logger.debug(`builder copyConfiguration builderConfig name : ${configuration.name}`);
                logger.debug(`builder copyConfiguration builderConfig created_by_id : ${configuration.created_by_id}`);
                
                
                addRequest.input('ConfigName', configuration.name +  " Copy");
                addRequest.input('CreatedById', configuration.created_by_id);
                addRequest.input('CreatedByName', configuration.created_by_name);
                addRequest.input('ModifiedById', configuration.modified_by_id);
                addRequest.input('ModifiedByName', configuration.modified_by_name);
                addRequest.input('CDate', configuration.c_date);
                addRequest.input('MDate', configuration.m_date);
                addRequest.input('PlatformId', configuration.platform_family_id);
                addRequest.input('CustomerId', configuration.customer_id);
            }
            
			let chamberConfigArray = configDetailsResult;

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
				logger.debug(`builder copyConfiguration chamberConfig.chamber_name : ${chamberConfig.chamber_name}`);
				logger.debug(`builder copyConfiguration chamberConfig.facet_name: ${chamberConfig.facet_name}`);
				chamberConfigInfo.rows.add("", "", chamberConfig.chamber_name, chamberConfig.facet_name, chamberConfig.chamber_family_name, chamberConfig.chamber_id, chamberConfig.chamber_family_id);
			}
			
			addRequest.input('BuilderConfigList', chamberConfigInfo);
			addRequest.output('ConfigID', sql.Int, 0);

			logger.debug(`builder copyConfiguration spAddBuilderConfig addRequest : ${addRequest}`);
			
			let result = await addRequest.execute('spAddBuilderNewConfiguration');
			logger.debug(`executed procedure spAddBuilderConfig result : ${JSON.stringify(result)}`);

            const response = result.output;
			response.message = "success";
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
	
	updateConfigNSOFlag : async (req, res, next) =>{
    
        logger.debug(`Controller method builders -> updateConfigNSOFlag`);
        
        try {
    
            const configId = parseInt(req.query['ConfigId']);
            logger.trace(`builder copyConfiguration ${JSON.stringify(configId)}`);
    
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();
            logger.debug(`will execute stored procedure spUpdateBuilderConfigNSOFlag`);
			
            request.input('ConfigId', configId);
            logger.debug('request @configId', configId);
        
            let result = await request.execute('spUpdateBuilderConfigNSOFlag');
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
    
            const response = result.output;

			response.message = "success";
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
	
	builderConfigSearch : async(req, res, next) =>{

        logger.debug('Controller method chambers -> builderConfigSearch');

        try {
            
            const customerId = parseInt(req.query['customerId']);
            const search_term = req.query['search_term'];
            
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            logger.debug(`will execute stored procedure spGetCustomerConfiguration`);
			
			request.input('customerId', customerId);
            logger.debug('@customerId', customerId);

            request.input('search_term', search_term);
            logger.debug('@search_term', search_term);
        
            let result = await request.execute('spGetBuilderConfigSearch');
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
    
            const response = result.recordset;

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
	
	getNewConfigurationTitle: async(req, res, next) =>{

        logger.debug('Controller method chambers -> getNewConfigurationTitle');

        try {  
            
            const customerId = req.query['CustomerId'];
           
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            request.input('CustomerId', customerId);

            let checkConfigNameResult = await request.execute('spGetBuilderConfigByName');
            logger.debug(`executed procedure result : ${JSON.stringify(checkConfigNameResult)}`);

            let checkConfigNm = checkConfigNameResult.recordset.map(record => record.name);
			let insertConfigName = '';
			logger.debug(`checkConfigNm length: ${JSON.stringify(checkConfigNm.length)}`);
			
			if(checkConfigNm.length > 0){
            
				logger.debug(`checkConfigNm: ${JSON.stringify(checkConfigNm)}`);
				
				let lastName = checkConfigNm[checkConfigNm.length-1];
				logger.debug(`lastNumber: ${JSON.stringify(lastName)}`);
				
				var len= lastName.length;
				let allButLast = lastName.substring(0,len-1);
				logger.debug(`allButLast: ${JSON.stringify(allButLast)}`);
                
                var part= lastName.replace(/[^0-9]+/ig,"");				
                var add= parseInt(part)+1;
                newTitleSearch = allButLast + '' + add;
                logger.debug(`newTitleSearch: ${JSON.stringify(newTitleSearch)}`);
				
                insertConfigName = newTitleSearch;
                
                logger.debug(`insertConfigName: ${JSON.stringify(insertConfigName)}`);
				
			logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(insertConfigName)}`);
            res.status(200).json(insertConfigName);
			
            }
			
			else{
				
			let insertConfigName = 'Untitled1'
				

            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(insertConfigName)}`);
            res.status(200).json(insertConfigName);
			}
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
	
	
	chambersSearch: async(req, res, next) =>{

        logger.debug('Controller method chambers -> chambersSearch');

        try {  

            logger.debug(`find chamber query params  : ${JSON.stringify(req.query)}`);
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            logger.debug(`will execute stored procedure spSearchChambersWithGotCodes with`);

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

                            request.input('GotCode',  req.query[queryParamName]);
                            logger.debug('@GotCode', req.query[queryParamName]);

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
                                case 'got_code':
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

            
            result = await request.execute('spSearchChambersWithGotCodes');
            
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            let chambers = result.recordset;
            const totalCount = result.recordset.length > 0 ? result.recordset[0]['TotalCount'] : 0 ;
            const response = {totalCount : totalCount, items : chambers};
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


    insertConfigurations: async(req, res, next) =>{

        logger.debug('Controller method chambers -> insertConfigurations');

        try {  

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request1 =  pool.request();
            
            
            
            logger.debug(`will execute stored procedure spAddConfigurationForSystemIds`);
			let result = await request1.execute('spAddConfigurationForSystemIds');
			logger.debug(`executed procedure spAddConfigurationForSystemIds : ${JSON.stringify(result)}`);
			
            const response = result.recordset;

            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify()}`);
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
	
	  
	 
    insertAllPlatformConfigurations: async(req, res, next) =>{

        logger.debug('Controller method chambers -> insertAllPlatformConfigurations');

        try {  

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request1 =  pool.request();
            
            
            
            logger.debug(`will execute stored procedure spAddConfigurationForAllPlatforms`);
			let result = await request1.execute('spAddConfigurationForAllPlatforms');
			logger.debug(`executed procedure spAddConfigurationForAllPlatforms : ${JSON.stringify(result)}`);
			
            const response = result.recordset;

            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify()}`);
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

	
	insertMasterConfigurations :async(req, res, next) =>{

        logger.debug('Controller method chambers -> insertMasterConfigurations');

        try {  

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request1 =  pool.request();
            
            
            
            logger.debug(`will execute stored procedure spAddMasterSystemIdConfiguration`);
			let result = await request1.execute('spAddMasterSystemIdConfiguration');
			logger.debug(`executed procedure spAddMasterSystemIdConfiguration : ${JSON.stringify(result)}`);
			
            const response = result.recordset;

            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify()}`);
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


    getAllSystemIdsAllFacets : async(req, res, next) =>{

        logger.debug('Controller method chambers -> getAllSystemIdsAllFacets');

        try {
			
			const customerId = req.query['customerId'];
			
                                
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);

            const request2 =  pool.request();
			
			request2.input('CustomerId', customerId);
			
			
            let result = await request2.execute('spGetSystemIdsWithAllFacets');

                     
             let configurationData = result.recordset; 

            logger.debug(`executed query, result configurationData : ${JSON.stringify(configurationData)}`);

            let flattenedConfigData = configurationData.map(config => {
			   let newConfig = {};
			   newConfig['ProjectNo'] = config.ProjectNo;
			   newConfig['CustomerName'] = config.CustomerName;
			   newConfig['FabName'] = config.FabName;
			   newConfig['WaferSize'] = config.WaferSize;
			   newConfig['PlatformName'] = config.PlatformName;
			   			   
			   
			   let facetChamberJs = convert.xml2js(config.Configurations, {compact: true});
			   
			   facetChamberJs = facetChamberJs.facet_chambers.facet_chamber;
			   
			   
			   facetChamberJs = facetChamberJs.map(fc => {
				  
				  let newFC  = {};
				  newFC["facet_name"] = fc.f_name._text;
				  newFC["chamber_name"] = fc["explorer_chamber_name"] != undefined ? fc.explorer_chamber_name._text : null ;
				   return newFC;
				   
			   });
			   
			   //facetChamberJs.forEach(fc => {
				   
				 // newConfig[fc.facet_name] = fc.chamber_name;
				  
			   //});
			   
			   for (let fc of facetChamberJs){
				    
					logger.debug(`fc value of facetname: ${JSON.stringify(fc.chamber_name)}`);
					switch(fc.facet_name){
						case "1" : 
						
						newConfig["CH_1"] = fc.chamber_name;
						break;
						
						case "2" :
						
						newConfig["CH_2"] = fc.chamber_name;
						break;
						
						case "3" :
						
						newConfig["CH_3"] = fc.chamber_name;
						break;
						
						case "4" :
						
						newConfig["CH_4"] = fc.chamber_name;
						break;
						
						case "5" :
						
						newConfig["CH_5"] = fc.chamber_name;
						break;
						
						
						case "A" :
						
						newConfig["CH_A"] = fc.chamber_name;
						break;
						
						
						case "B" :
						
						newConfig["CH_B"] = fc.chamber_name;
						break;
						
						
						case "C" :
						
						newConfig["CH_C"] = fc.chamber_name;
						break;
						
						
						case "D" :
						
						newConfig["CH_D"] = fc.chamber_name;
						break;
						
						
						case "E" :
						
						newConfig["CH_E"] = fc.chamber_name;
						break;
						
						
						
						case "F" :
						
						newConfig["CH_F"] = fc.chamber_name;
						break;							
						
									
						
						
					}
					
				   
			   }			   
			                    
				
			   return newConfig;
			   
		   });    
		      
			               
		   			
            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(flattenedConfigData)}`);
            res.status(200).json(flattenedConfigData);
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
	
	
	
	
	
	getChamberFacetsAandB: async(req, res, next) =>{

        logger.debug('Controller method chambers -> getChamberFacetsAandB');

        try {  

            const facetName = req.query['facet_name'];

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request1 =  pool.request();

            request1.input('FacetName',facetName );           
            
            
            logger.debug(`will execute stored procedure spGetFacetChamberNamesForAandB`);
			let result = await request1.execute('spGetFacetChamberNamesForAandB');
			logger.debug(`executed procedure spGetFacetChamberNamesForAandB : ${JSON.stringify(result)}`);
			
            const response = result.recordset;

            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify()}`);
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
	
	
	getAllSystemIdsWithEmptyFacets : async(req, res, next) =>{

        logger.debug('Controller method chambers -> getAllSystemIdsWithEmptyFacets');

        try {
			
			const customerId = req.query['customerId'];
			
                                
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
			
			const request1 = pool.request();
			
			let facets = await platformRequest.query`select  from Platform where id = ${builderConfigs[0].g3_platform_id}`;
				logger.debug(`executed query, result : ${JSON.stringify(platforms)}`);
            

            const request2 =  pool.request();
			
			request2.input('CustomerId', customerId);
			
			
            let result = await request2.execute('spGetSystemIdsWithEmptyFacets');

                     
            let configurationData = result.recordset; 

            logger.debug(`executed query, result configurationData : ${JSON.stringify(configurationData)}`);

            let flattenedConfigData = configurationData.map(config => {
			   let newConfig = {};
			   newConfig['ProjectNo'] = config.ProjectNo;
			   newConfig['CustomerName'] = config.CustomerName;
			   newConfig['FabName'] = config.FabName;
			   newConfig['WaferSize'] = config.WaferSize;
			   newConfig['PlatformName'] = config.PlatformName;
			   			   
			   
			   let facetChamberJs = convert.xml2js(config.Configurations, {compact: true});
			   
			   facetChamberJs = facetChamberJs.facet_chambers.facet_chamber;
			   
			   
			   facetChamberJs = facetChamberJs.map(fc => {
				  
				  let newFC  = {};
				  newFC["facet_name"] = fc.f_name._text;
				  newFC["chamber_name"] = fc["explorer_chamber_name"] != undefined ? fc.explorer_chamber_name._text : null ;
				   logger.debug(`executed procedure result : ${JSON.stringify(newFC)}`);
				   return newFC;
				   
			   });
			   
			   //facetChamberJs.forEach(fc => {
				   
				 // newConfig[fc.facet_name] = fc.chamber_name;
				  
			   //});
			   
			   for (let fc of facetChamberJs){
				    
					 logger.debug(`fc value of facetname: ${JSON.stringify(fc.chamber_name)}`);
					switch(fc.facet_name){
						case "1" : 
						
						newConfig["CH_1"] = fc.chamber_name;
						break;
						
						case "2" :
						
						newConfig["CH_2"] = fc.chamber_name;
						break;
						
						case "3" :
						
						newConfig["CH_3"] = fc.chamber_name;
						break;
						
						case "4" :
						
						newConfig["CH_4"] = fc.chamber_name;
						break;
						
						case "5" :
						
						newConfig["CH_5"] = fc.chamber_name;
						break;
						
						
						case "A" :
						
						newConfig["CH_A"] = fc.chamber_name;
						break;
						
						
						case "B" :
						
						newConfig["CH_B"] = fc.chamber_name;
						break;
						
						
						case "C" :
						
						newConfig["CH_C"] = fc.chamber_name;
						break;
						
						
						case "D" :
						
						newConfig["CH_D"] = fc.chamber_name;
						break;
						
						
						case "E" :
						
						newConfig["CH_E"] = fc.chamber_name;
						break;
						
						
						
						case "F" :
						
						newConfig["CH_F"] = fc.chamber_name;
						break;				
						
									
						
						
					}
					
				   
			   }			   
			                    
				
			   return newConfig;
			   
		   });		  
          
			               
		   			
            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(flattenedConfigData)}`);
            res.status(200).json(flattenedConfigData);
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
	
	
	getBuilderPlatforms: async (req, res, next) =>{
        
        logger.debug(`Controller method builders -> getBuilderPlatforms`);
        
        try{          
            
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();
			
			for (var queryParamName in req.query) {

                if (req.query.hasOwnProperty(queryParamName)) {

                    switch(queryParamName.toLowerCase()) {
						
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

			
            logger.debug(`will execute stored procedure spGetBuilderPlatforms`);

            result = await request.execute('spGetBuilderPlatforms');
                
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            let platforms = result.recordset;
			
			  for(let platform of platforms)
                {
                    platform["model_svg_url"] = process.env.CLIENT_ASSETS_BASE_URI + subpaths.SVG_FILES +  platform.svg_image;
                }


            platforms = platforms.map(({id, name, svg_image, model_svg_url, facets_count}) => ({id, name, svg_image, model_svg_url, facets_count}));
                
               
			
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
    },
	
	
    getBuilderChamberFamilies  : async(req, res, next) =>{

        logger.debug(`Controller method builders -> getBuilderChamberFamilies`);

        try {

            const platformId = req.query['platformId'];
			
			
            const facetName = req.query['facetName'];

            if(((platformId == 1 || platformId == 3 || platformId == 9 || platformId == 4 )  & facetName ==='A') ||((platformId == 1 || platformId == 3 || platformId == 9 || platformId == 4 ) & facetName =='B'))
           
           {
               
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request1 =  pool.request();

            logger.debug(`will execute stored procedure spBuilderGetChambersForABFacets`);
                                    
            result = await request1.execute('spBuilderGetChambersForABFacets');
			
			let chamber = result.recordset;
			
			const response = {items : chamber};
            
            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(response)}`);
            res.status(200).json(response);
           }
            
                     
        else
            {


          
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();
    
            logger.debug(`will execute stored procedure spBuilderGetChamberFamilies`);
			
		
            request.input('PlatformId', platformId);
            
            result = await request.execute('spBuilderGetChamberFamilies');
            
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            
			let chambersFamilies = result.recordset;			
			
			const totalCount = result.recordset.length > 0 ? result.recordset[0]['TotalCount'] : 0 ;
			
					
			
            const response = {items : chambersFamilies};
			
            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(response)}`);
            res.status(200).json(response);
          }
		
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
	 
	 
	 getBuilderNodeChildren : async(req, res, next) =>{


        logger.debug('Controller method builders -> getBuilderNodeChildren');

        try
        {
            const {builderNodeId} = req.value.params;
            logger.debug(`params passed : ${JSON.stringify(req.value.params)}`);
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();
			
			for (var queryParamName in req.query) {

                if (req.query.hasOwnProperty(queryParamName)) {

                    switch(queryParamName.toLowerCase()) {
						
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



            logger.debug(`will execute stored procedure spGetBuilderNodeChildren @BuilderNodeId =  ${builderNodeId}`);
            request.input('BuilderNodeId', builderNodeId);
            result = await request.execute('spGetBuilderNodeChildren');
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            let children = result.recordset;
	         
			
            const response = { items : children};
        
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

    addUpgradeChamberRules : async(req, res, next) =>{

        const upgradeRules = req.value.body;


        logger.debug('Controller method builders -> addUpgradeChamberRules');

        try
        {
       
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
			
			let upgradeRulesRequest = pool.request();
			let upgradeRulesResultSet = await upgradeRulesRequest.query`select id from ChamberUpgradeRules where chamber_family_id=${upgradeRules.chamber_family_id} and platform_family_id=${upgradeRules.platform_family_id}`;
			logger.debug(`executed query, upgradeRulesResultSet : ${JSON.stringify(upgradeRulesResultSet.recordset)}`);
			
			let upgradeRulesResult = upgradeRulesResultSet.recordset;
			logger.debug(`executed query, upgradeRulesResult : ${upgradeRulesResult}`);
			logger.debug(`executed query, upgradeRulesResult condition : ${upgradeRulesResult.length > 0}`);
			
			if(upgradeRulesResult.length > 0)
			{
				
				for (var upgradeRule of upgradeRulesResult) {
					
					let upgradeRuleID = upgradeRule.id;
					logger.debug(`execute query for chamberRuleResultSet upgradeRuleID : ${upgradeRuleID}`);
					
					let chamberRuleRequest = pool.request();
					let chamberRuleResultSet = await chamberRuleRequest.query`select chamber_id from ChamberUpgradeRule_Chambers where chamberupgrade_ruleid=${upgradeRuleID}`;
					logger.debug(`executed query, chamberRuleResultSet : ${JSON.stringify(chamberRuleResultSet.recordset)}`);
					
					let chamberRuleResult = chamberRuleResultSet.recordset;
					logger.debug(`executed query, chamberRuleResult condition : ${chamberRuleResult.length > 0}`);
				
					for (var chamberRule of chamberRuleResult) {
						
						let chamberIDs = chamberRule.chamber_id;
						
						if (upgradeRules.chamber_ids.length == 1) {
							
							chamberIDs = [chamberIDs];
							
							if (chamberIDs.length == 1) {
								
								if (chamberIDs == upgradeRules.chamber_ids[0]) {
									
									const message = "A Upgrade Rule with the supplied values already exists.";
									logger.trace(`${message} aborting and closing sql conn`);
									sql.close();
									logger.debug(`sql connection closed, sending 409  response to client`);

									res.status(409).send(message);
									return;
								}
							}
							
						} else {
						
							var chamberIDsArray = chamberIDs.split(",");
						
							if (chamberIDsArray.length == upgradeRules.chamber_ids.length) {
								
								chamberIDsArray.sort(function(a, b){return a-b});
								upgradeRules.chamber_ids.sort(function(a, b){return a-b});
								
								logger.debug(`executed query for chamberRuleResultSet chamberIDsArray : ${chamberIDsArray}`);
								logger.debug(`executed query for chamberRuleResultSet upgradeRules.chamber_ids : ${upgradeRules.chamber_ids}`);
								
								if (chamberIDsArray.toString() == upgradeRules.chamber_ids.toString()) {
									
									const message = "A Upgrade Rule with the supplied values already exists.";
									logger.trace(`${message} aborting and closing sql conn`);
									sql.close();
									logger.debug(`sql connection closed, sending 409  response to client`);

									res.status(409).send(message);
									return;
								}
							}
						}
					}
				}
			}
			
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();
           
            request.input('ChamberFamilyId',upgradeRules.chamber_family_id);
            request.input('ChamberIds', upgradeRules.chamber_ids);
            request.input('PlatformFamilyId',upgradeRules.platform_family_id);

            result = await request.execute('spAddUpgradeChamberRules');

            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            const response = result.recordset;
			
			let retVal = result.returnValue;

            if(retVal == 1)
            {
			
			const resp = { sucess : true };
            
            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(resp)}`);
            res.status(200).json(resp);
            }
            else 
			{

                const resp = { sucess : false };
            
            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(resp)}`);
            res.status(200).json(resp);

            }
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
	
	updateUpgradeChamberRules : async(req, res, next) =>{

        const upgradeRules = req.value.body;


        logger.debug('Controller method builders -> updateUpgradeChamberRules');

        try
        {
       
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();
           
            request.input('ChamberFamilyId',upgradeRules.chamber_family_id);
            request.input('ChamberIds', upgradeRules.chamber_ids);
            request.input('RuleId',upgradeRules.rule_id);

            result = await request.execute('spUpdateUpgradeChamberRules');

            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            let reValue = result.returnValue;

            if(reValue == 1)
            {
			
			const resp = { sucess : true };
            
            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(resp)}`);
            res.status(200).json(resp);
            }
            else {

                const resp = { sucess : false };
            
            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(resp)}`);
            res.status(200).json(resp);

            }
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


	
	 

	 
    getUpgradeChamberRules : async(req, res, next) =>{

        

      
        logger.debug('Controller method builders -> getUpgradeChamberRules');

        try
        {
       
	        const chamberfamilyid = req.query['chamberfamilyid'];
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            request.input('ChamberFamilyId', chamberfamilyid);

            result = await request.execute('spGetUpgradeChamberRules');

            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            const upgradeData = result.recordset;
			
			    logger.debug(`executed query, result upgradedata : ${JSON.stringify(upgradeData)}`);

			
			let upgradeRulesData = upgradeData.map(rule => {
                let newRule = {};
                newRule['Upgraderuleid'] = rule.chamberupgrade_ruleid;
                newRule['chamber_family_id'] = rule.chamber_family_id;
                newRule['chamber_family_name'] = rule.chamber_family_name;
				newRule['platform_family_id'] = rule.platform_family_id;
                newRule['platform_family_name'] = rule.platform_family_name;				
			      
						  
                
                let ChamberrulesJs = convert.xml2js(rule.upgraderules, {compact: true});
                
                ChamberrulesJs = ChamberrulesJs.configuration.config;
                
                
                ChamberrulesJs = ChamberrulesJs.map(fc => {
                   
                   let newFC  = {};
                  
				   newFC["ChamberId"] = fc["ChamberId"] != undefined ? fc.ChamberId._text : null ;
				    newFC["ChamberName"] = fc["ChamberName"] != undefined ? fc.ChamberName._text : null ;
                   
				   logger.debug(`executed procedure result : ${JSON.stringify(newFC)}`);
                   
                   return newFC;
                    
                });
				let idArray = [];
				let familyNames = [];
			 for (let fc of ChamberrulesJs){
				
				 
				   idArray.push(fc.ChamberId);
				  
				 	familyNames.push(fc.ChamberName);	
					
				     logger.debug(` value of chamberids: ${JSON.stringify(fc.ChamberId)}`);
					 logger.debug(`value of chamberNames: ${JSON.stringify(fc.ChamberName)}`);
							 newRule["ChamberId"] = idArray;
							 newRule["ChamberName"] = familyNames;
							
							
				 	
					
			 }
				return newRule; 		
					
						
              
                
            });    

            
            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(upgradeRulesData)}`);
            res.status(200).json(upgradeRulesData);
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
	
	 
     deleteUpgradeChamberRules : async(req, res, next) =>{

        logger.debug('Controller method builders -> deleteUpgradeChamberRules');

        try
        {
       
	        const ruleid = req.query['ruleid'];
			
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            
            request.input('Ruleid', ruleid);
          
            result = await request.execute('spDeleteUpgradeChamberRule');

            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            const response = result.recordset;
			
			const resp ={ sucess :true };
            
            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(resp)}`);
            res.status(200).json(resp);
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
	
	getAllUpgradeChamberRules : async(req, res, next) =>{

              
        logger.debug('Controller method builders -> getAllUpgradeChamberRules');

        try
        {
       
	        
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            

            result = await request.execute('spGetAllUpgradeChamberRules');

            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            const upgradeDatas = result.recordset;
			
			    logger.debug(`executed query, result upgradedata : ${JSON.stringify(upgradeDatas)}`);

			
			let upgradeRulesDatas = upgradeDatas.map(rule => {
                let newRule = {};
                newRule['Upgraderuleid'] = rule.chamberupgrade_ruleid;
                newRule['chamber_family_id'] = rule.chamber_family_id;
                newRule['chamber_family_name'] = rule.chamber_family_name;
				newRule['platform_family_id'] = rule.platform_family_id;
				newRule['platform_family_name'] = rule.platform_family_name;
				
			
               
                let ChamberruleJs = convert.xml2js(rule.upgraderules, {compact: true});
                logger.debug(`executed query, result ChamberruleJs before configuration : ${JSON.stringify(ChamberruleJs)}`);
				
                ChamberruleJs = ChamberruleJs.configuration.config;
                logger.debug(`executed query, result ChamberruleJs after config : ${JSON.stringify(ChamberruleJs)}`);
                logger.debug(`executed query, result ChamberruleJs after config : ${JSON.stringify(ChamberruleJs.isArray)}`);
				
				if (Array.isArray(ChamberruleJs)) {
					
					ChamberruleJs = ChamberruleJs.map(fc => {
                   
                   let newFC  = {};
                  
				   newFC["ChamberId"] = fc["ChamberId"] != undefined ? fc.ChamberId._text : null ;
				    newFC["ChamberName"] = fc["ChamberName"] != undefined ? fc.ChamberName._text : null ;
                   
				   logger.debug(`executed procedure result : ${JSON.stringify(newFC)}`);
                   
                   return newFC;
                    
                });
				
				let idArray = [];
				let familyNames = [];
			 for (let fc of ChamberruleJs){
				
				 
				   idArray.push(fc.ChamberId);
				  
				 	familyNames.push(fc.ChamberName);	
					
				     logger.debug(` value of chamberids: ${JSON.stringify(fc.ChamberId)}`);
					 logger.debug(`value of chamberNames: ${JSON.stringify(fc.ChamberName)}`);
							 newRule["ChamberId"] = idArray;
							 newRule["ChamberName"] = familyNames;
							
							
				 	
					
			 }
				return newRule; 
				} else {
					
					let idArray = [];
					let familyNames = [];
			
				   idArray.push(ChamberruleJs.ChamberId._text);
				  
				 	familyNames.push(ChamberruleJs.ChamberName._text);	
					
				     logger.debug(` value of chamberids: ${JSON.stringify(ChamberruleJs.ChamberName._text)}`);
					 logger.debug(`value of chamberNames: ${JSON.stringify(ChamberruleJs.ChamberId._text)}`);
							 newRule["ChamberId"] = idArray;
							 newRule["ChamberName"] = familyNames;
							
				return newRule; 
					
				}
                		
					
						
              
                
            });    

            
            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(upgradeRulesDatas)}`);
            res.status(200).json(upgradeRulesDatas);
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
	
	  getBuilderChamberFamiliesForPlatform  : async(req, res, next) =>{

        logger.debug(`Controller method builders -> getBuilderChamberFamiliesForPlatform`);

        try {

            const platformId = req.query['platformId'];
			
          
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();
			
			for (var queryParamName in req.query) {

                if (req.query.hasOwnProperty(queryParamName)) {

                    switch(queryParamName.toLowerCase()) {
						
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

    
            logger.debug(`will execute stored procedure spBuilderGetChamberFamilies`);
			
		
            request.input('PlatformId', platformId);
            
            result = await request.execute('spBuilderGetChamberFamilies');
            
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            
			let chambersFamilies = result.recordset;			
			      
							
            const response = {items : chambersFamilies};
			
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
	 
	 
	 getPossibleUpgradeChambers : async(req, res, next) =>{

        logger.debug(`Controller method builders -> getPossibleUpgradeChambers`);

        try {

            const chamberFamilyId = req.query['chamberFamilyId'];
			const chamberId = req.query['chamberId'];
			
			
          
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();
    
            logger.debug(`will execute stored procedure spBuilderGetPossibleUpgradeChambers`);
			
			logger.trace(`request chamberFamilyId ${chamberFamilyId}`);
			logger.trace(`request chamberId ${chamberId}`);
		
            request.input('ChamberFamilyId', chamberFamilyId);
			request.input('ChamberId', chamberId);
            
            let result = await request.execute('spBuilderGetPossibleUpgradeChambers');
            
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            let idArray = [];
		    let chamberNames = [];
			let newList = {};
			let chambersList= result.recordset;	

			let chamberRecords;

             let chamberListDatas = chambersList.map(rules => {
               
                newList['chamber_family_id'] = rules.chamber_family_id;
                newList['chamber_family_name'] = rules.chamber_family_name;
			
				let ChamberlistJs = convert.xml2js(rules.upgraderules, {compact: true});
                logger.debug(`executed query, result ChamberlistJs before configuration : ${JSON.stringify(ChamberlistJs)}`);
				
                ChamberlistJs = ChamberlistJs.configuration.config;
                logger.debug(`executed query, result ChamberlistJs after config : ${JSON.stringify(ChamberlistJs)}`);
                logger.debug(`executed query, result ChamberlistJs after config : ${Array.isArray(ChamberlistJs)}`);
			
				if (Array.isArray(ChamberlistJs)) {
					
					ChamberlistJs = ChamberlistJs.map(fc => {
                   
						let newFC  = {};
                  
						newFC["ChamberId"] = fc["ChamberId"] != undefined ? fc.ChamberId._text : null ;
						newFC["ChamberName"] = fc["ChamberName"] != undefined ? fc.ChamberName._text : null ;
                   
						logger.debug(`executed procedure result : ${JSON.stringify(newFC)}`);
                   
						return newFC; 
					});
				
				  
			        for (let fc of ChamberlistJs) {
						
				      idArray.push(fc.ChamberId);
				 	  chamberNames.push(fc.ChamberName);	
					}
					
					return newList; 
				} else {
					
				    idArray.push(ChamberlistJs.ChamberId._text);
					chamberNames.push(ChamberlistJs.ChamberName._text);
				}			   
			});

			logger.debug(` data in chamberNames: ${JSON.stringify(chamberNames)}`);

			const chamberIdsTvp = new sql.Table();
			chamberIdsTvp.columns.add('id', sql.Int);

			for(i=0; i < idArray.length; i++) {
				
				chamberIdsTvp.rows.add(idArray[i]); 
			}

			let request2 =  pool.request();
			request2.input('SelectedUpgradableChamberList', chamberIdsTvp);
			
			let result2 = await request2.execute('spGetBuilderUpgradableChamberData');
			logger.debug(` request2 data : ${JSON.stringify(result2)}`);

			chamberRecords = result2.recordset;

			for(var chamberRec of chamberRecords) {
				
				let getNewRequest= pool.request();
				getNewRequest.input('Name', chamberRec.name);
				
				let chamberGotCode = await getNewRequest.execute('spGetSalesAnalyticsFindChamberGotCodes');
				
                logger.debug(`executed procedure spGetSalesAnalyticsFindChamberGotCodes chamberCount : ${JSON.stringify(chamberGotCode)}`);
				let gotCodeRetrieved = chamberGotCode.recordset.map(record => record.gotCode);
 
				logger.debug(`gotCodeRetrieved : ${JSON.stringify(gotCodeRetrieved)}`);

				if(gotCodeRetrieved.length > 0 ) {
					
					chamberRec.gotCode = gotCodeRetrieved[0];
				} else {

					chamberRec.gotCode= '';
 				}
			}

            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(chamberRecords)}`);
            res.status(200).json(chamberRecords);
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
	

	
	getAllConfigChangeChambersRules : async(req, res, next) =>{

        logger.debug('Controller method builders -> getAllConfigChangeChambersRules');

        try {

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            result = await request.execute('spGetAllConfigChangeChambersRules');

            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            const configChangeResult = result.recordset;
			
            logger.debug(`executed query, result configChangeResult : ${JSON.stringify(configChangeResult)}`);
			
			let chamberFamilies = configChangeResult.map(rule => {

                let newRule = {};

                newRule['ruleid'] = rule.chamberupgrade_ruleid;
				newRule['platform_family_id'] = rule.platform_family_id;
				newRule['platform_family_name'] = rule.platform_family_name;

                let chamberFamilies = convert.xml2js(rule.chamberFamilies, {compact: true});
                logger.debug(`executed query, result chamberFamilies before configuration : ${JSON.stringify(chamberFamilies)}`);
				
                chamberFamilies = chamberFamilies.configuration.config;
                logger.debug(`executed query, result chamberFamilies after config : ${JSON.stringify(chamberFamilies)}`);
                logger.debug(`executed query, result chamberFamilies after config : ${JSON.stringify(Array.isArray(chamberFamilies))}`);
				
				if (Array.isArray(chamberFamilies)) {
					
                    chamberFamilies = chamberFamilies.map(fc => {
                   
                    let newFC  = {};
                  
				    newFC["ChamberFamilyId"] = fc["ChamberFamilyId"] != undefined ? fc.ChamberFamilyId._text : null ;
				    newFC["chamberFamilyName"] = fc["chamberFamilyName"] != undefined ? fc.chamberFamilyName._text : null ;
					newFC["ChamberId"] = fc["ChamberId"] != undefined ? fc.ChamberId._text : null ;
				    newFC["ChamberName"] = fc["ChamberName"] != undefined ? fc.ChamberName._text : null ;
                   
				    logger.debug(`executed procedure result : ${JSON.stringify(newFC)}`);
                   
                    return newFC;
                    
                    });
				
                    let idArray = [];
                    let familyNames = [];
                    let chamberFamilyId = "";
					let chamberFamilyName = "";
					
                    for (let fc of chamberFamilies) {
                    
						let chamberFamilyId = fc.ChamberFamilyId;
						let chamberFamilyName = fc.chamberFamilyName;
					
                        idArray.push(fc.ChamberId);
                        familyNames.push(fc.ChamberName);	
                        
                        logger.debug(` value of chamberids: ${JSON.stringify(fc.ChamberFamilyId)}`);
                        logger.debug(`value of chamberNames: ${JSON.stringify(fc.chamberFamilyName)}`);
                        newRule["ChamberFamily"] = chamberFamilyId;
                        newRule["chamberFamilyName"] = chamberFamilyName;	
                    }

                    return newRule;
				} else {
					
					let idArray = [];
					let familyNames = [];
			
				    idArray.push(chamberFamilies.ChamberId._text);
				  
				 	familyNames.push(chamberFamilies.ChamberName._text);	
					
                    logger.debug(` value of chamberids: ${JSON.stringify(chamberFamilies.ChamberName._text)}`);
                    logger.debug(`value of chamberNames: ${JSON.stringify(chamberFamilies.ChamberId._text)}`);
                    newRule["ChamberId"] = idArray;
                    newRule["ChamberName"] = familyNames;
							
				    return newRule; 
				}
            });

            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(chamberFamilies)}`);
            res.status(200).json(chamberFamilies);
        } catch(error) {
			
            logger.error(error);
            logger.trace(`error caught, closing sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 500 error response to client`);
            res.status(500).send(error.message || '');

        }

    },

    getPossibleConfigChangeChambers : async(req, res, next) => {

        logger.debug(`Controller method builders -> getPossibleConfigChangeChambers`);

        try {

            const chamberFamilyId = req.query['chamberFamilyId'];
			
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();
    
            // request.input('ChamberFamilyId', chamberFamilyId);

            logger.debug(`will execute stored procedure spGetAllConfigChangeChambersRules`);
            
            let result = await request.execute('spGetAllConfigChangeChambersRules');
            
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
			let configChangeResult = result.recordset;		

            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(configChangeResult)}`);
            res.status(200).json(configChangeResult);
        } catch(error) {

            logger.error(error);
            logger.trace(`error caught, closing sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 500 error response to client`);
    
            res.status(500).send(error.name || '');
        }
    },
	
	
     addConfigChangeChamberRules : async(req, res, next) =>{

        logger.debug(`Controller method builders -> addConfigChangeChamberRules`);

        try {

            const requestBody = req.value.body;
			logger.debug(`requestBody addConfiguration : ${JSON.stringify(req.value.body)}`);
		          
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request1`);
            
			let request1 =  pool.request();
			request1.input('PlatformFamilyId' , requestBody.platformId);
			request1.output('PlatformScopeyId', sql.Int, 0);
			
			let insertPlatformID = await request1.execute('spAddBuilderConfigRulesForPlatform');
            logger.debug(`executed query, insertPlatformID : ${JSON.stringify(insertPlatformID)}`);
			
			logger.debug(`will execute stored procedure spAddBuilderConfigRules`);
			
			let chamberConfig = requestBody.chamberfamilies;
			logger.debug(`chamberConfig : ${JSON.stringify(chamberConfig)}`);
			
			logger.trace(`connected to mssql, will create request`);
			let request =  pool.request();
			for(var chamberConf of chamberConfig)
				
			{									 
				
				const chamberConfigInfo = new sql.Table('ConfigChangeRuleList');
				chamberConfigInfo.columns.add('chamberfamilyid', sql.Int);
				chamberConfigInfo.columns.add('chamberids', sql.Int);
				chamberConfigInfo.columns.add('chamberFamilyScopeID', sql.Int);
				
				for (var chamber of chamberConf.chamberIds) {
					
					chamberConfigInfo.rows.add(chamberConf.chamberfamilyId, chamber, '');
				}
				
				logger.debug(`addConfigChangeChamberRules requestBody.platformId : ${JSON.stringify(requestBody.platformId)}`);
				logger.debug(`addConfigChangeChamberRules chamberConfigInfo : ${JSON.stringify(chamberConfigInfo)}`);
			
				request.input('PlatformScopeyId' , insertPlatformID.output.PlatformScopeyId);
				request.input('ConfigChangeRuleList', chamberConfigInfo);
				//request.input('ChambersList', chambersInfo);
            
				result = await request.execute('spAddBuilderConfigRules');
            
				logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            
				let chambersFamilies = result.recordset;	
			
				sql.close();
			}
			
					
			      
							
            const response = {};
			
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
	
	
	

}
