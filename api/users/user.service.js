
const axios = require('axios');
const {logger} = require('../helpers/logging-helper');

// users hardcoded for simplicity, store in a db for production applications
const users = [{ id: 1, username: '9ae0f32f664d5f18ab211fa659dc2367', password: '86e6ecc075cb6fab7441868cd8fe9e2c', firstName: 'Test', lastName: 'User' }];

module.exports = {
    authenticate,
    basicAuthenticate,
    getAll,
    verifyOauthToken
};

async function authenticate({ username, password }) {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}

async function basicAuthenticate({username, password}){

    const API_BASIC_AUTH_USERNAME = process.env.API_BASIC_AUTH_USERNAME;
    const API_BASIC_AUTH_PASSWORD = process.env.API_BASIC_AUTH_PASSWORD;

    if(username == API_BASIC_AUTH_USERNAME && password == API_BASIC_AUTH_PASSWORD)
    {
        return true;
    }
    else 
    {
        return false;
    }

}

async function verifyOauthToken(accessToken, res)
{
    logger.debug(`verifyOauthToken called`);

    const userInfoEndpoint = process.env.OAUTH_USERINFO_ENDPOINT;

    let oauthTokenVerifyResponse = {};
    
    if(typeof userInfoEndpoint == 'undefined')
    {
        oauthTokenVerifyResponse['error'] = 'OAuth Userinfo Endpoint not configured in Web.config of the api';
       
        logger.debug(`${JSON.stringify(oauthTokenVerifyResponse)}`);

        return oauthTokenVerifyResponse;
    }

    try{
        const AuthStr = 'Bearer '.concat(accessToken); 
        const response = await axios.get(userInfoEndpoint, {headers : {Authorization : AuthStr}});
        oauthTokenVerifyResponse = response;

        logger.debug(`auth server responded - ${oauthTokenVerifyResponse}`);

        return oauthTokenVerifyResponse;
    }
    catch(error)
    {
        logger.debug(`userinfo endpoint returned error - ${error}`);
        return res.status(401).send('Invalid or Expired Authorization');
    }

}


async function getAll() {
    return users.map(u => {
        const { password, ...userWithoutPassword } = u;
        return userWithoutPassword;
    });
}
