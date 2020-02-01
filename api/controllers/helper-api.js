

const {logger} = require('../helpers/logging-helper');
const {sendMail} = require('../helpers/mail-helper');

module.exports = {

   
    //Validation DONE
    sendNewMail: async (req, res, next) =>{

        logger.debug('Controller method helper-api -> sendNewMail');

        try{

            const emails = req.value.body;
            

            logger.debug(`send mail request body  : ${JSON.stringify(req.value.body)}`);
	
			let emailresults = [];
			for(let email of emails)
			{
				const result = 	await sendMail(email);
				emailresults.push(result);
			}

            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(emailresults)}`);
            res.status(200).json(emailresults);

        }
        catch(error)
        {
            logger.error(error);
           
            logger.debug(`sql connection closed, sending 500 error response to client`);

            res.status(500).send(error.name || '');
        }
    },

    

};