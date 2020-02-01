const log4js = require('log4js');
log4js.configure({
    appenders: {
      stdout: { type: 'stdout' },
      stderr: { type: 'stderr' },
      errors: { type: 'file', filename: 'errors.log' },
      fileFilter: { type: 'logLevelFilter', appender: 'errors', level: 'ERROR' },
      stderrFilter: { type: 'logLevelFilter', appender: 'stderr', level: 'ERROR' }
    },
    categories: {
      default: { appenders: [ 'fileFilter', 'stderrFilter', 'stdout' ], level: 'DEBUG' }
    }
  });


var logger = log4js.getLogger();

function getLogger()
{
    const applicationLogLevel = process.env.APPLICATION_LOG_LEVEL || '';
    switch(applicationLogLevel.toLowerCase())
    {
        case 'fatal':
        case 'error':
        case 'warn':
        case 'info':
        case 'debug':
        case 'trace':
            logger.level = applicationLogLevel; 
        break;

    }
    return logger;
}


module.exports = {

    logger : getLogger()
}