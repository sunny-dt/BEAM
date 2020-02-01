const nodemailer = require("nodemailer");

const {logger} = require('../helpers/logging-helper');

 
 

 

async function sendMail(email){

             

             

	 try{

				  

			logger.debug(`email request body : ${JSON.stringify(email)}`);

             /* let transporter = nodemailer.createTransport({

                 host: config.get("SMTPConfig.host"),

                 port: config.get("SMTPConfig.port"),

                 secure: config.get("SMTPConfig.secure")

             }); */

 

                            

              

            let transporter = nodemailer.createTransport({

                host: 'smtp.ethereal.email',

                port: 587,

                auth : {

                    user : 'henry.leffler46@ethereal.email',

                    pass : 'MmgqAedgBNgARF1Pmk'

                }


            });  

 

 

            let message = {

                from: email.from != undefined ? email.from : "",

                to: email.to != undefined ? email.to : "",

                subject: email.subject != undefined ? email.subject : "",

                text: email.body,

               // html: email.isHtml == true ? email.body : "",

                cc: email.cc != undefined ? email.cc : "",

                bcc: email.bcc != undefined ? email.bcc : "",

                date: new Date()

            };

 

           

 

            logger.debug(`email.attachments -  ${email.attachments}`)

           

            let attachments = [];

            for(let attachment of email.attachments)

            {

                if(attachment.base64_encoded != undefined)

                {

                    attachments.push({filename : attachment.filename != undefined ? attachment.filename : "", content : attachment.base64_encoded, encoding : 'base64'});

                }

            }

 

            if(attachments.length > 0)

            {

                logger.debug('attachments count is > 0')

                message['attachments'] = attachments;

            }

            else

            {

                logger.debug('attachments count is 0');

            }

                     

 

                   

            logger.debug(`message : ${JSON.stringify(message)}`);

            let result =  await transporter.sendMail(message);

				  

		  

		   console.log("mail results : ", result);

		   return {error : null, success : true, result : result};

				  

	 }

	 catch(err){

				  

				   console.log("error caught : ", err);

				   return {error : err, success : false, result : null};

	 }

 

}

 

 

 

module.exports = {

              sendMail : sendMail

}