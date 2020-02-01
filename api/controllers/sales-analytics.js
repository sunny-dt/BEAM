const {config, sql} = require('../helpers/db-config-helper');
const {logger} = require('../helpers/logging-helper');

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

	getSaleAnalyticsForAllChambers : async(req, res, next) =>{

        logger.debug('Controller method chambers -> getSaleAnalyticsForAllChambers');

        try {
            
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            logger.debug(`will execute stored procedure spGetSalesAnalyticsAllChamberNames`);
        
            let result = await request.execute('spGetSalesAnalyticsAllChamberNames');
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
    
            const allUniqueChambers = result.recordset;
            logger.debug(`executed procedure spGetSalesAnalyticsAllChamberNames allUniqueChambers : ${JSON.stringify(allUniqueChambers)}`);
			
			for (var uniqueChamber of allUniqueChambers) {

                logger.debug(`salesAnalytics getSaleAnalyticsForAllChambers uniqueChamber name : ${uniqueChamber.name}`);
                
                let getCountRequest =  pool.request();
                getCountRequest.input('Name', uniqueChamber.name);

                logger.debug(`builder copyConfiguration spGetSalesAnalyticsAllChamberCountByName getCountRequest : ${getCountRequest}`);
			
                let chamberCount = await getCountRequest.execute('spGetSalesAnalyticsAllChamberCountByName');
                logger.debug(`executed procedure spGetSalesAnalyticsAllChamberCountByName chamberCount : ${JSON.stringify(chamberCount)}`);

                uniqueChamber.count = chamberCount.recordset[0].SUM;
            }

            let response = allUniqueChambers;
			allUniqueChambers.sort(function(a,b)
			{
			return  b.count-a.count
			})
			logger.debug(`allUniqueData : ${JSON.stringify(allUniqueChambers)}`);
			
            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(allUniqueChambers)}`);
            res.status(200).json(allUniqueChambers);
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
	
	getSaleAnalyticsForAllCustomersByChamber : async(req, res, next) =>{

        logger.debug('Controller method chambers -> getSaleAnalyticsForAllCustomersByChamber');

        try {

            const chamberName = (req.query['ChamberName']);
            logger.trace(`builder getSaleAnalyticsForAllCustomersByChamber ${JSON.stringify(chamberName)}`);
            
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            logger.debug(`will execute stored procedure spGetSalesAnalyticsAllCustomers`);

            let result = await request.execute('spGetSalesAnalyticsAllCustomers');
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
    
            const allUniqueCustomers = result.recordset;
            logger.debug(`executed procedure spGetSalesAnalyticsAllCustomers allUniqueCustomers : ${JSON.stringify(allUniqueCustomers)}`);
			
			for (var uniqueCustomer of allUniqueCustomers) {

                logger.debug(`salesAnalytics getSaleAnalyticsForAllCustomersByChamber uniqueCustomer name : ${uniqueCustomer.CustomerName}`);
                
                let getCountRequest =  pool.request();
                getCountRequest.input('CustomerName', uniqueCustomer.CustomerName);
                getCountRequest.input('ChamberName', chamberName);

                logger.debug(`builder copyConfiguration spGetSalesAnalyticsChamberCountByCustomer getCountRequest : ${getCountRequest}`);
			
                let customerCount = await getCountRequest.execute('spGetSalesAnalyticsChamberCountByCustomer');
                logger.debug(`executed procedure spGetSalesAnalyticsChamberCountByCustomer customerCount : ${JSON.stringify(customerCount)}`);

                uniqueCustomer.count = customerCount.recordset[0].SUM;
            }

            let response = allUniqueCustomers;
			allUniqueCustomers.sort(function(a,b)
            {
                return b.count-a.count
            })
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
	
	getSaleAnalyticsForAllFabsByChamber : async(req, res, next) =>{

        logger.debug('Controller method chambers -> getSaleAnalyticsForAllFabsByChamber');

        try {

            const chamberName = req.query['ChamberName'];
            const customerName = req.query['CustomerName'];
            logger.trace(`builder getSaleAnalyticsForAllFabsByChamber chamberName: ${JSON.stringify(chamberName)}`);
            logger.trace(`builder getSaleAnalyticsForAllFabsByChamber customerName: ${JSON.stringify(customerName)}`);
			
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            logger.debug(`will execute stored procedure spGetSalesAnalyticsAllCustomers`);
            request.input('CustomerName', customerName);

            let result = await request.execute('spGetSalesAnalyticsAllFabsByCustomer');
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
    
            const allUniqueFabs = result.recordset;
            logger.debug(`executed procedure spGetSalesAnalyticsAllFabsByCustomer allUniqueFabs : ${JSON.stringify(allUniqueFabs)}`);
			
			for (var uniqueFab of allUniqueFabs) {

                logger.debug(`salesAnalytics getSaleAnalyticsForAllCustomersByChamber uniqueFab name : ${uniqueFab.name}`);
                
                let getCountRequest =  pool.request();
                getCountRequest.input('FabName', uniqueFab.FabName);
                getCountRequest.input('ChamberName', chamberName);
                getCountRequest.input('CustomerName', customerName);

                logger.debug(`builder copyConfiguration spGetSalesAnalyticsChamberCountByFab getCountRequest : ${getCountRequest}`);
			
                let chamberCount = await getCountRequest.execute('spGetSalesAnalyticsChamberCountByFab');
                logger.debug(`executed procedure spGetSalesAnalyticsChamberCountByFab chamberCount : ${JSON.stringify(chamberCount)}`);

                uniqueFab.count = chamberCount.recordset[0].SUM;
            }

            let response = allUniqueFabs;
			allUniqueFabs.sort(function(a,b)
            {
                return b.count-a.count
            })
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
	
	getSaleAnalyticsCustomersName : async(req, res, next) =>{

        logger.debug('Controller method chambers -> getSaleAnalyticsCustomersName');

        try {
            
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            logger.debug(`will execute stored procedure spGetSalesAnalyticsAllCustomers`);
        
            let result = await request.execute('spGetSalesAnalyticsAllCustomers');
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
    
            const allUniqueCustomers = result.recordset;
            logger.debug(`executed procedure spGetSalesAnalyticsAllCustomers allUniqueCustomers : ${JSON.stringify(allUniqueCustomers)}`);
			
			for (var uniqueCustomer of allUniqueCustomers) {

                logger.debug(`salesAnalytics spGetSalesAnalyticsAllCustomers uniqueCustomer name : ${uniqueCustomer.name}`);
                
                let getCountRequest =  pool.request();
                getCountRequest.input('CustomerName', uniqueCustomer.CustomerName);

                logger.debug(`builder copyConfiguration spGetSalesAnalyticsCustomerCount getCountRequest : ${getCountRequest}`);
			
                let customerCount = await getCountRequest.execute('spGetSalesAnalyticsCustomerCount');
                logger.debug(`executed procedure spGetSalesAnalyticsCustomerCount customerCount : ${JSON.stringify(customerCount)}`);

                uniqueCustomer.count = customerCount.recordset[0].SUM;
            }

            let response = allUniqueCustomers;
			allUniqueCustomers.sort(function(a,b)
            {
                return b.count-a.count
            })
			
			
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
	
	getSaleAnalyticsFabDataForCustomers : async(req, res, next) =>{

        logger.debug('Controller method chambers -> getSaleAnalyticsFabDataForCustomers');

        try {
            
            const customerName = req.query['CustomerName'];
            
            logger.trace(`builder getSaleAnalyticsFabDataForCustomers customerName: ${JSON.stringify(customerName)}`);
			
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            logger.debug(`will execute stored procedure spGetSalesAnalyticsAllCustomers`);
            request.input('CustomerName', customerName);

            let result = await request.execute('spGetSalesAnalyticsAllFabsByCustomer');
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
    
            const allUniqueFabs = result.recordset;
            logger.debug(`executed procedure spGetSalesAnalyticsFabCount allUniqueFabs : ${JSON.stringify(allUniqueFabs)}`);
			
			for (var uniqueFab of allUniqueFabs) {

                logger.debug(`salesAnalytics spGetSalesAnalyticsAllCustomers uniqueFab name : ${uniqueFab.name}`);
                
                let getCountRequest =  pool.request();
                getCountRequest.input('FabName', uniqueFab.FabName);               
                getCountRequest.input('CustomerName', customerName);

                logger.debug(`builder copyConfiguration spGetSalesAnalyticsFabCount getCountRequest : ${getCountRequest}`);
			
                let fabCount = await getCountRequest.execute('spGetSalesAnalyticsFabCount');
                logger.debug(`executed procedure spGetSalesAnalyticsFabCount chamberCount : ${JSON.stringify(fabCount)}`);

                uniqueFab.count = fabCount.recordset[0].SUM;
            }

            let response = allUniqueFabs;
			allUniqueFabs.sort(function(a,b)
            {
                return b.count-a.count
            })
						
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
	
	getSaleAnalyticsChambersByFabForCustomer : async(req, res, next) =>{

        logger.debug('Controller method chambers -> getSaleAnalyticsChambersByFabForCustomer');

        try {
            
            const customerName = req.query['CustomerName'];
			const fabName = req.query['FabName'];
            
            logger.trace(`builder getSaleAnalyticsChambersByFabForCustomer customerName: ${JSON.stringify(customerName)}`);
			logger.trace(`builder getSaleAnalyticsChambersByFabForCustomer fabName: ${JSON.stringify(fabName)}`);
			
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            logger.debug(`will execute stored procedure spGetSalesAnalyticsChamberNamesByFab`);
            request.input('CustomerName', customerName);
			request.input('FabName', fabName);

            let result = await request.execute('spGetSalesAnalyticsChamberNamesByFab');
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
    
            const allUniqueChambers = result.recordset;
            logger.debug(`executed procedure spGetSalesAnalyticsChamberNamesByFab allUniqueChambers : ${JSON.stringify(allUniqueChambers)}`);
			
			for (var uniqueChamber of allUniqueChambers) {

                logger.debug(`salesAnalytics spGetSalesAnalyticsChamberNamesByFab uniqueChamber name : ${uniqueChamber.name}`);
                
                let getCountRequest =  pool.request();
                getCountRequest.input('ChamberName', uniqueChamber.name);               
                getCountRequest.input('CustomerName', customerName);
				getCountRequest.input('FabName',fabName);

                logger.debug(`builder copyConfiguration spGetSalesAnalyticsChamberCountByFab getCountRequest : ${getCountRequest}`);
			
                let chamberCount = await getCountRequest.execute('spGetSalesAnalyticsChamberCountByFab');
                logger.debug(`executed procedure spGetSalesAnalyticsChamberCountByFab chamberCount : ${JSON.stringify(chamberCount)}`);

                uniqueChamber.count = chamberCount.recordset[0].SUM;
            }
			

            let response = allUniqueChambers;
			allUniqueChambers.sort(function(a,b)
            {
                return b.count-a.count
            })
			
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
	
	
	getSaleAnalyticsUpgradeChamberName : async(req, res, next) =>{

        logger.debug('Controller method chambers -> getSaleAnalyticsUpgradeChamberName');

        try {
            
            const chamberName = req.query['ChamberName'];
			
            logger.trace(`builder getSaleAnalyticsUpgradeChamberName customerName: ${JSON.stringify(chamberName)}`);
		
			
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            logger.debug(`will execute stored procedure spGetSalesAnalyticsUpgradeChamberNames`);
            request.input('ChamberName', chamberName);
			
            let result = await request.execute('spGetSalesAnalyticsUpgradeChamberNames');
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
             
            const upgradeChamberName = result.recordset;
			const upgArray= new Array();
			for(i=0;i<upgradeChamberName.length;i++)
			{
				upgArray.push(upgradeChamberName[i].upgrade_name);
				
				
			}					
				
			
			logger.debug(`upgArray : ${JSON.stringify(upgArray)}`);
			
			
            let response = upgradeChamberName;
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
	
	 getSalesAnalyticsChamberFlowChamber: async(req, res, next) =>{

        logger.debug('Controller method chambers -> getSalesAnalyticsChamberFlowChamber');

        try {
            const chamberNames = req.value.body.chamberName;
            const customerNames = req.value.body.customerName;
			const minValue = req.value.body.value;

            logger.debug(`request body : ${JSON.stringify(req.value.body)}`);
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
			
			if(chamberNames.length==0 && customerNames.length==0){
				let request =  pool.request();

				logger.debug(`will execute stored procedure spGetSalesAnalyticsAllChamberNames`);
			
				let result = await request.execute('spGetSalesAnalyticsAllChamberNames');
				logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
		
				const allUniqueChambers = result.recordset;
				logger.debug(`executed procedure spGetSalesAnalyticsAllChamberNames allUniqueChambers : ${JSON.stringify(allUniqueChambers)}`);
			
			for (var uniqueChamber of allUniqueChambers) {

                logger.debug(`salesAnalytics getSaleAnalyticsForAllChambers uniqueChamber name : ${uniqueChamber.name}`);
                
                let getCountRequest =  pool.request();
                getCountRequest.input('Name', uniqueChamber.name);

                logger.debug(`builder copyConfiguration spGetSalesAnalyticsAllChamberCountByName getCountRequest : ${getCountRequest}`);
			
                let chamberCount = await getCountRequest.execute('spGetSalesAnalyticsAllChamberCountByName');
                logger.debug(`executed procedure spGetSalesAnalyticsAllChamberCountByName chamberCount : ${JSON.stringify(chamberCount)}`);

                uniqueChamber.count = chamberCount.recordset[0].SUM;
				
				let getCodeRequest= pool.request();
				getCodeRequest.input('Name',uniqueChamber.name);
				
				let chamberCode = await getCodeRequest.execute('spGetSalesAnalyticsFindChamberGotCodes');
				
                logger.debug(`executed procedure spGetSalesAnalyticsFindChamberGotCodes chamberCount : ${JSON.stringify(chamberCode)}`);
				let chamberGotCde = chamberCode.recordset.map(record => record.gotCode);
				
				logger.debug(`chamberGotCde : ${JSON.stringify(chamberGotCde)}`);
				if(chamberGotCde.length > 0 ){
				uniqueChamber.gotCode = chamberGotCde[0];
				}
				else{
					uniqueChamber.gotCode= '';

 				   }
				 		 
                
               
                }

                allUniqueChambers.sort(function(a,b)
			     {
			      return  b.count-a.count
                 })
                 
                
               
                if(minValue==0){

                     let value= minValue;                
                 
                 
                     let filterChamber= allUniqueChambers.filter(u=> u.count > minValue);
                     logger.debug(`FilterChamberRecords result : ${JSON.stringify(filterChamber)}`);
                 
                     let otherChambers= allUniqueChambers.filter(u=> u.count < minValue);
                     logger.debug(`FilterChamberRecords result : ${JSON.stringify(filterChamber)}`);
                 
                     const sum = otherChambers
                     .map(item => item.count)
                     .reduce((prev, curr) => prev + curr, 0);
                     logger.debug(`TotalRecords sum : ${JSON.stringify(sum)}`);                         
                             
                 
                     //filterChamber.push({name:'others',count:sum, gotCode: ""});
                                                  
                     let response = {items : filterChamber, others: otherChambers};
     
			
			        logger.trace(`will close sql connection`);
                    sql.close();
                    logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(response)}`);
                     res.status(200).json(response);	
                    }	

                else if(minValue!=0){

                     let givenValue= minValue;

                     let filterChambers= allUniqueChambers.filter(u=> u.count > givenValue);
                     logger.debug(`FilterChamberRecords result : ${JSON.stringify(filterChambers)}`);
                 
                     let otherChamber= allUniqueChambers.filter(u=> u.count < givenValue);
                     logger.debug(`FilterChamberRecords result : ${JSON.stringify(otherChamber)}`);
                 
                     const sum = otherChamber
                     .map(item => item.count)
                     .reduce((prev, curr) => prev + curr, 0);
                     logger.debug(`TotalRecords sum : ${JSON.stringify(sum)}`);                         
                             
                 
                     filterChambers.push({name:'others',count:sum, gotCode :""});
                                                  
                      let response = {items : filterChambers, others: otherChamber};
     
			
			         logger.trace(`will close sql connection`);
                     sql.close();
                     logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(response)}`);
                     res.status(200).json(response);	

                    }
			

                    
			
			
			}
			
			
			
			else{
				

				if(chamberNames.length!=0 && customerNames.length==0)
				{
			      const chamberNewListTvp = new sql.Table();
                  chamberNewListTvp.columns.add('name', sql.VarChar);
                  for(i=0; i<chamberNames.length; i++)
                   {
                   chamberNewListTvp.rows.add(chamberNames[i]); 
                   }
				   
				   
				    const request =  pool.request();
                    request.input('SelectedChamberNamesList', chamberNewListTvp);
					
					 let result = await request.execute('spGetSalesAnalyticsChamberNameWithoutCustomer');
					 
					 logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
			
    
                     const chamberListRetrieved = result.recordset;
					 
					 for (var chmbr of chamberListRetrieved) {

						logger.debug(`salesAnalytics spGetSalesAnalyticsToDisplayChamberName uniqueChamber name : ${chmbr.name}`);
						
						let getCountRequest =  pool.request();
						getCountRequest.input('Name', chmbr.name);

						logger.debug(`builder copyConfiguration spGetSalesAnalyticsAllChamberCountByName getCountRequest : ${getCountRequest}`);
					
						let chamberCount = await getCountRequest.execute('spGetSalesAnalyticsAllChamberCountByName');
						logger.debug(`executed procedure spGetSalesAnalyticsAllChamberCountByName chamberCount : ${JSON.stringify(chamberCount)}`);

						chmbr.count = chamberCount.recordset[0].SUM;
						
						let gotCode= await getCountRequest.execute('spGetSalesAnalyticsFindChamberGotCodes');

                        let chambGotCode = gotCode.recordset.map(record => record.gotCode);
				
				        logger.debug(`chambGotCode : ${JSON.stringify(chambGotCode)}`);
                
                        if(chambGotCode.length > 0 ) {

                           chmbr.gotCode = chambGotCode[0];
                
                        }

                        else {

                          chmbr.gotCode = ""

                        }                      
 
					}
               
			         chamberListRetrieved.sort(function(a,b)
					  {
					   return  b.count-a.count
					   })
					   					   
					 let response = {items:chamberListRetrieved};
					 
            
					 logger.trace(`will close sql connection`);
					 sql.close();
					 logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(response)}`);
					 res.status(200).json(response);
					
                }

                
				else 
			    {
					if(chamberNames.length!=0 && customerNames.length!=0){
         
					const chamberNamesTvp = new sql.Table();
					chamberNamesTvp.columns.add('name', sql.VarChar);
					 for(i=0; i<chamberNames.length; i++)
					 {
						chamberNamesTvp.rows.add(chamberNames[i]); 
					 }

					const customerNamesTvp = new sql.Table();
					customerNamesTvp.columns.add('name', sql.VarChar);
					for(i=0; i<customerNames.length; i++)
					  {
						  customerNamesTvp.rows.add(customerNames[i]); 
					  }

					const request1 =  pool.request();
					request1.input('SelectedChamberNamesList', chamberNamesTvp);
					logger.debug(`executed procedure result : ${JSON.stringify(chamberNamesTvp)}`);
					request1.input('SelectedCustomerNameList', customerNamesTvp);
					
					logger.debug(`executed procedure result : ${JSON.stringify(customerNamesTvp)}`);

					let result = await request1.execute('spGetSalesAnalyticsToDisplayChamberName');
					logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
					
			
					const chamberData = result.recordset;
						
			
					for (var chmbr of chamberData) {

						logger.debug(`salesAnalytics spGetSalesAnalyticsToDisplayChamberName uniqueChamber name : ${chamberData[0].name}`);
						
						let getCountRequest =  pool.request();
						getCountRequest.input('Name', chmbr.name);
						getCountRequest.input('SelectedCustomerName', customerNamesTvp);

						logger.debug(` spGetSalesAnalyticsChamberCountByCustomerList getCountRequest : ${getCountRequest}`);
					
						let chamberCount = await getCountRequest.execute('spGetSalesAnalyticsChamberCountByCustomerList');
						logger.debug(`executed procedure spGetSalesAnalyticsChamberCountByCustomerList chamberCount : ${JSON.stringify(chamberCount)}`);

						chmbr.count = chamberCount.recordset[0].SUM;
						
						let req  = pool.request();
                        req.input('Name', chmbr.name);

                        let gotCodeInfo = await req.execute('spGetSalesAnalyticsFindChamberGotCodes');

                        let gotCodes = gotCodeInfo.recordset.map(record => record.gotCode);
				
				        logger.debug(`gotCodes : ${JSON.stringify(gotCodes)}`);
                
                        if(gotCodes.length > 0 ) {

                         chmbr.gotCode = gotCodes[0];
                
                        }

                       else{

                        chmbr.gotCode = "";

                       }                
						
					}
               
					let response = {items:chamberData};
					chamberData.sort(function(a,b)
					{
					return  b.count-a.count
					})
					
					logger.trace(`will close sql connection`);
					sql.close();
					logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(response)}`);
					res.status(200).json(response);
                    }
                    
                    else{

                        if(chamberNames.length==0 && customerNames.length!=0){
                                    
                            const customerNamTvp = new sql.Table();
                            customerNamTvp.columns.add('name', sql.VarChar);
                            for(i=0; i<customerNames.length; i++)
                              {
                                  customerNamTvp.rows.add(customerNames[i]); 
                              }
        
                            const request1 =  pool.request();
                            
                            request1.input('SelectedCustomerName', customerNamTvp);
                            
                            logger.debug(`executed procedure result : ${JSON.stringify(customerNamTvp)}`);
        
                            let result = await request1.execute('spGetSalesAnalyticsAllChamberNamesWithCustomerName');
                            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
                            
                    
                            const chamberDatas = result.recordset;
                                
                    
                            for (var chmbrdata of chamberDatas) {
        
                                logger.debug(`salesAnalytics spGetSalesAnalyticsToDisplayChamberName uniqueChamber name : ${chamberDatas[0].name}`);
                                
                                let getCountRequest =  pool.request();
                                getCountRequest.input('Name', chmbrdata.name);
                                getCountRequest.input('SelectedCustomerName', customerNamTvp);
        
                                logger.debug(` spGetSalesAnalyticsChamberCountByCustomerList getCountRequest : ${getCountRequest}`);
                            
                                let chamberCount = await getCountRequest.execute('spGetSalesAnalyticsChamberCountByCustomerList');
                                logger.debug(`executed procedure spGetSalesAnalyticsChamberCountByCustomerList chamberCount : ${JSON.stringify(chamberCount)}`);
        
                                chmbrdata.count = chamberCount.recordset[0].SUM;
                            }
                       
                            let response = {items:chamberDatas};
                            chamberDatas.sort(function(a,b)
                            {
                            return  b.count-a.count
                            })
                            
                            logger.trace(`will close sql connection`);
                            sql.close();
                            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(response)}`);
                            res.status(200).json(response);
                            }

                        }
                    }                  
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
	
	getSalesAnalyticsCustomerFlowCustomer : async(req, res, next) =>{

        logger.debug('Controller method chambers -> getSalesAnalyticsCustomerFlowCustomer');

        try {
            
            const customerNames = req.value.body.customerName;
            const chamberNames = req.value.body.chamberName;
			const mValue = req.value.body.value;

            logger.debug(`request body : ${JSON.stringify(req.value.body)}`);

            
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);

            if(chamberNames.length==0 && customerNames.length==0){

            let request =  pool.request();

            logger.debug(`will execute stored procedure spGetSalesAnalyticsAllCustomers`);
        
            let result = await request.execute('spGetSalesAnalyticsAllCustomers');
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
    
            const allUniqueCustomers = result.recordset;
            logger.debug(`executed procedure spGetSalesAnalyticsAllCustomers allUniqueCustomers : ${JSON.stringify(allUniqueCustomers)}`);
			
			for (var uniqueCustomer of allUniqueCustomers) {

                logger.debug(`salesAnalytics spGetSalesAnalyticsAllCustomers uniqueCustomer name : ${allUniqueCustomers[0].customer_name}`);
                
                let getCountRequest =  pool.request();
                getCountRequest.input('CustomerName', uniqueCustomer.customer_name);

                logger.debug(`builder copyConfiguration spGetSalesAnalyticsCustomerFlowChambersCount getCountRequest : ${getCountRequest}`);
			
                let customerCount = await getCountRequest.execute('spGetSalesAnalyticsCustomerFlowChambersCount');
                logger.debug(`executed procedure spGetSalesAnalyticsCustomerFlowChambersCount customerCount : ${JSON.stringify(customerCount)}`);

                uniqueCustomer.count = customerCount.recordset[0].SUM;
            }

            let response = allUniqueCustomers;
			allUniqueCustomers.sort(function(a,b)
            {
                return b.count-a.count
            })
			
			
            
            if(mValue==0){                 
            
            
                let filterChamb= allUniqueCustomers.filter(u=> u.count > mValue);
                logger.debug(`FilterChamberRecords result : ${JSON.stringify(filterChamb)}`);
            
                let otherChamb= allUniqueCustomers.filter(u=> u.count < mValue);
                logger.debug(`FilterChamberRecords result : ${JSON.stringify(filterChamb)}`);
            
                const sum = otherChamb
                .map(item => item.count)
                .reduce((prev, curr) => prev + curr, 0);
                logger.debug(`TotalRecords sum : ${JSON.stringify(sum)}`);                         
                        
            
                //filterChamb.push({customer_name:'others',count:sum});
                                             
                let response = {items : filterChamb, others: otherChamb};

       
               logger.trace(`will close sql connection`);
               sql.close();
               logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(response)}`);
                res.status(200).json(response);	
               }	
           else if(mValue!=0){
               let checkValue= mValue;

                let filterChambrs= allUniqueCustomers.filter(u=> u.count > checkValue);
                logger.debug(`FilterChamberRecords result : ${JSON.stringify(filterChambrs)}`);
            
                let otherChambr= allUniqueCustomers.filter(u=> u.count < checkValue);
                logger.debug(`FilterChamberRecords result : ${JSON.stringify(otherChambr)}`);
            
                const sum = otherChambr
                .map(item => item.count)
                .reduce((prev, curr) => prev + curr, 0);
                logger.debug(`TotalRecords sum : ${JSON.stringify(sum)}`);                         
                        
            
                filterChambrs.push({customer_name:'others',count:sum});
                                             
                let response = {items : filterChambrs, others: otherChambr};

       
                logger.trace(`will close sql connection`);
                sql.close();
                logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(response)}`);
                res.status(200).json(response);	

            }
            
            
            }
            else{
				
				if(customerNames.length!=0 && chamberNames.length==0)
				{

                const customerNamesTvp = new sql.Table();
                customerNamesTvp.columns.add('name', sql.VarChar);
                for(i=0;i<customerNames.length;i++)
                {
                    customerNamesTvp.rows.add(customerNames[i]); 
                }

                    
                const request1 =  pool.request();
                request1.input('SelectedCustomerNameList', customerNamesTvp);
                logger.debug(`executed procedure result : ${JSON.stringify(customerNamesTvp)}`);
               
               
    
                let result = await request1.execute('spGetSalesAnalyticsToDisplayCustomerName');
                logger.debug(`executed procedure result : ${JSON.stringify(result)}`);


                const allCustomersList = result.recordset;
                logger.debug(`executed procedure spGetSalesAnalyticsToDisplayCustomerName allCustomersList : ${JSON.stringify(allCustomersList)}`);
			
			  for (var customerList of allCustomersList) {

                logger.debug(`salesAnalytics spGetSalesAnalyticsToDisplayCustomerName uniqueCustomer name : ${allCustomersList[0].customer_name}`);
                
                let getCountRequest =  pool.request();
                getCountRequest.input('CustomerName', customerList.customer_name);

                logger.debug(`builder copyConfiguration spGetSalesAnalyticsCustomerFlowChambersCount getCountRequest : ${getCountRequest}`);
			
                let customerCount = await getCountRequest.execute('spGetSalesAnalyticsCustomerFlowChambersCount');
                logger.debug(`executed procedure spGetSalesAnalyticsCustomerFlowChambersCount customerCount : ${JSON.stringify(customerCount)}`);

                customerList.count = customerCount.recordset[0].SUM;
			  }
            

            let response = {items : allCustomersList};
			allCustomersList.sort(function(a,b)
            {
                return b.count-a.count
            })

            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(response)}`);
            res.status(200).json(response);
                
             }
			 
			 else
			 {
				 if(customerNames.length!=0 & chamberNames.length!=0)
				 {			 
				 
				 
				const customerNamesTvp = new sql.Table();
                customerNamesTvp.columns.add('name', sql.VarChar);
                for(i=0;i<customerNames.length;i++)
                {
                    customerNamesTvp.rows.add(customerNames[i]); 
                }

                const chamberNamesTvp = new sql.Table();
                chamberNamesTvp.columns.add('name', sql.VarChar);
                for(i=0;i<chamberNames.length;i++)
                {
                    chamberNamesTvp.rows.add(chamberNames[i]); 
                }
                  
    
                const request1 =  pool.request();
                request1.input('SelectedCustomerNameList', customerNamesTvp);
                logger.debug(`executed procedure result : ${JSON.stringify(customerNamesTvp)}`);
                request1.input('SelectedChamberNamesList', chamberNamesTvp);
                logger.debug(`executed procedure result : ${JSON.stringify(chamberNamesTvp)}`);
               
    
                let result = await request1.execute('spGetSalesAnalyticsCustomerNameByCustomerFlow');
                logger.debug(`executed procedure result : ${JSON.stringify(result)}`);


                const allCustomersData = result.recordset;
                logger.debug(`executed procedure spGetSalesAnalyticsCustomerNameByChamber allCustomersData : ${JSON.stringify(allCustomersData)}`);
			
			    for (var customerDatas of allCustomersData) {

                logger.debug(`salesAnalytics spGetSalesAnalyticsCustomerNameByChamber customerDatas name : ${allCustomersData[0].customer_name}`);
                
                let getCountRequest =  pool.request();
                getCountRequest.input('CustomerName', customerDatas.customer_name);
				getCountRequest.input('SelectedChamberNames',chamberNamesTvp);

                logger.debug(`builder copyConfiguration spGetSalesAnalyticsCustomerFlowChamberCountWithAllFilter getCountRequest : ${getCountRequest}`);
			
                let customerCount = await getCountRequest.execute('spGetSalesAnalyticsCustomerFlowChamberCountWithAllFilter');
                logger.debug(`executed procedure spGetSalesAnalyticsCustomerFlowChamberCountWithAllFilter customerCount : ${JSON.stringify(customerCount)}`);

                customerDatas.count = customerCount.recordset[0].SUM;
            }

            let response = {items: allCustomersData};
			allCustomersData.sort(function(a,b)
            {
                return b.count-a.count
            })

            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(response)}`);
            res.status(200).json(response);
                 }


            else
                {

                if(customerNames.length==0 & chamberNames.length!=0)
                 { 
                                
  
                    const chamberNamesTvp = new sql.Table();
                    chamberNamesTvp.columns.add('name', sql.VarChar);
                    for(i=0;i<chamberNames.length;i++)
                    {
                        chamberNamesTvp.rows.add(chamberNames[i]); 
                    }
                      
        
                    const request1 =  pool.request();
                  
                    request1.input('SelectedChamberNamesList', chamberNamesTvp);
                    logger.debug(`executed procedure result : ${JSON.stringify(chamberNamesTvp)}`);
                   
        
                    let result = await request1.execute('spGetSalesAnalyticsCustomerNameByChamberName');
                    logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
    
    
                    const allCustomerRecord = result.recordset;
                    logger.debug(`executed procedure spGetSalesAnalyticsCustomerNameByChamberName allCustomerRecord : ${JSON.stringify(allCustomerRecord)}`);
                
                    for (var customr of allCustomerRecord) {
    
                    logger.debug(`salesAnalytics spGetSalesAnalyticsCustomerNameByChamber customerDatas name : ${allCustomerRecord[0].customer_name}`);
                    
                    let getCountRequest =  pool.request();
                    getCountRequest.input('CustomerName', customr.customer_name);
    
                    logger.debug(`builder copyConfiguration spGetSalesAnalyticsCustomerCount getCountRequest : ${getCountRequest}`);
                
                    let customerCount = await getCountRequest.execute('spGetSalesAnalyticsCustomerCount');
                    logger.debug(`executed procedure spGetSalesAnalyticsCustomerCount customerCount : ${JSON.stringify(customerCount)}`);
    
                    customr.count = customerCount.recordset[0].SUM;
                    }
    
                   let response = {items: allCustomerRecord};
                   allCustomerRecord.sort(function(a,b)
                   {
                    return b.count-a.count
                   })
    
                   logger.trace(`will close sql connection`);
                   sql.close();
                   logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(response)}`);
                   res.status(200).json(response);
                     }
                     
                    }
                              
                }
			 
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
	
	getAllSalesAnalyticsCustomersByChamber : async(req, res, next) =>{

        logger.debug('Controller method chambers -> getAllSalesAnalyticsCustomersByChamber');

        try {
			
            const chamberName = req.query['ChamberName'];
            const customerNames = req.value.body.customerName;
			const mValue= req.value.body.value
			
            logger.debug(`request body : ${JSON.stringify(req.value.body)}`);

            
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);

            if(customerNames.length==0){
            let request =  pool.request();

            logger.debug(`will execute stored procedure spGetSalesAnalyticsAllCustomers`);

            let result = await request.execute('spGetSalesAnalyticsAllCustomers');
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
    
            const allUniqueCustomers = result.recordset;
            logger.debug(`executed procedure spGetSalesAnalyticsAllCustomers allUniqueCustomers : ${JSON.stringify(allUniqueCustomers)}`);
			
			for (var uniqueCustomer of allUniqueCustomers) {

                logger.debug(`salesAnalytics getSaleAnalyticsForAllCustomersByChamber uniqueCustomer name : ${uniqueCustomer.customer_name}`);
                
                let getCountRequest =  pool.request();
                getCountRequest.input('CustomerName', uniqueCustomer.customer_name);
				getCountRequest.input('ChamberName', chamberName);
               

                logger.debug(`builder copyConfiguration spGetSalesAnalyticsChamberCountByCustomer getCountRequest : ${getCountRequest}`);
			
                let customerCount = await getCountRequest.execute('spGetSalesAnalyticsChamberCountByCustomer');
                logger.debug(`executed procedure spGetSalesAnalyticsChamberCountByCustomer customerCount : ${JSON.stringify(customerCount)}`);

                uniqueCustomer.count = customerCount.recordset[0].SUM;
            }

            let response = allUniqueCustomers;
			allUniqueCustomers.sort(function(a,b)
            {
                return b.count-a.count
            })
			
			 
			if(mValue == 0){

               let filterChambrs= allUniqueCustomers.filter(u=> u.count > mValue);
               logger.debug(`FilterChamberRecords result : ${JSON.stringify(filterChambrs)}`);
            
                let otherChambr= allUniqueCustomers.filter(u=> u.count < mValue);
                logger.debug(`FilterChamberRecords result : ${JSON.stringify(otherChambr)}`);
            
                const sum = otherChambr
                .map(item => item.count)
                .reduce((prev, curr) => prev + curr, 0);
                logger.debug(`TotalRecords sum : ${JSON.stringify(sum)}`);                         
                        
            
                //filterChambrs.push({customer_name:'others',count:sum});
                                             
                let response1 = {items : filterChambrs, others: otherChambr};

       
                logger.trace(`will close sql connection`);
                sql.close();
                logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(response)}`);
                res.status(200).json(response1);
			}

             else {
				 
			   let filterChambrs= allUniqueCustomers.filter(u=> u.count > mValue);
               logger.debug(`FilterChamberRecords result : ${JSON.stringify(filterChambrs)}`);
            
                let otherChambr= allUniqueCustomers.filter(u=> u.count < mValue);
                logger.debug(`FilterChamberRecords result : ${JSON.stringify(otherChambr)}`);
            
                const sum = otherChambr
                .map(item => item.count)
                .reduce((prev, curr) => prev + curr, 0);
                logger.debug(`TotalRecords sum : ${JSON.stringify(sum)}`);                         
                        
            
                filterChambrs.push({customer_name:'others',count:sum});
                                             
                let response1 = {items : filterChambrs, others: otherChambr};

       
                logger.trace(`will close sql connection`);
                sql.close();
                logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(response)}`);
                res.status(200).json(response1);

             }					
					
            
			 
            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(response)}`);
            res.status(200).json(response);
        }
		else{
			
			const chamberName = req.query['ChamberName'];
            const customerNames = req.value.body.customerName;
            logger.debug(`request body : ${JSON.stringify(req.value.body)}`);

            
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
			
			const customerNameTvp = new sql.Table();
                customerNameTvp.columns.add('name', sql.VarChar);
                for(i=0;i<customerNames.length;i++)
                {
                    customerNameTvp.rows.add(customerNames[i]); 
                }


          
            let request =  pool.request();
			
            request.input('SelectedCustomerName', customerNameTvp);

            logger.debug(`will execute stored procedure spGetSalesAnalyticsRequiredCustomers`);

            let result = await request.execute('spGetSalesAnalyticsRequiredCustomers');
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
    
            const allCustomers = result.recordset;
            logger.debug(`executed procedure spGetSalesAnalyticsRequiredCustomers allCustomers : ${JSON.stringify(allCustomers)}`);
			
			for (var customer of allCustomers) {

                logger.debug(`salesAnalytics getSaleAnalyticsForAllCustomersByChamber uniqueCustomer name : ${customer.customer_name}`);
                
                let getCountRequest =  pool.request();
                getCountRequest.input('CustomerName', customer.customer_name);
				getCountRequest.input('ChamberName', chamberName);
               

                logger.debug(`builder copyConfiguration spGetSalesAnalyticsChamberCountByCustomer getCountRequest : ${getCountRequest}`);
			
                let customerCount = await getCountRequest.execute('spGetSalesAnalyticsChamberCountByCustomer');
                logger.debug(`executed procedure spGetSalesAnalyticsChamberCountByCustomer customerCount : ${JSON.stringify(customerCount)}`);

               customer.count = customerCount.recordset[0].SUM;
            }

			let response = {items: allCustomers};
			
			allCustomers.sort(function(a,b)
            {
                return b.count-a.count
            })
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
	
	
	getAllSalesAnalyticsFabByChamber: async(req, res, next) =>{

        logger.debug('Controller method chambers -> getAllSalesAnalyticsFabByChamber');

        try {

            const chamberName = req.query['ChamberName'];
            const customerName = req.query['CustomerName'];
			const fabNames = req.value.body.fabName;
            logger.trace(`builder getSaleAnalyticsForAllFabsByChamber chamberName: ${JSON.stringify(chamberName)}`);
            logger.trace(`builder getSaleAnalyticsForAllFabsByChamber customerName: ${JSON.stringify(customerName)}`);
			
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            if(fabNames.length==0){
            
			  let request =  pool.request();

              logger.debug(`will execute stored procedure spGetSalesAnalyticsAllFabsByCustomer`);
              
			  request.input('CustomerName', customerName);

            let result = await request.execute('spGetSalesAnalyticsAllFabsByCustomer');
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
    
            const allUniqueFabs = result.recordset;
            logger.debug(`executed procedure spGetSalesAnalyticsAllFabsByCustomer allUniqueFabs : ${JSON.stringify(allUniqueFabs)}`);
			
			for (var uniqueFab of allUniqueFabs) {

                logger.debug(`salesAnalytics getSaleAnalyticsForAllCustomersByChamber uniqueFab name : ${uniqueFab.name}`);
                
                let getCountRequest =  pool.request();
                getCountRequest.input('FabName', uniqueFab.FabName);
                getCountRequest.input('ChamberName', chamberName);
                getCountRequest.input('CustomerName', customerName);

                logger.debug(`builder copyConfiguration spGetSalesAnalyticsChamberCountByFab getCountRequest : ${getCountRequest}`);
			
                let chamberCount = await getCountRequest.execute('spGetSalesAnalyticsChamberCountByFab');
                logger.debug(`executed procedure spGetSalesAnalyticsChamberCountByFab chamberCount : ${JSON.stringify(chamberCount)}`);

                uniqueFab.count = chamberCount.recordset[0].SUM;
            }

            let response = allUniqueFabs;
			allUniqueFabs.sort(function(a,b)
            {
                return b.count-a.count
            })
            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(response)}`);
            res.status(200).json(response);
        }
		
		else{
			
			const chamberName = req.query['ChamberName'];
            const customerName = req.query['CustomerName'];
			const fabNames = req.value.body.fabName;
            logger.trace(`builder getSaleAnalyticsForAllFabsByChamber chamberName: ${JSON.stringify(chamberName)}`);
            logger.trace(`builder getSaleAnalyticsForAllFabsByChamber customerName: ${JSON.stringify(customerName)}`);
			
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
			
			const fabNameTvp = new sql.Table();
                fabNameTvp.columns.add('name', sql.VarChar);
                for(i=0;i<fabNames.length;i++)
                {
                    fabNameTvp.rows.add(fabNames[i]); 
                }


          
            let request =  pool.request();
			
            request.input('SelectedFabName', fabNameTvp);

            logger.debug(`will execute stored procedure spGetSalesAnalyticsSelectedFabs`);

            let result = await request.execute('spGetSalesAnalyticsSelectedFabs');
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
			
			const selectedFabs = result.recordset;
			
			for (var selectFab of selectedFabs) {

                logger.debug(`salesAnalytics getSaleAnalyticsForAllCustomersByChamber selectFab name : ${selectFab.name}`);
                
                let getCountRequest =  pool.request();
                getCountRequest.input('FabName', selectFab.FabName);
                getCountRequest.input('ChamberName', chamberName);
                getCountRequest.input('CustomerName', customerName);

                logger.debug(`builder copyConfiguration spGetSalesAnalyticsChamberCountByFab getCountRequest : ${getCountRequest}`);
			
                let chamberCount = await getCountRequest.execute('spGetSalesAnalyticsChamberCountByFab');
                logger.debug(`executed procedure spGetSalesAnalyticsChamberCountByFab chamberCount : ${JSON.stringify(chamberCount)}`);

                selectFab.count = chamberCount.recordset[0].SUM;
            }

            let response = selectedFabs;
			selectedFabs.sort(function(a,b)
            {
                return b.count-a.count
            })
			
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
	
	
	getAllSalesAnalyticsFabByCustomers : async(req, res, next) =>{

        logger.debug('Controller method chambers -> getAllSalesAnalyticsFabByCustomers');

        try {
            
            const customerName = req.query['CustomerName'];
			const fabNames = req.value.body.fabName;
			
			           
            logger.trace(`builder getSaleAnalyticsFabDataForCustomers customerName: ${JSON.stringify(customerName)}`);
			
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
			
			if(fabNames.length==0){
            let request =  pool.request();

            logger.debug(`will execute stored procedure spGetSalesAnalyticsAllCustomers`);
            request.input('CustomerName', customerName);

            let result = await request.execute('spGetSalesAnalyticsAllFabsByCustomer');
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
    
            const allUniqueFabs = result.recordset;
            logger.debug(`executed procedure spGetSalesAnalyticsFabCount allUniqueFabs : ${JSON.stringify(allUniqueFabs)}`);
			
			for (var uniqueFab of allUniqueFabs) {

                logger.debug(`salesAnalytics spGetSalesAnalyticsAllCustomers uniqueFab name : ${uniqueFab.name}`);
                
                let getCountRequest =  pool.request();
                getCountRequest.input('FabName', uniqueFab.FabName);               
                getCountRequest.input('CustomerName', customerName);

                logger.debug(`builder copyConfiguration spGetSalesAnalyticsFabCount getCountRequest : ${getCountRequest}`);
			
                let fabCount = await getCountRequest.execute('spGetSalesAnalyticsFabCount');
                logger.debug(`executed procedure spGetSalesAnalyticsFabCount chamberCount : ${JSON.stringify(fabCount)}`);

                uniqueFab.count = fabCount.recordset[0].SUM;
            }

            let response = allUniqueFabs;
			allUniqueFabs.sort(function(a,b)
            {
                return b.count-a.count
            })
						
            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(response)}`);
            res.status(200).json(response);
			}
			
			else {				
		  
            const customerName = req.query['CustomerName'];
			const fabNames = req.value.body.fabName;
           
            logger.trace(`builder getSaleAnalyticsForAllFabsByChamber customerName: ${JSON.stringify(customerName)}`);
			
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
			
			const fabNameTvp = new sql.Table();
                fabNameTvp.columns.add('name', sql.VarChar);
                for(i=0;i<fabNames.length;i++)
                {
                    fabNameTvp.rows.add(fabNames[i]); 
                }


          
            let request =  pool.request();
			
            request.input('SelectedFabName', fabNameTvp);

            logger.debug(`will execute stored procedure spGetSalesAnalyticsSelectedFabs`);

            let result = await request.execute('spGetSalesAnalyticsSelectedFabs');
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
			
			
			const allUniqueFabs = result.recordset;
            logger.debug(`executed procedure spGetSalesAnalyticsFabCount allUniqueFabs : ${JSON.stringify(allUniqueFabs)}`);
			
			for (var uniqueFab of allUniqueFabs) {

                logger.debug(`salesAnalytics spGetSalesAnalyticsAllCustomers uniqueFab name : ${uniqueFab.name}`);
                
                let getCountRequest =  pool.request();
                getCountRequest.input('FabName', uniqueFab.FabName);               
                getCountRequest.input('CustomerName', customerName);

                logger.debug(`builder copyConfiguration spGetSalesAnalyticsFabCount getCountRequest : ${getCountRequest}`);
			
                let fabCount = await getCountRequest.execute('spGetSalesAnalyticsFabCount');
                logger.debug(`executed procedure spGetSalesAnalyticsFabCount chamberCount : ${JSON.stringify(fabCount)}`);

                uniqueFab.count = fabCount.recordset[0].SUM;
            }

            let response = allUniqueFabs;
			allUniqueFabs.sort(function(a,b)
            {
                return b.count-a.count
            })
						
			
            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(response)}`);
            res.status(200).json(response);
						
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
	
	
	getAllSalesAnalyticsChambersByFabForCustomers  : async(req, res, next) =>{

        logger.debug('Controller method chambers -> getSaleAnalyticsChambersByFabForCustomer');

        try {
            
            const customerName = req.query['CustomerName'];
			const fabName = req.query['FabName'];
			const chamberNames = req.value.body.chamberName;
			const mValue = req.value.body.value;
            
            logger.trace(`builder getSaleAnalyticsChambersByFabForCustomer customerName: ${JSON.stringify(customerName)}`);
			logger.trace(`builder getSaleAnalyticsChambersByFabForCustomer fabName: ${JSON.stringify(fabName)}`);
			
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
			
			if(chamberNames.length==0){
            let request =  pool.request();

            logger.debug(`will execute stored procedure spGetSalesAnalyticsChamberNamesByFab`);
            request.input('CustomerName', customerName);
			request.input('FabName', fabName);

            let result = await request.execute('spGetSalesAnalyticsChamberNamesByFab');
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
    
            const allUniqueChambers = result.recordset;
            logger.debug(`executed procedure spGetSalesAnalyticsChamberNamesByFab allUniqueChambers : ${JSON.stringify(allUniqueChambers)}`);
			
			for (var uniqueChamber of allUniqueChambers) {

                logger.debug(`salesAnalytics spGetSalesAnalyticsChamberNamesByFab uniqueChamber name : ${uniqueChamber.name}`);
                
                let getCountRequest =  pool.request();
                getCountRequest.input('ChamberName', uniqueChamber.name);               
                getCountRequest.input('CustomerName', customerName);
				getCountRequest.input('FabName',fabName);

                logger.debug(`builder copyConfiguration spGetSalesAnalyticsChamberCountByFab getCountRequest : ${getCountRequest}`);
			
                let chamberCount = await getCountRequest.execute('spGetSalesAnalyticsChamberCountByFab');
                logger.debug(`executed procedure spGetSalesAnalyticsChamberCountByFab chamberCount : ${JSON.stringify(chamberCount)}`);

                uniqueChamber.count = chamberCount.recordset[0].SUM;
				
				let getCountRequest1= pool.request();
				getCountRequest1.input('Name',uniqueChamber.name);
				
				let chambergotCode = await getCountRequest1.execute('spGetSalesAnalyticsFindChamberGotCodes');
				
                logger.debug(`executed procedure spGetSalesAnalyticsFindChamberGotCodes chamberCount : ${JSON.stringify(chambergotCode)}`);
				let chamberGtCde = chambergotCode.recordset.map(record => record.gotCode);
				
				logger.debug(`chamberGtCde : ${JSON.stringify(chamberGtCde)}`);
				if(chamberGtCde.length > 0 ){
				uniqueChamber.gotCode = chamberGtCde[0];
				}
				else{
					uniqueChamber.gotCode= '';

 				}			 
				 
            }
			

            let response = allUniqueChambers;
			allUniqueChambers.sort(function(a,b)
            {
                return b.count-a.count
            })
			
			
			
			if(mValue == 0){

               let filterChambrs= allUniqueChambers.filter(u=> u.count > mValue);
               logger.debug(`FilterChamberRecords result : ${JSON.stringify(filterChambrs)}`);
            
                let otherChambr= allUniqueChambers.filter(u=> u.count < mValue);
                logger.debug(`FilterChamberRecords result : ${JSON.stringify(otherChambr)}`);
            
                const sum = otherChambr
                .map(item => item.count)
                .reduce((prev, curr) => prev + curr, 0);
                logger.debug(`TotalRecords sum : ${JSON.stringify(sum)}`);                         
                        
            
                //filterChambrs.push({customer_name:'others',count:sum});
                                             
                let response1 = {items : filterChambrs, others: otherChambr};

       
                logger.trace(`will close sql connection`);
                sql.close();
                logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(response)}`);
                res.status(200).json(response1);
			}

             else {
				 
			   let filterChambrs= allUniqueChambers.filter(u=> u.count > mValue);
               logger.debug(`FilterChamberRecords result : ${JSON.stringify(filterChambrs)}`);
            
                let otherChambr= allUniqueChambers.filter(u=> u.count < mValue);
                logger.debug(`FilterChamberRecords result : ${JSON.stringify(otherChambr)}`);
            
                const sum = otherChambr
                .map(item => item.count)
                .reduce((prev, curr) => prev + curr, 0);
                logger.debug(`TotalRecords sum : ${JSON.stringify(sum)}`);                         
                        
            
                filterChambrs.push({name:'others',count:sum});
                                             
                let response1 = {items : filterChambrs, others: otherChambr};

       
                logger.trace(`will close sql connection`);
                sql.close();
                logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(response)}`);
                res.status(200).json(response1);

             }				
			
			           
         }
		 
		 else{
				
            const chamberNames= req.value.body.chamberName;
            				
           
            logger.trace(`builder getAllSalesAnalyticsChambersByFabForCustomers chamberNames: ${JSON.stringify(chamberNames)}`);
			
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
			
			const chamberNamesTvp = new sql.Table();
                chamberNamesTvp.columns.add('name', sql.VarChar);
                for(i=0;i<chamberNames.length;i++)
                {
                    chamberNamesTvp.rows.add(chamberNames[i]); 
                }


          
            let request =  pool.request();
			
            request.input('SelectedChamberName', chamberNamesTvp);

            logger.debug(`will execute stored procedure spGetSalesAnalyticsSelectedChambers`);
			let result = await request.execute('spGetSalesAnalyticsSelectedChambers');
			
			const chamberRecord = result.recordset;
			
			
			
			for (var chambs of chamberRecord) {

                logger.debug(`salesAnalytics spGetSalesAnalyticsToDisplayChamberName uniqueChamber name : ${chamberRecord[0].name}`);
                
                let getCountRequest =  pool.request();
             

                getCountRequest.input('ChamberName', chambs.name);               
                getCountRequest.input('CustomerName', customerName);
				getCountRequest.input('FabName',fabName);

                logger.debug(`builder copyConfiguration spGetSalesAnalyticsChamberCountByFab getCountRequest : ${getCountRequest}`);
			
                let chamberCount = await getCountRequest.execute('spGetSalesAnalyticsChamberCountByFab');
                logger.debug(`executed procedure spGetSalesAnalyticsChamberCountByFab chamberCount : ${JSON.stringify(chamberCount)}`);
                chambs.count = chamberCount.recordset[0].SUM;
				
				
				let getRequest1= pool.request();
				getRequest1.input('Name',chambs.name);
				
				let chambrgotCd = await getRequest1.execute('spGetSalesAnalyticsFindChamberGotCodes');
				
                logger.debug(`executed procedure spGetSalesAnalyticsFindChamberGotCodes chamberCount : ${JSON.stringify(chambrgotCd)}`);
				let chambrGtCode = chambrgotCd.recordset.map(record => record.gotCode);
				
				logger.debug(`chambrGtCode : ${JSON.stringify(chambrGtCode)}`);
				if(chambrGtCode.length > 0 ){
				chambs.gotCode = chambrGtCode[0];
				}
				else{
					chambs.gotCode= '';

 				}			
            }
			
			
            let response = {items : chamberRecord};   
            
			chamberRecord.sort(function(a,b)
			{
			return  b.count-a.count
			})
            
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
	
	getAllSalesAnalyticsInExcel : async (req, res, next) =>{
        
        logger.debug(`Controller method explorermenunodes -> getAllSalesAnalyticsInExcel`);

        try {

            let format = 'json';
            if(req.query['format'] != undefined)
            {
                format = req.query['format'].toLowerCase();
            }

            
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            logger.debug(`will execute stored procedure spGetAllSalesAnalyticsData)}`);

            let result = await request.execute('spGetAllSalesAnalyticsData');
			
            const totalData = result.recordset;
			
			let response= totalData;
            
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
	
	getSalesAnalyticsChamberFlowInExcelOne : async (req, res, next) =>{
        
        logger.debug(`Controller method explorermenunodes -> getAllSalesAnalyticsInExcel`);

        try {
			
			const chamberNames = req.value.body.chamberName;
            const customerNames = req.value.body.customerName;

            logger.debug(`request body : ${JSON.stringify(req.value.body)}`);
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);           

            

            
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
			
			const chamberNmTvp = new sql.Table();
                chamberNmTvp.columns.add('name', sql.VarChar);
                for(i=0;i<chamberNames.length;i++)
                {
                    chamberNmTvp.rows.add(chamberNames[i]); 
                }

			
			
			const customerNmTvp = new sql.Table();
                customerNmTvp.columns.add('name', sql.VarChar);
                for(i=0;i<customerNames.length;i++)
                {
                    customerNmTvp.rows.add(customerNames[i]); 
                }
				
			

          
            let request =  pool.request();
			
			request.input('SelectedChamberName',chamberNmTvp);			
            request.input('SelectedCustomerName', customerNmTvp);
            

            logger.debug(`will execute stored procedure spGetSalesAnalyticsChamberFlowExcelOne)}`);

            let result = await request.execute('spGetSalesAnalyticsChamberFlowExcelOne');
			
            const resultData = result.recordset;
			
			let response= resultData;
            
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
	
	
	getSalesAnalyticsChamberFlowInExcelTwo : async (req, res, next) =>{
        
        logger.debug(`Controller method explorermenunodes -> getAllSalesAnalyticsInExcel`);

        try {
			
			const chamberNames = req.value.body.chamberName;
            const customerNames = req.value.body.customerName;

            logger.debug(`request body : ${JSON.stringify(req.value.body)}`);
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);           

            

            
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
			
			const chamberNmsTvp = new sql.Table();
                chamberNmsTvp.columns.add('name', sql.VarChar);
                for(i=0;i<chamberNames.length;i++)
                {
                    chamberNmsTvp.rows.add(chamberNames[i]); 
                }

			
			
			const customerNmsTvp = new sql.Table();
                customerNmsTvp.columns.add('name', sql.VarChar);
                for(i=0;i<customerNames.length;i++)
                {
                    customerNmsTvp.rows.add(customerNames[i]); 
                }
				
			

          
            let request =  pool.request();
			
			request.input('SelectedChamberNames',chamberNmsTvp);			
            request.input('SelectedCustomerNames', customerNmsTvp);
            

            logger.debug(`will execute stored procedure spGetSalesAnalyticsChamberFlowExcelTwo)}`);

            let result = await request.execute('spGetSalesAnalyticsChamberFlowExcelTwo');
			
            const resultData = result.recordset;
			
			let response= resultData;
            
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
	
	
	
	getAllSalesAnalyticsChamberFlowCustomerExcel : async(req, res, next) =>{

        logger.debug('Controller method chambers -> getAllSalesAnalyticsChamberFlowCustomerExcel');

        try {
			
            const chamberName = req.query['ChamberName'];
            
                      
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);

          
            let request =  pool.request();
			
			request.input('ChamberName',chamberName);

            logger.debug(`will execute stored procedure spGetAllSalesAnalyticsChamberFlowCustomerExcel`);

            let result = await request.execute('spGetAllSalesAnalyticsChamberFlowCustomerExcel');
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
    
            const fetchedCustomers = result.recordset;
            logger.debug(`executed procedure spGetAllSalesAnalyticsChamberFlowCustomerExcel fetchedCustomers : ${JSON.stringify(fetchedCustomers)}`);
			
		    let response= fetchedCustomers;
			
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
	
	
	getAllSalesAnalyticsChamberFlowFabAllExcel : async(req, res, next) =>{

        logger.debug('Controller method chambers -> getAllSalesAnalyticsChamberFlowFabAllExcel');

        try {
			
            const chamberName = req.query['ChamberName'];
			const customerName = req.query['CustomerName'];
            
                      
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
				

          
            let request =  pool.request();
			
			request.input('ChamberName',chamberName);
			request.input('CustomerName',customerName);

            logger.debug(`will execute stored procedure spGetAllSalesAnalyticsChamberFlowFabAllExcel`);

            let result = await request.execute('spGetAllSalesAnalyticsChamberFlowFabAllExcel');
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
    
            const reslt = result.recordset;
            logger.debug(`executed procedure spGetAllSalesAnalyticsChamberFlowCustomerExcel resultRecord : ${JSON.stringify(reslt)}`);
			
		    let response= reslt;
			
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
	
	
	getAllSalesAnalyticsChamberFlowFabFilterExcel : async(req, res, next) =>{

        logger.debug('Controller method chambers -> getAllSalesAnalyticsChamberFlowFabFilterExcel');

        try {
			
            const chamberName = req.query['ChamberName'];
			const customerName = req.query['CustomerName'];
			const fabNames = req.value.body.fabNames;
            
                      
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
			
		    const fabNamesTvp = new sql.Table();
                fabNamesTvp.columns.add('name', sql.VarChar);
                for(i=0;i<fabNames.length;i++)
                {
                    fabNamesTvp.rows.add(fabNames[i]); 
                }

          
            let request =  pool.request();
			
			request.input('ChamberName',chamberName);
			request.input('CustomerName',customerName);
			request.input('SelectedFabNames',fabNamesTvp);

            logger.debug(`will execute stored procedure spGetAllSalesAnalyticsChamberFlowFabFilterExcel`);

            let result = await request.execute('spGetAllSalesAnalyticsChamberFlowFabFilterExcel');
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
    
            const reslt = result.recordset;
            logger.debug(`executed procedure spGetAllSalesAnalyticsChamberFlowCustomerExcel resultRecord : ${JSON.stringify(reslt)}`);
			
		    let response= reslt;
			
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
	
	
	getAllSalesAnalyticsCustomerFlowFabAllExcel : async(req, res, next) =>{

        logger.debug('Controller method chambers -> getAllSalesAnalyticsCustomerFlowFabAllExcel');

        try {
			
   			const customerName = req.query['CustomerName'];
			            
                      
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
			
		             
            let request =  pool.request();
						
			request.input('CustomerName',customerName);			

            logger.debug(`will execute stored procedure spGetAllSalesAnalyticsCustomerFlowFabAllExcel`);

            let result = await request.execute('spGetAllSalesAnalyticsCustomerFlowFabAllExcel');
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
    
    
            const dataSet = result.recordset;
            logger.debug(`executed procedure spGetAllSalesAnalyticsChamberFlowCustomerExcel resultRecord : ${JSON.stringify(dataSet)}`);
			
		    let response= dataSet;
			
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
	
	getAllSalesAnalyticsCustomerFlowFabFilterExcel: async(req, res, next) =>{

        logger.debug('Controller method chambers -> getAllSalesAnalyticsCustomerFlowFabFilterExcel');

        try {
			
   			const customerName = req.query['CustomerName'];
			const fabNames = req.value.body.fabNames;
			            
                      
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
			
			const fabListTvp = new sql.Table();
                fabListTvp.columns.add('name', sql.VarChar);
                for(i=0;i<fabNames.length;i++)
                {
                    fabListTvp.rows.add(fabNames[i]); 
                }
        
			
		             
            let request =  pool.request();
						
			request.input('CustomerName',customerName);	
            request.input('SelectedFabNames',fabListTvp);		

            logger.debug(`will execute stored procedure spGetAllSalesAnalyticsCustomerFlowFabFilterExcel`);

            let result = await request.execute('spGetAllSalesAnalyticsCustomerFlowFabFilterExcel');
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
    
    
            const dataFetch = result.recordset;
            logger.debug(`executed procedure spGetAllSalesAnalyticsChamberFlowCustomerExcel resultRecord : ${JSON.stringify(dataFetch)}`);
			
		    let response= dataFetch;
			
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
	
	
	getAllSalesAnalyticsCustomerFlowChambersAllExcel: async(req, res, next) =>{

        logger.debug('Controller method chambers -> getAllSalesAnalyticsCustomerFlowChambersAllExcel');

        try {
			
   			const customerName = req.query['CustomerName'];
			const fabName = req.query['FabName'];
			            
                      
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
			
		             
            let request =  pool.request();
						
			request.input('CustomerName',customerName);	
            request.input('FabName',fabName);			

            logger.debug(`will execute stored procedure spGetAllSalesAnalyticsCustomerFlowChamberAllExcel`);

            let result = await request.execute('spGetAllSalesAnalyticsCustomerFlowChamberAllExcel');
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
    
    
            const dataChambrs = result.recordset;
            logger.debug(`executed procedure spGetAllSalesAnalyticsCustomerFlowChamberAllExcel resultRecord : ${JSON.stringify(dataChambrs)}`);
			
		    let response= dataChambrs;
			
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
	
	getAllSalesAnalyticsCustomerFlowChambersFilterExcel: async(req, res, next) =>{

        logger.debug('Controller method chambers -> getAllSalesAnalyticsCustomerFlowChambersFilterExcel');

        try {
			
   			const customerName = req.query['CustomerName'];
			const fabName = req.query['FabName'];
			const chamberNames = req.value.body.chamberName;
			            
                      
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
			
			const chamberLstTvp = new sql.Table();
                chamberLstTvp.columns.add('name', sql.VarChar);
                for(i=0;i<chamberNames.length;i++)
                {
                    chamberLstTvp.rows.add(chamberNames[i]); 
                }
         
			
		             
            let request =  pool.request();
						
			request.input('CustomerName',customerName);	
            request.input('FabName',fabName);
            request.input('SelectedChamberNames',chamberLstTvp);		

            logger.debug(`will execute stored procedure spGetAllSalesAnalyticsCustomerFlowChamberFilterExcel`);

            let result1 = await request.execute('spGetAllSalesAnalyticsCustomerFlowChamberFilterExcel');
            logger.debug(`executed procedure result1 : ${JSON.stringify(result1)}`);
    
    
            const dataRecord = result1.recordset;
            logger.debug(`executed procedure spGetAllSalesAnalyticsCustomerFlowChamberFilterExcel resultRecord : ${JSON.stringify(dataRecord)}`);
			
		    let response= dataRecord;
			
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
	
	getAllSalesAnalyticsOtherChambersCount: async(req, res, next) =>{

        logger.debug('Controller method chambers -> getAllSalesAnalyticsOtherChambersCount');

        try {	
   			           
                      
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);			
					             
            let request =  pool.request();						
			
            logger.debug(`will execute stored procedure spGetAllSalesAnalyticsOtherChambersCount`);

            let result1 = await request.execute('spGetAllSalesAnalyticsOtherChambersCount');
            logger.debug(`executed procedure result1 : ${JSON.stringify(result1)}`);
    
    
            const otherCount = result1.recordset;
            logger.debug(`executed procedure spGetAllSalesAnalyticsOtherChambersCount resultRecord : ${JSON.stringify(otherCount)}`);
			
		    let response= otherCount;
			
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
	
	updateAllSalesAnalyticsOtherChambersCount: async(req, res, next) =>{

        logger.debug('Controller method chambers -> updateAllSalesAnalyticsOtherChambersCount');

        try {	
		
		    const updateValue = req.value.body.value;
   			           
                      
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);			
					             
            let request =  pool.request();		
            request.input('Value',updateValue);				
			
            logger.debug(`will execute stored procedure spGetAllSalesAnalyticsUpdateOtherChambersCount`);

            let result1 = await request.execute('spGetAllSalesAnalyticsUpdateOtherChambersCount');
            logger.debug(`executed procedure result1 : ${JSON.stringify(result1)}`);
    
    
            const otherCount = result1.recordset;
            logger.debug(`executed procedure spGetAllSalesAnalyticsUpdateOtherChambersCount resultRecord : ${JSON.stringify(otherCount)}`);
			
		    let response= otherCount;
			
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
	
	
	 getAllSalesAnalyticsOtherCustomersCount: async(req, res, next) =>{

        logger.debug('Controller method chambers -> getAllSalesAnalyticsOtherCustomersCount');

        try {	
   			           
                      
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);			
					             
            let request =  pool.request();						
			
            logger.debug(`will execute stored procedure spGetAllSalesAnalyticsOtherCustomersCount`);

            let result1 = await request.execute('spGetAllSalesAnalyticsOtherCustomersCount');
            logger.debug(`executed procedure result1 : ${JSON.stringify(result1)}`);
    
    
            const otherCount = result1.recordset;
            logger.debug(`executed procedure spGetAllSalesAnalyticsOtherCustomersCount resultRecord : ${JSON.stringify(otherCount)}`);
			
		    let response= otherCount;
			
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
	
	
	updateAllSalesAnalyticsOtherCustomersCount: async(req, res, next) =>{

        logger.debug('Controller method chambers -> updateAllSalesAnalyticsOtherCustomersCount');

        try {	
		
		    const updtValue = req.value.body.value;
   			           
                      
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);			
					             
            let request =  pool.request();		
            request.input('Value',updtValue);				
			
            logger.debug(`will execute stored procedure spGetAllSalesAnalyticsUpdateOtherCustomersCount`);

            let result1 = await request.execute('spGetAllSalesAnalyticsUpdateOtherCustomersCount');
            logger.debug(`executed procedure result1 : ${JSON.stringify(result1)}`);
    
    
            const otherCount = result1.recordset;
            logger.debug(`executed procedure spGetAllSalesAnalyticsUpdateOtherCustomersCount resultRecord : ${JSON.stringify(otherCount)}`);
			
		   
			
            logger.trace(`will close sql connection`);
            sql.close();
           
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
