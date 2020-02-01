const userService = require('../users/user.service');
const {logger} = require('../helpers/logging-helper');

module.exports = basicAuth;

async function basicAuth(req, res, next) {
    // make authenticate path public
    /*if (req.path === '/users/authenticate') {
        return next();
    }*/
    logger.trace(`basicAuth check`);

    // check for basic auth header
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        logger.trace(`Malformed or missing basic auth header, sending 401 status to client with message`);
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }

    // verify auth credentials
    const base64Credentials =  req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    const authenticated = await userService.basicAuthenticate({ username, password });
    if (!authenticated) {
        logger.trace(`Incorrect basic auth header credentials, sending 401 status to client with message`);
        return res.status(401).json({ message: 'Invalid Authentication Credentials' });
    }
    logger.debug(`basicAuth check passed`);

    // attach user to request object
    /////req.user = user

    next();
}