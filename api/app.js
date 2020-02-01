const express = require('express');
const requestsLogger = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const oauth = require('./helpers/oauth');
const {logger} = require('./helpers/logging-helper');
const json2xls = require('json2xls');

const app = express();

const platforms = require('./routes/platforms');
const facets = require('./routes/facets');
const g2products = require('./routes/g2products');
const g3products = require('./routes/g3products');
const chambers = require('./routes/chambers');
const opportunities = require('./routes/opportunity');
const productconfigs = require('./routes/productconfigs');
const productconfigmappings = require('./routes/productconfigmappings');
const uploads = require('./routes/uploads')
const me = require('./routes/me')
const featured = require('./routes/featured');
const latest = require('./routes/latest');
const recommended = require('./routes/recommended');
const explorermenunode = require('./routes/explorermenunodes');
const menunodemetadata = require('./routes/menu_node_metadata');
const metadatamedia = require('./routes/metadata_media');
const menunodetypes = require('./routes/menunodetypes');
const node_type_attribute_names = require('./routes/node-type-attribute-names');
const metadata_attr_values = require('./routes/metadata-attr-values');
const metadata_table_attr_types = require('./routes/metadata_table_attr_types');
const explorersearch = require('./routes/explorersearch');

const customers = require('./routes/customers');
const builders = require('./routes/builders');
const NSOConfigs = require('./routes/NSOConfigs');
const salesAnalytics = require('./routes/sales-analytics');
const users = require('./routes/users');
const helper_api = require('./routes/helper-api');

const master = require('./routes/master');

//Middlewares
app.use(helmet());
app.use(requestsLogger(':date - :method :url - :referrer - :status - :response-time - :remote-addr - :user-agent'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

 app.use(oauth);
// app.use(json2xls.middleware);
//Routes


//let baseHref = process.env.API_BASE_HREF;
const baseHref ="";
console.log(baseHref); 
app.get(baseHref + '/', (req, res, next) => {
    res.status(200).json({
        message:"Welcome to AMAT Product Mapper/Guide API"
    });
});

app.use(baseHref + '/platforms', platforms);
app.use(baseHref + '/facets', facets);
app.use(baseHref + '/g2products', g2products);
app.use(baseHref + '/g3products', g3products);
app.use(baseHref + '/productconfigs', productconfigs);
app.use(baseHref + '/chambers', chambers);
app.use(baseHref + '/opportunities', opportunities);
app.use(baseHref + '/productconfigmappings', productconfigmappings);
app.use(baseHref + '/uploads', uploads);
app.use(baseHref + '/me', me);

app.use(baseHref + '/featured', featured);
app.use(baseHref + '/latest', latest);
app.use(baseHref + '/recommended', recommended);
app.use(baseHref + '/explorermenunode', explorermenunode);
app.use(baseHref + '/menunodemetadata', menunodemetadata);
app.use(baseHref + '/metadatamedia', metadatamedia);
app.use(baseHref + '/menunodetypes', menunodetypes);
app.use(baseHref + '/node_type_attribute_names', node_type_attribute_names);
app.use(baseHref + '/metadata_attr_values', metadata_attr_values);
app.use(baseHref + '/metadata_table_attr_types', metadata_table_attr_types);
app.use(baseHref + '/explorersearch', explorersearch);

app.use(baseHref + '/customers', customers);
app.use(baseHref + '/builders', builders);
app.use(baseHref + '/NSOConfigs', NSOConfigs);
app.use(baseHref + '/SalesAnalytics', salesAnalytics);
app.use(baseHref + '/Users', users);
app.use(baseHref + '/HelperAPI', helper_api);

app.use(baseHref + '/master', master);

//Catch 404 Errors and forward them to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//Error handler function
app.use((err, req, res, next) => {
    //respond to client
    const error = err;
    const status = err.status || 500;

    res.status(status).json({
        error: {
            message: error.message
        }
    });

    //respond to ourselves
    logger.error(error);

});

//Start the server
const port = process.env.PORT || 3000;
app.listen(port, ()=> {

     logger.info(`Server is listening on port ${port}`);

});

