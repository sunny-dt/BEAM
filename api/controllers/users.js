const {config, sql} = require('../helpers/db-config-helper');
const {logger} = require('../helpers/logging-helper');

let jwt = require('jsonwebtoken');

const API_SECRET_KEY = process.env.API_SECRET_KEY;

module.exports = {

    //Validation DONE
 index : async (req, res, next) =>{
        
    logger.debug(`Controller method customers -> index`);

    
        try {

            
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();


            logger.debug(`will execute stored procedure spGetUsers`);
            
            result = await request.execute('spGetUsers');
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            let users = result.recordset;

            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(users)}`);
            res.status(200).json(users);
           
			
        }
        catch(error)
        {
            logger.error(error);
            logger.debug(`sending 500 error response to client`);
    
            res.status(500).send(error.name || '');
        }
    },
	
	
	getUserRoles :  async (req, res, next) =>{
        
        logger.debug(`Controller method customers -> index`);
    
        
          try {

           const userid = req.value.body.username;
           const password = req.value.body.password;


                     
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            request.input('EmailId', userid );
            request.input('Password', password);

            logger.debug(`will execute stored procedure spValidateUserCredentials`);
            
            result = await request.execute('spValidateUserCredentials');
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            let resp = result.recordset[0].UserExists;
			
			if(resp == 'true')
            {
                let request1 =  pool.request();
                request1.input('Email', userid );

                logger.debug(`will execute stored procedure spGetUserModuleAccessDetails`);
            
                result1 = await request1.execute('spGetUserModuleAccessDetails');
                logger.debug(`executed procedure result : ${JSON.stringify(result1)}`);
                let details = result1.recordset;
                logger.debug(`executed procedure result : ${JSON.stringify(details)}`);
				
				var data = details.map(({name, email, role}) => (role));
				const clientId = result1.recordset[0].client_id;
				const name1 = result1.recordset[0].name ;
				const firstname1 = result1.recordset[0].firstname ;
				const empid = result1.recordset[0].employeeID ;
				const lastname1 = result1.recordset[0].lastname;
				const email1 = result1.recordset[0].email  ;
				
				
				const response = {client_id : clientId, name : name1, firstname : firstname1, employeeID :empid, lastname : lastname1, email :email1 , roles : data};
				
				let token = jwt.sign({response},
                 API_SECRET_KEY,
                 { 
				   expiresIn: '365 days' // expires in 365 days
                 }
                );

				let response2 = {token : token, response : "success"};
                logger.trace(`will close sql connection`);
                sql.close();
                logger.debug(`sql connection closed, sending 200 response2 to client : ${JSON.stringify(response2)}`);
                res.status(200).json(response2);
           
           
            }
			
			else{
				
				const msg = 'failure';
				const msg1 = 'Invalid login credentials'
				const response = {response : msg , message : msg1};

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

    

    	
}

