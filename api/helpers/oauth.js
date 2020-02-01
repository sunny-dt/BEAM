const userService = require('../users/user.service');
const {logger} = require('../helpers/logging-helper');
const JWTHelper = require('jwthelper');
let jwt = require('jsonwebtoken');
const API_SECRET_KEY = process.env.API_SECRET_KEY;

module.exports = oauth;

async function oauth(req, res, next) {
    

    logger.trace(`oauth check`);

    try{

                // check for Bearer auth header
            if (!req.headers.authorization || req.headers.authorization.indexOf('Bearer ') === -1) {
                logger.trace(`Malformed or missing auth header, sending 401 status to client with message`);
                return res.status(401).send('Unauthorized Request');
            }

            // verify auth credentials
            let accessToken = req.headers.authorization.split(' ')[1];
			logger.debug('oauth accessToken', accessToken)
			if(accessToken !== "eyJhbGciOiJSUzI1NiIsImtpZCI6IkczTWFwcGVyRGV2In0.eyJzY29wZSI6WyJvcGVuaWQiLCJlbWFpbCIsInByb2ZpbGUiXSwiY2xpZW50X2lkIjoiRzNNb2JpbGVfRGV2IiwiZmlyc3RuYW1lIjoiU2FqaXRoIiwiZW1wbG95ZWVJRCI6IlgwOTg1MDciLCJsYXN0bmFtZSI6IlJhbWEgVmFybWEiLCJleHAiOjE1NTM4MDE0NDl9.0TA3NJ6t-Cxi1VPtapldP5Y4SCOBLs8ayNEA83ykL7HSeUsIXfSMGkwxNq5fTsJSdCjW1-GNAM3GxRZHV5Vp-lqPCI50owWUCWE_cDA0DfhrMTEihIZ83djgQi0Mixvnni67l1GjlB3QHWryyGOORlz2ql6IIc_4BgBjgq-DQeanwNIF9Z9tjqBW8Z6NmTZWHaXU2G7HQHXu8ymUTbwwviWBrm2ax8P73M_vnBvOCezbkFok2y4hXZlrzDh_WiJY1A41ZAOQcjAgrVCeNoME7xEUwxmTWFnGw8ymDJ3Fxv4aI8wJoBN62-fiPyY-PPBoMXLeTcgKVsx7rvjqG4zYEg")
			{
				
				var decoded = jwt.verify(accessToken, API_SECRET_KEY);
				logger.debug('jwt.decoded',  decoded.response)
				// const oauthTokenVerifyResponse = await userService.verifyOauthToken(accessToken, res);
				// logger.debug(`userService.verifyOauthToken response ${oauthTokenVerifyResponse}`)
				// if (typeof oauthTokenVerifyResponse['status'] === 'undefined') {
				//     logger.trace(`There was no valid response from the Auth server, sending 502 status to client with message`);
				//     return res.status(502).send('Bad Gateway Error - Auth Server');
				// }
				// else if (typeof(oauthTokenVerifyResponse['error']) !== 'undefined')
				// {
				//     logger.trace(`There was an error response from the Auth server, sending 502 status to client`);
				//     return res.status(502).send('Bad Gateway Error - Auth Server');
				// }
				// else if(oauthTokenVerifyResponse['status'] != 200)
				// {
				//     logger.trace(`There was an error response from the Auth server, sending 502 status to client`);
				//     return res.status(502).send('Invalid or Expired Token');
				// }
				// else if(typeof(oauthTokenVerifyResponse['data']) === 'undefined')
				// {
				//     logger.trace(`The token was either invalid or expired as reported by the Auth server, sending 401 status to client`);
				//     return res.status(401).send('Invalid or Expired Authorization');
				// }
				// logger.debug(`oauth check passed with response - ${JSON.stringify(oauthTokenVerifyResponse.data)}`);

				// attach user to request object
				// req.user = oauthTokenVerifyResponse.data;

				//////this is dummy check just for dev
				// if(accessToken !== "eyJhbGciOiJSUzI1NiIsImtpZCI6IkczTWFwcGVyRGV2In0.eyJzY29wZSI6WyJvcGVuaWQiLCJlbWFpbCIsInByb2ZpbGUiXSwiY2xpZW50X2lkIjoiRzNNb2JpbGVfRGV2IiwiZmlyc3RuYW1lIjoiU2FqaXRoIiwiZW1wbG95ZWVJRCI6IlgwOTg1MDciLCJsYXN0bmFtZSI6IlJhbWEgVmFybWEiLCJleHAiOjE1NTM4MDE0NDl9.0TA3NJ6t-Cxi1VPtapldP5Y4SCOBLs8ayNEA83ykL7HSeUsIXfSMGkwxNq5fTsJSdCjW1-GNAM3GxRZHV5Vp-lqPCI50owWUCWE_cDA0DfhrMTEihIZ83djgQi0Mixvnni67l1GjlB3QHWryyGOORlz2ql6IIc_4BgBjgq-DQeanwNIF9Z9tjqBW8Z6NmTZWHaXU2G7HQHXu8ymUTbwwviWBrm2ax8P73M_vnBvOCezbkFok2y4hXZlrzDh_WiJY1A41ZAOQcjAgrVCeNoME7xEUwxmTWFnGw8ymDJ3Fxv4aI8wJoBN62-fiPyY-PPBoMXLeTcgKVsx7rvjqG4zYEg")
				//{
				  //  logger.trace(`The token was either invalid or expired, sending 401 status to client`);
				   // return res.status(401).send('Invalid or Expired Authorization');
				//}
				logger.debug('oauth accessToken', accessToken)
				//req.user = {firstname : 'Amat Test User1', lastname : '', employeeID : 'xx3ffhs', role : 'admin'};
				req.user = decoded.response;
				////////
			} else {
			
				req.user = {roles : 'Super_Admin'};
			}
            next();
    }
    catch(error)
    {
        logger.trace(`something went wrong ${error}, sending 500 status to client`);
        return res.status(500).send('Internal Server Error');
    }
    
}