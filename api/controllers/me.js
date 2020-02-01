const {config, sql} = require('../helpers/db-config-helper');
const {logger} = require('../helpers/logging-helper');


module.exports = {

 //Validation DONE
 index : async (req, res, next) =>{
        
    logger.debug(`Controller method me -> index`);

    
        try {

            const response = {};
            if(typeof req.user !== 'undefined')
            {
                let firstName = req.user['firstname'] ? req.user['firstname'] : '';
                let lastName = req.user['lastname'] ? req.user['lastname'] : '';
                let employeeId = req.user['employeeID'] ? req.user['employeeID'] : '';
                let sub = req.user['sub'] ? req.user['sub'] : '';

                let authUser = `${firstName} ${lastName}`;
                let authType = 'oauth2.0 + openid';
                let logonUser = authUser;

                logger.trace('current authUser :', authUser ? authUser : 'authUser not found');
                logger.trace('current authType :', authType ? authType : 'authType not found');
                logger.trace('current logonUser :', logonUser ? logonUser : 'logonUser not found');
                
                
                response['authUser'] = authUser;
                response['authType'] = authType;
                response['logonUser'] = logonUser;
            
            }
            else
            {
                response['authUser'] = '';
                response['authType'] = '';
                response['logonUser'] = '';
            }
            logger.debug(`sending current user info in response ->  ${JSON.stringify(response)}`);
            res.status(200).json(response);
           
        }
        catch(error)
        {
            logger.error(error);
            logger.debug(`sending 500 error response to client`);
    
            res.status(500).send(error.name || '');
        }
    }

}
