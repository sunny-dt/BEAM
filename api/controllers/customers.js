const {config, sql} = require('../helpers/db-config-helper');
const {logger} = require('../helpers/logging-helper');
const subpaths = require('../helpers/assests-subpaths');

module.exports = {

 //Validation DONE
 index : async (req, res, next) =>{
        
    logger.debug(`Controller method customers -> index`);

    
        try {

          
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

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
            


            logger.debug(`will execute stored procedure spGetCustomers`);
            
            result = await request.execute('spGetCustomers');
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            let customers = result.recordset;
			
			
            customers = customers.map(({TotalCount, ROWNUM, id, name}) => ({ id, name}));
			logger.debug(`executed procedure customers : ${JSON.stringify(customers)}`);
			
            const totalCount = result.recordset.length > 0 ? result.recordset[0]['TotalCount'] : 0 ;
            const response = { totalCount : totalCount, items : customers};

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

    getProjectNumbers: async (req, res, next) =>{
        
        logger.debug(`Controller method customers -> index`);
        
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

            result = await request.execute('spGetCustomerProjectNumbers');
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            let projectnumbers = result.recordset;
			
			for(var projectnumber of projectnumbers)
            {
				
				let request2 =  pool.request();
			
				let project_no = projectnumber.project_no;
				request2.input('project_no', project_no);
				logger.debug('@project_no', project_no);
				
				let result2 = await request2.execute('spGetBuilderConfigByProjectNo');
				logger.debug(`executed procedure result2 : ${JSON.stringify(result2)}`);
				let builderConfigs = result2.recordset;
				logger.debug(`executed procedure result2 builderConfigs : ${JSON.stringify(builderConfigs)}`);
				logger.debug(`executed procedure result2 builderConfigs length : ${JSON.stringify(builderConfigs.length)}`);
				
				if(builderConfigs.length > 0) {
					
					for(var builderConfig of builderConfigs)
					{
						
                        projectnumber.config_id = builderConfig.configID;
						projectnumber.svg_image = builderConfig.svg_image;
						projectnumber.model_svg_url = process.env.CLIENT_ASSETS_BASE_URI + subpaths.SVG_FILES +  builderConfig.svg_image;
					}
				} else {
					
					projectnumber.config_id = "";
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

	addCustomer : async (req, res, next) =>{
        
        logger.debug(`Controller method customers -> addCustomer`);

        try {

            const customerName = req.query['customerName'];
            
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();
            logger.debug(`will execute stored procedure spAddCustomer`);
            
            request.input('Name', customerName);
            logger.debug('@Name', customerName);

			request.output('IsExistName', sql.Int, 0);

            result = await request.execute('spAddCustomer');
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            const isExistName = result.output;

			if (isExistName.IsExistName == 0) {
			
				isExistName.message = "Customer already exist";
			} else {
			
				isExistName.message = "Added successfully";
			}
			
            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(isExistName)}`);
            res.status(200).json(isExistName);
            
        }
        catch(error)
        {
            logger.error(error);
            logger.debug(`sending 500 error response to client`);
    
            res.status(500).send(error.name || '');
        }
    },
	
	//Validation DONE
    updateCustomer: async(req, res, next) =>{

        logger.debug('Controller method customers -> updateCustomer');
        try{

            const customerId = req.query['customerId'];
			logger.debug(`updateCustomer customerId  : ${customerId}`);
			logger.debug(`updateCustomer request body  : ${JSON.stringify(req.value.body)}`);
            // const {customerId} = req.value.params;
            const modifications = req.value.body;

            logger.debug(`updateCustomer customerId  : ${customerId}`);
            logger.debug(`updateCustomer request body  : ${JSON.stringify(req.value.body)}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            logger.debug(`will query for the existence of other customerId in the db having same values`);

            request = pool.request();
            logger.debug(`will execute stored procedure spUpdateCustomer @Id=${customerId} @Name =  ${modifications.name}`);
            request.input('Id', customerId);
            request.input('Name', modifications.name);
            
            result = await request.execute('spUpdateCustomer');
            
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
    removeCustomer: async(req, res, next) =>{

        logger.debug('Controller method customers -> removeCustomer');

        try{
            const customerId = req.query['customerId'];
            logger.debug(`delete customerId  : ${customerId}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            request =  pool.request();
            logger.debug(`will execute stored procedure spDeleteCustomer @Id=${customerId}`);
            request.input('Id', customerId);
            result = await request.execute('spDeleteCustomer');
            
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
	
}
