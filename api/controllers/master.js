const {config, sql} = require('../helpers/db-config-helper');
const {logger} = require('../helpers/logging-helper');
const subpaths = require('../helpers/assests-subpaths');

module.exports = {

 index : async (req, res, next) =>{
        
    logger.debug(`Master Controller method -> index`);

        try {

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            const response = { totalCount : 0, items : []};

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
	
	getMasterCustomers : async (req, res, next) =>{
        
		logger.debug(`Master Controller method -> getMasterCustomers`);

        try {

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

            logger.debug(`will execute stored procedure spMasterGetCustomers`);
            
            result = await request.execute('spMasterGetCustomers');
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            let masterCustomers = result.recordset;
			
			
            masterCustomers = masterCustomers.map(({TotalCount, ROWNUM, id, name}) => ({ id, name}));
			logger.debug(`executed procedure spMasterGetCustomers : ${JSON.stringify(masterCustomers)}`);
			
            const totalCount = result.recordset.length > 0 ? result.recordset[0]['TotalCount'] : 0 ;
            const response = { totalCount : totalCount, items : masterCustomers};

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
	
	
	getMasterFabs : async (req, res, next) =>{
        
		logger.debug(`Master Controller method -> getMasterFabs`);

        try {

            const customerId = req.query['customerId'];
			
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            request.input('CustomerId', customerId ) ; 
			
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

            logger.debug(`will execute stored procedure spMasterGetFabs`);
            
            result = await request.execute('spMasterGetFabs');
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            let masterFabs = result.recordset;
			
			
            masterFabs = masterFabs.map(({TotalCount, ROWNUM, id, name}) => ({ id, name}));
			logger.debug(`executed procedure spMasterGetFabs : ${JSON.stringify(masterFabs)}`);
			
            const totalCount = result.recordset.length > 0 ? result.recordset[0]['TotalCount'] : 0 ;
            const response = { totalCount : totalCount, items : masterFabs};

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
	
	
	getMasterProjectNoByFabId: async (req, res, next) =>{
        
		logger.debug(`Master Controller method -> getMasterProjectNoByFabId`);

        try {
			
			const fabId = req.query['fabId'];

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();
			
			request.input('FabId', fabId ) ; 

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

            logger.debug(`will execute stored procedure spMasterProjectNumbersByFabId`);
            
            result = await request.execute('spMasterProjectNumbersByFabId');
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            let masterProjectNumbers = result.recordset;
			
			
            masterProjectNumbers = masterProjectNumbers.map(({TotalCount, ROWNUM, id, customer_id, name}) => ({ id, customer_id, name}));
			logger.debug(`executed procedure spMasterProjectNumbersByFabId : ${JSON.stringify(masterProjectNumbers)}`);
			
            const totalCount = result.recordset.length > 0 ? result.recordset[0]['TotalCount'] : 0 ;
            const response = { totalCount : totalCount, items : masterProjectNumbers};

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
	
	
	
	 getMasterProjectNumbersByCustomerId: async (req, res, next) =>{
        
        logger.debug(`Controller method master -> getMasterProjectNumbersByCustomerId`);
        
        try {

            const customerId = parseInt(req.query['customerId']);
            
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            logger.debug(`will execute stored procedure spMasterGetProjectNumbersByCustomerId`);
			
			request.input('customerId', customerId);
            logger.debug('@customerId', customerId);                 

            result = await request.execute('spMasterGetProjectNumbersByCustomerId');
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            let projectnumbers = result.recordset;
			
			for(var projectnumber of projectnumbers)
            {
				
				let request2 =  pool.request();
			
				let project_no = projectnumber.project_number;
				request2.input('project_no', project_no);
				logger.debug('@project_no', project_no);
				
				let result2 = await request2.execute('spMasterGetPlatformDetailsForProjectNo');
				logger.debug(`executed procedure result2 : ${JSON.stringify(result2)}`);
				let builderConfigs = result2.recordset;
				logger.debug(`executed procedure result2 builderConfigs : ${JSON.stringify(builderConfigs)}`);
				logger.debug(`executed procedure result2 builderConfigs length : ${JSON.stringify(builderConfigs.length)}`);
				
				if(builderConfigs.length > 0) {
					
					for(var builderConfig of builderConfigs)
					{						                      
						projectnumber.svg_image = builderConfig.svg_image;
						projectnumber.model_svg_url = process.env.CLIENT_ASSETS_BASE_URI +subpaths.SVG_FILES+  builderConfig.svg_image;
					}
				} else {
								
					projectnumber.svg_image = "";
					projectnumber.model_svg_url = "";
				}
            }
			
            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(projectnumbers)}`);
            res.status(200).json(projectnumbers);
            
        }
        catch(error)
        {
            logger.error(error);
            logger.debug(`sending 500 error response to client`);
    
            res.status(500).send(error.name || '');
        }
    },
	
	 getMasterSystemIdConfigurations: async (req, res, next) =>{
        
        logger.debug(`Controller method master -> getMasterSystemIdConfigurations`);
        
        try {

            const projectNo = req.query['projectNo'];
			const FabID = req.query['FabID'];
			const CustomerID = req.query['CustomerID'];
			const ProjectNoID = req.query['ProjectNoID'];
			//const FabID = '';
			//const CustomerID = '';
            
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            logger.debug(`will execute stored procedure spMasterGetSystemIdConfigurationsByFabID`);
			
			request.input('projectNo', projectNo);
            logger.debug('@projectNo', projectNo);   

			request.input('CustomerID', CustomerID);
            logger.debug('@CustomerID', CustomerID);   

			request.input('FabID', FabID);
            logger.debug('@FabID', FabID); 

			request.input('ProjectNoID', ProjectNoID);
            logger.debug('@ProjectNoID', ProjectNoID);   			

            result = await request.execute('spMasterGetSystemIdConfigurationsByFabID');
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
			
            let systemdetails = result.recordset;
			logger.debug(`executed procedure systemdetails : ${JSON.stringify(systemdetails)}`);
			
			let name = systemdetails[0].project_no;
			let platform_family_name = systemdetails[0].platform_family_name;
			let platform_family_id = systemdetails[0].platform_family_id;
			let customer_id = systemdetails[0].customer_id;
			
			let response = {};
			response.name = name;
			response.platform_family_name = platform_family_name;
			response.platform_family_id = platform_family_id;
			response.customer_id = customer_id;
			response.configuration = [];
			logger.debug(`executed procedure response : ${JSON.stringify(response)}`);
			
			let configurationArray = [];
			
			for(var chamberId of systemdetails) {
				
				let request2 =  pool.request();
			
				let chamberIds = chamberId.chamber_id;
				
				request2.input('chamberId', chamberIds);
				logger.debug('@chamberId', chamberIds);
				
				let result2 = await request2.execute('spGetGotCodeForChamberId');
				logger.debug(`executed procedure result2 : ${JSON.stringify(result2)}`);
				let gotCodeResult = result2.recordset;
				
				if(gotCodeResult.length > 0 ){
					chamberId.gotCode = gotCodeResult[0].got_code;
				} else{
					chamberId.gotCode= '';
				}
				
				//{"id":"7140","project_no":"406425","platform_family_id":"1","platform_family_name":"Endura2","facet_name":"A","chamber_id":"0","chamber_name":"","chamber_family_id":"0","chamber_family_name":""}
				let configuration = {};
				configuration.id = chamberId.id;
				configuration.facet_name = chamberId.facet_name;
				configuration.chamber_id = chamberId.chamber_id;
				configuration.chamber_name = chamberId.chamber_name;
				configuration.chamber_family_id = chamberId.chamber_family_id;
				configuration.chamber_family_name = chamberId.chamber_family_name;
				configuration.config_id = chamberId.project_no;
				configuration.gotCode = chamberId.gotCode;
				
				logger.debug(`executed procedure configuration : ${JSON.stringify(configuration)}`);
				configurationArray.push(configuration);
			}
			
			response.configuration = configurationArray;
			
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
	
	 masterchambersSearch : async(req, res, next) =>{

        logger.debug('Controller method chambers -> masterchambersSearch');

         try {

            logger.debug(`find chamber query params  : ${JSON.stringify(req.query)}`);
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            logger.debug(`will execute stored procedure spFindChambers with`);

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

                        case 'platformfamilyid':
                        {
                            request.input('PlatformFamilyId',  req.query[queryParamName]);
                            logger.debug('@PlatformFamilyId', req.query[queryParamName]);
                            break;
                        }
                    }
                    
                }
            }
            
            result = await request.execute('spMasterSearchChambersWithGotCodes');
            
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
	
	getMasterAllSystemIdConfigurations : async (req, res, next) =>{
        
        logger.debug(`Controller method master -> getMasterAllSystemIdConfigurations`);
        
        try {

            const customerId = parseInt(req.query['customerId']);
            
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            logger.debug(`will execute stored procedure spMasterGetProjectNumbersByCustomerId`);
			
			request.input('customerId', customerId);
            logger.debug('@customerId', customerId);                 

            result = await request.execute('spMasterGetProjectNumbersByCustomerId');
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            let projectNumbersResult = result.recordset;
			
			let response = [];
			
			for(var projectNumber of projectNumbersResult) {
				
				let request2 =  pool.request();
			
				let projectno = projectNumber.project_number;
				
				request2.input('Projectno', projectno);
				logger.debug('@Projectno', projectno);
				
				request2.input('customerId', customerId);
				logger.debug('@customerId', customerId);
				
				logger.debug(`will execute stored procedure spMasterGetSystemIdConfigurations`);
				
				let result2 = await request2.execute('spMasterGetSystemIdConfigurations');
				
				let configResult = result2.recordset;
				logger.debug(`executed procedure configResult : ${JSON.stringify(configResult)}`);
				

		
				let responseObject = {};
				

				for(var configObject of configResult) {
					
					responseObject.id = projectNumber.id;
					responseObject.ProjectNumber = configObject.project_no;
					responseObject.CustomerName = configObject.customer_name;
					responseObject.FabName = projectNumber.fab_name;
					responseObject.PlatformName = configObject.platform_family_name;
					responseObject.WaferSize = projectNumber.wafer_size;
					
					switch(configObject.facet_name)
                    {
                        case 'A':
                            responseObject.CH_A = configObject.chamber_name;
                            break;
                        case 'B':
                            responseObject.CH_B = configObject.chamber_name;
                            break;
						case 'C':
                            responseObject.CH_C = configObject.chamber_name;
                            break;
						case 'D':
                            responseObject.CH_D = configObject.chamber_name;
                            break;
						case 'E':
                            responseObject.CH_E = configObject.chamber_name;
                            break;
						case 'F':
                            responseObject.CH_F = configObject.chamber_name;
                            break;
						case '1':
                            responseObject.CH_1 = configObject.chamber_name;
                            break;
						case '2':
                            responseObject.CH_2 = configObject.chamber_name;
                            break;
						case '3':
                            responseObject.CH_3 = configObject.chamber_name;
                            break;
						case '4':
                            responseObject.CH_4 = configObject.chamber_name;
                            break;
						case '5':
                            responseObject.CH_5 = configObject.chamber_name;
                            break;
					}
				}
				
				response.push(responseObject);
			}
			
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
	
	
	getMasterEmptySystemIdConfigurations : async (req, res, next) =>{
        
        logger.debug(`Controller method master -> getMasterEmptySystemIdConfigurations`);
        
        try {

            const customerId = parseInt(req.query['customerId']);
            
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            logger.debug(`will execute stored procedure spMasterGetProjectNumbersByCustomerId`);
			
			request.input('customerId', customerId);
            logger.debug('@customerId', customerId);                 

            result = await request.execute('spMasterGetProjectNumbersByCustomerId');
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            let projectNumbersResult = result.recordset;
            let response = [];
		
			
			for(var projectNumber of projectNumbersResult) {
				
				let request2 =  pool.request();
			
				let projectno = projectNumber.project_number;
				
				request2.input('Projectno', projectno);
				logger.debug('@Projectno', projectno);
				
				logger.debug(`will execute stored procedure spMasterGetEmptySystemIdConfigurations`);
				
				let result2 = await request2.execute('spMasterGetEmptySystemIdConfigurations');
				
				let configResult = result2.recordset;
				logger.debug(`executed procedure configResult : ${JSON.stringify(configResult)}`);
					
			
					
			
			   for(var projectNumber of configResult) {
				
                  let request3 =  pool.request();

                  let projectno = projectNumber.project_no;
    
                  request3.input('Projectno', projectno);
                  logger.debug('@Projectno', projectno);
    
                  logger.debug(`will execute stored procedure spMasterGetSystemIdConfigurations`);
    
                  let result3 = await request3.execute('spMasterGetSystemIdConfigurations');
    
                  let configResult1 = result3.recordset;
                  logger.debug(`executed procedure configResult : ${JSON.stringify(configResult1)}`);
        

				let responseObject = {};
				

				for(var configObject of configResult1) {
					
					responseObject.id = projectNumber.id;
					responseObject.ProjectNumber = configObject.project_no;
					responseObject.CustomerName = configObject.customer_name;
					responseObject.FabName = projectNumber.fab_name;
					responseObject.PlatformName = configObject.platform_family_name;
					responseObject.WaferSize = projectNumber.wafer_size;
					
					switch(configObject.facet_name)
                    {
                        case 'A':
                            responseObject.CH_A = configObject.chamber_name;
                            break;
                        case 'B':
                            responseObject.CH_B = configObject.chamber_name;
                            break;
						case 'C':
                            responseObject.CH_C = configObject.chamber_name;
                            break;
						case 'D':
                            responseObject.CH_D = configObject.chamber_name;
                            break;
						case 'E':
                            responseObject.CH_E = configObject.chamber_name;
                            break;
						case 'F':
                            responseObject.CH_F = configObject.chamber_name;
                            break;
						case '1':
                            responseObject.CH_1 = configObject.chamber_name;
                            break;
						case '2':
                            responseObject.CH_2 = configObject.chamber_name;
                            break;
						case '3':
                            responseObject.CH_3 = configObject.chamber_name;
                            break;
						case '4':
                            responseObject.CH_4 = configObject.chamber_name;
                            break;
						case '5':
                            responseObject.CH_5 = configObject.chamber_name;
                            break;
					}
				}
				
				response.push(responseObject);
			}
				
						
	
				
			}
			
			
			
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
	
	
	getMasterPlatformsNotInMapper :  async (req, res, next) =>{
        
    logger.debug(`Master Controller method -> getMasterPlatformsNotInMapper`);

        try {
             
           

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();
            
            result = await request.execute('spMasterPlatformsNotInMapper');
            
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            const platform = result.recordset;
            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(platform)}`);
            res.status(201).json(platform);

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
	
	getMasterPlatforms :  async (req, res, next) =>{
        
    logger.debug(`Master Controller method -> getMasterPlatforms`);

        try {
             
           

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

            
            result = await request.execute('spMasterGetPlatforms');
            
              logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
                let platforms = result.recordset;

                logger.debug(`appending base client-assets http path for platforms model filename`);
                
                platforms.forEach(platform => {
                    platform["model_svg_url"] = process.env.CLIENT_ASSETS_BASE_URI + subpaths.SVG_FILES +  platform.model_svg_filename;
                });
                

                platforms = platforms.map(({TotalCount, ROWNUM, id, name,model_svg_filename, model_svg_url, facets_count, min_facetgroups_count, isFeed}) => ({id, name,model_svg_filename, model_svg_url, facets_count, min_facetgroups_count, isFeed}));
                const totalCount = result.recordset.length > 0 ? result.recordset[0]['TotalCount'] : 0 ;
                const response = {totalCount : totalCount, items : platforms};


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
	
	addNewMasterPlatform :  async (req, res, next) =>{
        
    logger.debug(`Master Controller method -> addNewMasterPlatform`);

        try {
             
			const newPlatformBody = req.value.body;
            logger.debug(`add platform request body  : ${JSON.stringify(req.value.body)}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            logger.debug(`will query for the existence of the platform in the db`);

            let result = await request.query`select count(*) as count from BuilderPlatformFamily where name=${newPlatformBody.name}`;
            logger.debug(`executed query, result : ${JSON.stringify(result.recordset)}`);
            const count = result.recordset[0].count;

            if(count > 0)
            {
                const message = "A platform with the supplied values already exists.";
                logger.trace(`${message} aborting and closing sql conn`);
                sql.close();
                logger.debug(`sql connection closed, sending 409  response to client`);
    
                res.status(409).send(message);
                return;
            }
           

            request =  pool.request();

            logger.debug(`will execute stored procedure spAddPlatform @Name =  ${newPlatformBody.name}, @ModelSvgFilename = ${newPlatformBody.model_svg_filename}`);
            request.input('Name', newPlatformBody.name);
			request.input('FacetCount' ,newPlatformBody.facet_count);
            request.input('ModelSvgFilename', newPlatformBody.model_svg_filename);

            result = await request.execute('spMasterAddPlatform');
            
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            const platform = result.recordset;
            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(platform)}`);
            res.status(201).json(platform);

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
	
	
	
	updateMasterPlatform :  async (req, res, next) =>{
        
    logger.debug(`Master Controller method -> updateMasterPlatform`);

        try {
             
			const {platform_id} = req.value.params;
            const modifiedData = req.value.body;

			
            logger.debug(`add platform request body  : ${JSON.stringify(req.value.body)}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();
			
			                   
			let result = await request.query `select count(BuilderFacets.name) as count
            FROM BuilderFacets INNER JOIN BuilderFacetPlatformFamilyMap ON BuilderFacets.id = BuilderFacetPlatformFamilyMap.facet_id
            INNER JOIN BuilderPlatformFamily ON BuilderFacetPlatformFamilyMap.platform_family_id = BuilderPlatformFamily.id
            WHERE  BuilderFacetPlatformFamilyMap.platform_family_id = ${platform_id}`;
			
			logger.debug(`executed query, result : ${JSON.stringify(result.recordset)}`);
            const count = result.recordset[0].count;

            if(count == modifiedData.facet_count)
            {
			  let request1 =  pool.request();
			  request1.input('PlatformId', platform_id);
			  request1.input('Name', modifiedData.name);
			  request1.input('ModelSvgFilename', modifiedData.model_svg_filename);
			  request1.input('FacetCount' , modifiedData.facet_count);
              
			  result1 = await request1.execute('spMasterUpdatePlatform');
            
               let respValue = result1.returnValue;
			    logger.debug(`return values  : ${JSON.stringify(respValue)}`);
			    logger.debug(`return recordset  : ${JSON.stringify(result1.recordset)}`);

              if(respValue == 1)
               {		
            
			    const response = { success : true };
			
               logger.trace(`will close sql connection`);
               sql.close();
               logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(response)}`);
               res.status(200).json(response);
               }
			   
              else 
			   {

                const response = { sucess : false };
            
               logger.trace(`will close sql connection`);
               sql.close();
               logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(response)}`);
               res.status(200).json(response);
               
			   }
			}
			
			else {
				
				const message = "Facet Count is not same";
                logger.trace(`${message} aborting and closing sql conn`);
                sql.close();
                logger.debug(`sql connection closed, sending 409  response to client`);
    
                res.status(409).send(message);
                return;
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
	
	
	
	addMasterChamberFamilies :  async (req, res, next) =>{
        
    logger.debug(`Master Controller method -> addMasterChamberFamilies`);

        try {
             
			const newChamberFamilyBody = req.value.body;
            logger.debug(`add platform request body  : ${JSON.stringify(req.value.body)}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            logger.debug(`will query for the existence of the chamber family in the db`);

            let result = await request.query`select count(*) as count from MasterChambers where name = ${newChamberFamilyBody.name} and platform_family_id = ${newChamberFamilyBody.platform_id} and node_type_id = 2`;
            logger.debug(`executed query, result : ${JSON.stringify(result.recordset[0].count)}`);
            const count = result.recordset[0].count;

            if(count > 0)
            {
                const message = "A chamber family with the supplied values already exists.";
                logger.trace(`${message} aborting and closing sql conn`);
                sql.close();
                logger.debug(`sql connection closed, sending 409  response to client`);
    
                res.status(409).send(message);
                return;
            }
           
            request1 =  pool.request();
          
            request1.input('Name', newChamberFamilyBody.name);
			request1.input('PlatformId' ,newChamberFamilyBody.platform_id);
            

            result1 = await request1.execute('spMasterAddChamberFamily');
            
            logger.debug(`executed procedure result1 : ${JSON.stringify(result1)}`);
            const platform = result1.recordset;
            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(platform)}`);
            res.status(201).json(platform);

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
	
	updateMasterChamberFamilies :  async (req, res, next) =>{
        
    logger.debug(`Master Controller method -> updateMasterChamberFamilies`);

        try {
             
			const newChambFamilyBody = req.value.body;
            logger.debug(`add platform request body  : ${JSON.stringify(req.value.body)}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
			
			let request =  pool.request();
			let result = await request.query `select count(*) as count from MasterChambers where map_id <> ${newChambFamilyBody.id} and (platform_family_id = ${newChambFamilyBody.platform_id}) and (name = ${newChambFamilyBody.name})`;
			logger.debug(`executed query, result : ${JSON.stringify(result.recordset)}`);
			
			const count = result.recordset[0].count;
			 
			 if(count > 0)
			 {
			 const message = "No two chamber families can have same value for name";
			 logger.trace(`${message} aborting and closing sql conn`);
			 sql.close();
			 logger.debug(`sql connection closed, sending 409 response to client`);
			 
			 res.status(409).send(message);
			 return;
			 }
			 
			 let request2 = pool.request();
                                 
            request2.input('Id', newChambFamilyBody.id);
			request2.input('Name' ,newChambFamilyBody.name);
			request2.input('GotCode', newChambFamilyBody.got_code);
            

            result1 = await request2.execute('spMasterUpdateChamber');
            let respValue = result1.returnValue;
			logger.debug(`return values  : ${JSON.stringify(respValue)}`);
			logger.debug(`return recordset  : ${JSON.stringify(result.recordset)}`);

            if(respValue == 1)
            {		
            
			const response = { success : true };
			
            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(response)}`);
            res.status(200).json(response);
            }
            else {

             const response = { sucess : false };
            
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
	
	addMasterChambers :  async (req, res, next) =>{
        
    logger.debug(`Master Controller method -> addMasterChambers`);

        try {
             
			const newChamberBody = req.value.body;
            logger.debug(`add chamber request body  : ${JSON.stringify(req.value.body)}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            
            let request =  pool.request();

            logger.debug(`will query for the existence of the chamber in the db`);

            let result = await request.query`select count(*) as count from MasterChambers where name=${newChamberBody.name} and platform_family_id = ${newChamberBody.platform_id} and node_type_id = 1`;
            logger.debug(`executed query, result : ${JSON.stringify(result.recordset)}`);
            const count = result.recordset[0].count;
						

            if(count > 0)
            {
                const message = "A chamber with the supplied value already exists.";
                logger.trace(`${message} aborting and closing sql conn`);
                sql.close();
                logger.debug(`sql connection closed, sending 409  response to client`);
    
                res.status(409).send(message);
                return;
            }
			
			
			 let request5 = pool.request();
			
			 request5.input('ChamberName', newChamberBody.name);
                         
             request5.input('GotCode', newChamberBody.got_code);              

             gotCodeRes = await request5.execute('spCheckExistingGotCode');
					 
			
			 let reValue = gotCodeRes.returnValue;
			
			 logger.debug(`executed query, return value : ${JSON.stringify(gotCodeRes.returnValue)}`);
				
           if(reValue == 1)
          
           {	
                const request6 =  pool.request(); 	
			
                let gotCodeResult = await request6.query`select count(*) as count from MasterChambers where got_code =${newChamberBody.got_code}`;
                logger.debug(`executed query, gotCodeResult : ${JSON.stringify(gotCodeResult.recordset)}`);
                const gotCodeCount = gotCodeResult.recordset[0].count;
			
                if(gotCodeCount > 0)
                    {
                        const message = "A Got Code with the supplied value already exists.";
                        logger.trace(`${message} aborting and closing sql conn`);
                        sql.close();
                        logger.debug(`sql connection closed, sending 409  response to client`);
            
                        res.status(409).send(message);
                        return;
                    }
           
                let request3 =  pool.request();
            
                request3.input('Name', newChamberBody.name);
                request3.input('PlatformId' , newChamberBody.platform_id);
                request3.input('ChamberFamilyId' , newChamberBody.chamber_family_id);
                request3.input('GotCode', newChamberBody.got_code);
                

                result3 = await request3.execute('spMasterAddChamber');
                
                logger.debug(`executed procedure result : ${JSON.stringify(result3)}`);
                const chamberResult = result3.recordset;
                logger.trace(`will close sql connection`);
                sql.close();
                logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(chamberResult)}`);
                res.status(201).json(chamberResult);
			}
			
            else 
            {
				
                let request4 =  pool.request();
            
                request4.input('Name', newChamberBody.name);
                request4.input('PlatformId' , newChamberBody.platform_id);
                request4.input('ChamberFamilyId' , newChamberBody.chamber_family_id);
                request4.input('GotCode', newChamberBody.got_code);
                

                result4 = await request4.execute('spMasterAddChamber');
                
                logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
                const chamberResult = result4.recordset;
                logger.trace(`will close sql connection`);
                sql.close();
                logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(chamberResult)}`);
                res.status(201).json(chamberResult);
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
	
	
	updateMasterChamber: async (req, res, next) => {
	 
		 logger.debug('Controller method master -> updateMasterChamber');
		 
		 try {
		 
		 const {chamberId} = req.value.params;
		 const modifications = req.value.body;
		 
		 logger.debug(`update chamber id : ${chamberId}`);
		 logger.debug(`update chamber request body : ${JSON.stringify(req.value.body)}`);
		 
		 logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
		 const pool = await new sql.ConnectionPool(config).connect();
		 
		 logger.trace(`connected to mssql, will create request`);
		let masterChamberRequest = pool.request();
		 
		let masterChamberResult = await masterChamberRequest.query`select name, got_code, platform_family_id from MasterChambers where map_id=${chamberId}`;
		logger.debug(`executed query, masterChamberResult : ${JSON.stringify(masterChamberResult.recordset)}`);
		const masterChamberName = masterChamberResult.recordset[0].name;
		const masterChamberGotCode = masterChamberResult.recordset[0].got_code;
		const masterChamberPlatformFamilyId = masterChamberResult.recordset[0].platform_family_id;
		
		let mapperChamberRequest = pool.request();
		let mapperChamberResult = await mapperChamberRequest.query`select count(*) as count from Chamber where got_code=${masterChamberGotCode} and platform_id=${masterChamberPlatformFamilyId}`;
		logger.debug(`executed query, mapperChamberResult : ${JSON.stringify(mapperChamberResult.recordset)}`);
		const mapperChambercount = mapperChamberResult.recordset[0].count;
		
		if(mapperChambercount > 0)
		{
			const message = "These is Mapper Chamber dependent on this chamber. Please delete it first";
			logger.trace(`${message} aborting and closing sql conn`);
			sql.close();
			logger.debug(`sql connection closed, sending 409  response to client`);

			res.status(409).send(message);
			return;
		}
		
		 logger.trace(`connected to mssql, will create request`);
		 let request = pool.request();
		 
		 logger.debug(`will query for the existence of other chamber in the db having same values`);
		 
		 let result = await request.query`select count(*) as count from MasterChambers where map_id <> ${chamberId} and chamber_family_id = ${modifications.chamber_family_id}  and (name=${modifications.name} or got_code=${modifications.got_code})`;
		 logger.debug(`executed query, result : ${JSON.stringify(result.recordset)}`);
		 const count = result.recordset[0].count;
		 
		 if (count > 0) {
		 const message = "No two chambers can have same value for name and got code";
		 logger.trace(`${message} aborting and closing sql conn`);
		 sql.close();
		 logger.debug(`sql connection closed, sending 409 response to client`);
		 
		 res.status(409).send(message);
		 return;
		 }
		 
		 request = pool.request();
		 logger.debug(`will execute stored procedure spMasterUpdateChamber @Id=${chamberId} @Name = ${modifications.name}, @GotCode=${modifications.got_code}`);
		 request.input('Id', chamberId);
		 request.input('Name', modifications.name);
		 request.input('GotCode', modifications.got_code);
		 
		 result = await request.execute('spMasterUpdateChamber');
		 
		 logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
		 
		 logger.trace(`will close sql connection`);
		 sql.close();
		 logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify({ success: true })}`);
		 
		 res.status(200).json({ success: true });
		 }
		 catch (error) {
		 logger.error(error);
		 logger.trace(`error caught, closing sql connection`);
		 sql.close();
		 logger.debug(`sql connection closed, sending 500 error response to client`);
		 
		 res.status(500).send(error.name || '');
		 }
		 
		 },
		 
	
	   removeMasterChamber: async (req, res, next) => {
 
			 logger.debug('Controller method master -> removeMasterChamber');
			 
			 try {
			 const { chamberId } = req.value.params;
			 logger.debug(`delete chamber id : ${chamberId}`);
			 
			 logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
			 const pool = await new sql.ConnectionPool(config).connect();
			 
			logger.trace(`connected to mssql, will create request`);
			let masterChamberRequest = pool.request();
			 
			let masterChamberResult = await masterChamberRequest.query`select name, got_code, platform_family_id from MasterChambers where map_id=${chamberId}`;
            logger.debug(`executed query, masterChamberResult : ${JSON.stringify(masterChamberResult.recordset)}`);
			const masterChamberName = masterChamberResult.recordset[0].name;
			const masterChamberGotCode = masterChamberResult.recordset[0].got_code;
			const masterChamberPlatformFamilyId = masterChamberResult.recordset[0].platform_family_id;
			
			let mapperChamberRequest = pool.request();
			let mapperChamberResult = await mapperChamberRequest.query`select count(*) as count from Chamber where got_code=${masterChamberGotCode} and platform_id=${masterChamberPlatformFamilyId}`;
			logger.debug(`executed query, mapperChamberResult : ${JSON.stringify(mapperChamberResult.recordset)}`);
			const mapperChambercount = mapperChamberResult.recordset[0].count;
            
			if(mapperChambercount > 0)
            {
                const message = "These is Mapper Chamber dependent on this chamber. Please delete it first";
                logger.trace(`${message} aborting and closing sql conn`);
                sql.close();
                logger.debug(`sql connection closed, sending 409  response to client`);
    
                res.status(409).send(message);
                return;
            }
			 
			logger.trace(`connected to mssql, will create request`);
			let request = pool.request();
			
			 logger.debug(`will query for the existence of product configs in the db having dependency on this chamber`);
			 logger.debug(`will execute stored procedure spGetProductConfigNamesByChamberId @Id=${chamberId}`);
			 request.input('Id', chamberId);
			 result = await request.execute('spGetProductConfigNamesByChamberId');
			 
			 logger.debug(`executed procedure result : ${JSON.stringify(result.recordset)}`);
			 
			 if (result.recordset.length > 0) {
			 const message = `There ${result.recordset.length <= 1 ? 'is' : 'are'} ${result.recordset.length} ${result.recordset.length <= 1 ? 'product config' : 'product configs'} dependent on this chamber. Please delete ${result.recordset.length <= 1 ? 'it' : 'them'} first.`;
			 logger.trace(`${message} aborting and closing sql conn`);
			 sql.close();
			 logger.debug(`sql connection closed, sending 409 response to client`);
			 
			 res.status(409).send(message);
			 return;
			 }
			 
			 request = pool.request();
			 logger.debug(`will execute stored procedure spMasterDeleteChamber @Id=${chamberId}`);
			 request.input('Id', chamberId);
			 result = await request.execute('spMasterDeleteChamber');
			 
			 logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
			 
			 logger.trace(`will close sql connection`);
			 sql.close();
			 logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify({ success: true })}`);
			 
			 res.status(200).json({ success: true });
			 }
			 catch (error) {
			 logger.error(error);
			 logger.trace(`error caught, closing sql connection`);
			 sql.close();
			 logger.debug(`sql connection closed, sending 500 error response to client`);
			 
			 res.status(500).send(error.name || '');
			 }
			 
			 },
			 
	
	removeMasterChamberFamily: async (req, res, next) => {
 
		 logger.debug('Controller method master -> removeMasterChamberFamily');
		 try {
		 
		 const {chamberFamilyId} = req.value.params;
		 
		 logger.debug(`update chamber family id : ${chamberFamilyId}`);
		 
		 logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
		 const pool = await new sql.ConnectionPool(config).connect();
		 logger.trace(`connected to mssql, will create request`);
		 let request = pool.request();
		 
		 logger.debug(`will query for the existence of chambers in the db under the chamber family`);
		 
		 let result = await request.query`select count(*) as count from MasterChambers where chamber_family_id = ${chamberFamilyId}`;
		 logger.debug(`executed query, result : ${JSON.stringify(result.recordset)}`);
		 const count = result.recordset[0].count;
		 
		 if (count > 0) {
		 const message = `There ${count<= 1 ? 'is' : 'are'} ${count} ${count<= 1 ? 'Chamber' : 'Chambers'} dependent on this Chamber Family. Please delete ${count <= 1 ? 'it' : 'them'} first.`;
		 logger.trace(`${message} aborting and closing sql conn`);
		 sql.close();
		 logger.debug(`sql connection closed, sending 409 response to client`);
		 
		 res.status(409).send(message);
		 return;
		 }
		 
		 request = pool.request();
		 logger.debug(`will execute stored procedure spMasterDeleteChamber @Id=${chamberFamilyId}`);
		 request.input('Id', chamberFamilyId);
		 
		 result = await request.execute('spMasterDeleteChamber');
		 
		 logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
		 
		 logger.trace(`will close sql connection`);
		 sql.close();
		 logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify({ success: true })}`);
		 
		 res.status(200).json({ success: true });
		 }
		 catch (error) {
		 logger.error(error);
		 logger.trace(`error caught, closing sql connection`);
		 sql.close();
		 logger.debug(`sql connection closed, sending 500 error response to client`);
		 
		 res.status(500).send(error.name || '');
		 }
		 
		 },
		 
		 
	removeMasterPlatform: async (req, res, next) => {
 
		 logger.debug('Controller method master -> removeMasterPlatform');
		 try {
		 
		 const {platform_id} = req.value.params;
		 
		 logger.debug(`remove platform family id : ${platform_id}`);
		 
		 logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
		 const pool = await new sql.ConnectionPool(config).connect();
		 logger.trace(`connected to mssql, will create request`);
		 let request = pool.request();
		 
		 logger.debug(`will query for the existence of chamberFamilies in the db under the platform family`);
		 
		 let result = await request.query`select count(*) as count from MasterChambers where platform_family_id = ${platform_id} and node_type_id=2`;
		 logger.debug(`executed query, result : ${JSON.stringify(result.recordset)}`);
		 const count = result.recordset[0].count;
		 
		 if (count > 0) {
		 const message = `There ${count <= 1 ? 'is' : 'are'} ${count} ${count <= 1 ? 'Chamber Family' : 'Chamber Families'} dependent on this platform. Please delete ${count <= 1 ? 'it' : 'them'} first.`;
		 logger.trace(`${message} aborting and closing sql conn`);
		 sql.close();
		 logger.debug(`sql connection closed, sending 409 response to client`);
		 
		 res.status(409).send(message);
		 return;
		 }
		 
		 let request2 = pool.request();
		 
		 logger.debug(`will query for the existence of platform in the db under the mapper`);
		 
		 let result2 = await request2.query`select count(*) as count from MapperPlatform where platform_id = ${platform_id}`;
		 logger.debug(`executed query, result : ${JSON.stringify(result.recordset)}`);
		 const count1 = result2.recordset[0].count;
		 if (count1 > 0) {
		 const message = `There ${count <= 1 ? 'is' : 'are'} ${count} {count <= 1 ? 'platform' : 'platforms'} in Mapper dependent on this platform. Please delete ${count<= 1 ? 'it' : 'them'} first.`;
		 logger.trace(`${message} aborting and closing sql conn`);
		 sql.close();
		 logger.debug(`sql connection closed, sending 409 response to client`);
		 
		 res.status(409).send(message);
		 return;
		 }
		 
		 request3 = pool.request();
			 
			 logger.debug(`will query for the existence of Facets and G2ProductTypes in the db having dependency on this platform`);
			 logger.debug(`will execute stored procedure spGetPlatformDependentsCount @PlatformId=${platform_id}`);
			 request3.input('PlatformId', platform_id);
			 let result3 = await request3.execute('spGetPlatformDependentsCount');
			 
			 logger.debug(`executed procedure result : ${JSON.stringify(result3.recordset)}`);
			 
			 if(result3.recordset[0]['dependents_count'] > 0)
			 {
			 const message = `There ${result3.recordset[0]['dependents_count'] <= 1 ? 'is' : 'are'} ${result3.recordset[0]['dependents_count']} Facets and/or G2ProductTypes dependent on this platform. Please delete ${result3.recordset[0]['dependents_count'] <= 1 ? 'it' : 'them'} first.`;
			 logger.trace(`${message} aborting and closing sql conn`);
			 sql.close();
			 logger.debug(`sql connection closed, sending 409 response to client`);
			 
			 res.status(409).send(message);
			 return;
			 }
					 
		 let request4 = pool.request();
		 
		 logger.debug(`will query for the deleting the core platform in the db `);
		 
		 request4.input('PlatformId', platform_id);
		 let result4 = await request4.execute('spMasterDeletePlatform'); 
		 	
		 logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
			 
			 		 
		 logger.trace(`will close sql connection`);
		 sql.close();
		 logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify({ success: true })}`);
		 
		 res.status(200).json({ success: true });
		 }
		 
		 catch (error) {
		 logger.error(error);
		 logger.trace(`error caught, closing sql connection`);
		 sql.close();
		 logger.debug(`sql connection closed, sending 500 error response to client`);
		 
		 res.status(500).send(error.name || '');
		 }
		 
		 
	},
	
	
	getMasterChambersNotInMapperForPlatform :  async(req, res, next) =>{

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
            
            result = await request.execute('spMasterGetChamberNotInMapper');
            
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
	 
		 	

							
							

							

		


}
