// const Chamber = require('../models/chamber');
// const Product = require('../models/product');
// const Platform = require('../models/platform');

const {config, sql} = require('../helpers/db-config-helper');
const {logger} = require('../helpers/logging-helper');
const _ = require('underscore');
const subpaths = require('../helpers/assests-subpaths');

module.exports = {

    //Validation DONE
    index : async (req, res, next) =>{
        
        logger.debug('Controller method chambers -> index');

        try {

            logger.debug(`find chamber query params  : ${JSON.stringify(req.query)}`);
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            logger.debug(`will execute stored procedure spFindChambers with`);

            for (var queryParamName in req.query) {
                if (req.query.hasOwnProperty(queryParamName)) {

                    
                    switch(queryParamName.toLowerCase())
                    {
                        case 'filter':
                        {
                            request.input('Id', parseInt(req.query[queryParamName]) || 0);
                            logger.debug('@Id', parseInt(req.query[queryParamName]) || 0);

                            request.input('Name',  req.query[queryParamName]);
                            logger.debug('@Name', req.query[queryParamName]);

                            request.input('GotCode',  req.query[queryParamName]);
                            logger.debug('@GotCode', req.query[queryParamName]);

                            break;
                        }

                        case 'page':
                        {
                            request.input('PageNo',  parseInt(req.query[queryParamName]) || 1);
                            logger.debug('@PageNo', parseInt(req.query[queryParamName]) || 1);

                            break;
                        }

                        case 'pagesize':
                        {
                            request.input('PageSize',  parseInt(req.query[queryParamName]) || 10);
                            logger.debug('@PageSize', parseInt(req.query[queryParamName]) || 10);

                            break;
                        }

                        case 'sortby':
                        {
                            switch(req.query[queryParamName].toLowerCase())
                            {
                                case 'id':
                                case 'name':
                                case 'got_code':
                                {
                                    request.input('SortColumn',  req.query[queryParamName]);
                                    logger.debug('@SortColumn', req.query[queryParamName]);
                                    break;
                                }
                            }
                    
                            break;
                        }

                        case 'sortorder':
                        {
                            
                            switch(req.query[queryParamName].toLowerCase())
                            {
                                case 'asc':
                                case 'desc':
                                {
                                    request.input('SortOrder',  req.query[queryParamName]);
                                    logger.debug('@SortOrder', req.query[queryParamName]);
                                    break;
                                }
                            }

                            break;
                        }

                        case 'platformid':
                        {
                            request.input('PlatformId',  req.query[queryParamName]);
                            logger.debug('@PlatformId', req.query[queryParamName]);
                            break;
                        }
                    }
                    
                }
            }

            
            result = await request.execute('spFindChambers');
            
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            let chambers = result.recordset;
            chambers = chambers.map(({TotalCount, ROWNUM, id, name, got_code, platform_id,chamber_id,chamber_family_id}) => ({id, name, got_code, platform_id,chamber_id, chamber_family_id}));
            const totalCount = result.recordset.length > 0 ? result.recordset[0]['TotalCount'] : 0 ;
            const response = {totalCount : totalCount, items : chambers};
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

    //Validation DONE
    newChamber: async (req, res, next) =>{
        
        logger.debug('Controller method chambers -> newChamber');

        try{

            const newChamberBody = req.value.body;
            const platformId = parseInt(req.query['platformId']);

            logger.debug(`add chamber request body  : ${JSON.stringify(req.value.body)}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            logger.debug(`will query for the existence of the chamber in the db`);

            let result = await request.query`select count(*) as count from Chamber where got_code=${newChamberBody.got_code} and platform_id=${platformId}`;
            logger.debug(`executed query, result : ${JSON.stringify(result.recordset)}`);
            const count = result.recordset[0].count;

            if(count > 0)
            {
                const message = "A chamber with the supplied GOT CODE already exists.";
                logger.trace(`${message} aborting and closing sql conn`);
                sql.close();
                logger.debug(`sql connection closed, sending 409  response to client`);
    
                res.status(409).send(message);
                return;
            }
           

            request =  pool.request();

            logger.debug(`will execute stored procedure spAddChamber @Name =  ${newChamberBody.name}, @GotCode=${newChamberBody.got_code}, @PlatformId = ${platformId}`);
            request.input('Name', newChamberBody.name);
            request.input('GotCode', newChamberBody.got_code);
            request.input('PlatformId', platformId);
            
            result = await request.execute('spAddChamber');
            
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            const chamber = result.recordset;
            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(chamber)}`);
            res.status(201).json(chamber);

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

    // //Validation DONE
    // getChamber: async(req, res, next) =>{
    //     const {chamberId} = req.value.params;
    //     const chamber = await Chamber.findById(chamberId);
    //     if(!chamber)
    //     {
    //         return res.status(404).json({
    //             error: {
    //                 message: "The specified chamber doesn't exist"
    //             }
    //         });
    //     }
    //     res.status(200).json(chamber);
    // },

    // //Validation DONE
    // replaceChamber: async(req, res, next) =>{
    //     const {chamberId} = req.value.params;
    //     const newChamber = req.value.body;

    //     const result = await Chamber.findByIdAndUpdate(chamberId, newChamber);
    //     res.status(200).json({success : true});
    // },

    //Validation DONE
    updateChamber: async(req, res, next) =>{

        logger.debug('Controller method chambers -> updateChamber');
        try{

            const {chamberId} = req.value.params;
            const modifications = req.value.body;

            logger.debug(`update chamber id  : ${chamberId}`);
            logger.debug(`update chamber request body  : ${JSON.stringify(req.value.body)}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            logger.debug(`will query for the existence of other chamber in the db having same values`);

            let result = await request.query`select count(*) as count from Chamber where id <> ${chamberId} and (name=${modifications.name} or got_code=${modifications.got_code})`;
            logger.debug(`executed query, result : ${JSON.stringify(result.recordset)}`);
            const count = result.recordset[0].count;

            if(count > 0)
            {
                const message = "No two chambers can have same value for name and got code";
                logger.trace(`${message} aborting and closing sql conn`);
                sql.close();
                logger.debug(`sql connection closed, sending 409  response to client`);
    
                res.status(409).send(message);
                return;
            }

            request = pool.request();
            logger.debug(`will execute stored procedure spUpdateChamber @Id=${chamberId} @Name =  ${modifications.name}, @GotCode=${modifications.got_code}`);
            request.input('Id', chamberId);
            request.input('Name', modifications.name);
            request.input('GotCode', modifications.got_code);
            
            result = await request.execute('spUpdateChamber');
            
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            
            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify({success : true})}`);
            

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

    //Validation DONE
    removeChamber: async(req, res, next) =>{

        logger.debug('Controller method chambers -> removeChamber');

        try{
            const {chamberId} = req.value.params;
            logger.debug(`delete chamber id  : ${chamberId}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            logger.debug(`will query for the existence of product configs in the db having dependency on this chamber`);
            logger.debug(`will execute stored procedure spGetProductConfigNamesByChamberId @Id=${chamberId}`);
            request.input('Id', chamberId);
            result = await request.execute('spGetProductConfigNamesByChamberId');
            
            logger.debug(`executed procedure result : ${JSON.stringify(result.recordset)}`);

            if(result.recordset.length > 0)
            {
                const message = `There ${result.recordset.length <= 1 ? 'is' : 'are'} ${result.recordset.length} product configs dependent on this chamber. Please delete ${result.recordset.length <= 1 ? 'it' : 'them'} first.`;
                logger.trace(`${message} aborting and closing sql conn`);
                sql.close();
                logger.debug(`sql connection closed, sending 409  response to client`);
    
                res.status(409).send(message);
                return;
            }


            request =  pool.request();
            logger.debug(`will execute stored procedure spDeleteChamber @Id=${chamberId}`);
            request.input('Id', chamberId);
            result = await request.execute('spDeleteChamber');
            
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            
            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify({success : true})}`);
            
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


     findProductsBySelectedChambers: async(req, res, next) =>{

        logger.debug('Controller method chambers -> findProductsBySelectedChambers');

        try
        {
            const chamberIds = req.value.body.chamberIds;
            const platformId = req.value.body.platformId;
            logger.trace(`request body : ${JSON.stringify(req.value.body)}`);
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            const request1 =  pool.request();
            logger.debug(`will execute select Chamber query with id list =  ${JSON.stringify(chamberIds)}`);
            let result = await request1.query`select name from Chamber where id in (${chamberIds})`;
            const chamberNames  = result.recordset;
            logger.debug(`executed select Chamber query, result : ${JSON.stringify(result)}`);
            logger.debug(`chamberNames : ${JSON.stringify(result.recordset)}`);

            
            const request2 =  pool.request();
            logger.debug(`will execute stored procedure spGetProductsValidNonRnd @SelectedChambersNameList=${JSON.stringify(chamberNames)}.toTable(NameList), @SelectedPlatformId =  ${platformId}`);
            request2.input('SelectedChambersNameList', chamberNames.toTable('NameList'));
            request2.input('SelectedPlatformId', platformId);
            result = await request2.execute('spGetProductsValidNonRnd');
            let products = result.recordset;
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            logger.debug(`products : ${JSON.stringify(result.recordset)}`);


            if(products.length == 0)
            {
                const request3 =  pool.request();
                logger.trace(`since no valid products were found, attempting to retrieve rndOnlyProducts`);
                logger.debug(`will execute stored procedure spGetProductsRndOnly @SelectedChambersNameList=${JSON.stringify(chamberNames)}.toTable(NameList), @SelectedPlatformId =  ${platformId}`);
                request3.input('SelectedChambersNameList', chamberNames.toTable('NameList'));
                request3.input('SelectedPlatformId', platformId);
                request3.input('IncludeValidNonRndProductsNotHavingEnoughChamberSelectionsYet', true);
                result = await request3.execute('spGetProductsRndOnly');
                products = result.recordset;
                logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
                logger.debug(`products : ${JSON.stringify(result.recordset)}`);

            }
    
            const request4 =  pool.request();
            logger.debug(`will execute stored procedure spGetAllFacetsForPlatform @SelectedPlatformId =  ${platformId}`);
            request4.input('PlatformId', platformId);
            result = await request4.execute('spGetAllFacetsForPlatform');
            const facets = result.recordset;
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            logger.debug(`facets : ${JSON.stringify(result.recordset)}`);

    
           //console.log('all facets for platform ' + platformId + ' - ' + facets);
           logger.debug(`begin iterating products...`);
            for(var product of products)
            {      
                logger.debug(`product name : ${product.product_name}`);          
                product['model_svg_url'] = process.env.CLIENT_ASSETS_BASE_URI +  product['model_svg_filename'];
                logger.trace(`product model_svg_url set to : ${product.model_svg_url}`);
                product['configuration'] = new Array();
                logger.trace(`product configuration set to new Array()`);
                for(var facet of facets)
                {
                    const config = new Object();
                    config['facet_name'] = facet.facet_name;
                    config['chamber_name'] = '';
                    product.configuration.push(config);
                }
                logger.trace(`product configuration pushed config objects(initialised) with only facet_names : ${JSON.stringify(product.configuration)}`);

    
                let request5 =  pool.request();
                logger.debug(`will execute stored procedure spGetFacetChamberMappingsForProductConfiguration @ProductConfigId =  ${product.nearest_product_config_id}`);
                request5.input('ProductConfigId', product.nearest_product_config_id);
                result = await request5.execute('spGetFacetChamberMappingsForProductConfiguration');
                let masterConfigurationOfProduct = result.recordset;
                logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
                logger.debug(`masterConfigurationOfProduct : ${JSON.stringify(result.recordset)}`);

                //console.log(`masterConfigurationOfProduct for nearest_product_config_id ${product.nearest_product_config_id} - ${masterConfigurationOfProduct}`);
    
                let notFoundInMostMatchingConfigurationChamberIds = new Array();
                logger.trace(`notFoundInMostMatchingConfigurationChamberIds initialised to new Array for the current product`);
                logger.trace(`will iterate through the chamberIds array to find out fitting chamberIds and fit them in the current productConfig's facet-chamber configuration array`);
                for(let i=0; i<chamberIds.length;i++)
                {
                    let chamberId = chamberIds[i];

                    let firstMatchingConfig = masterConfigurationOfProduct.find(config => config.chamber_id == chamberId);
                    if(firstMatchingConfig)
                    {
                        logger.trace(`masterConfiguration ${firstMatchingConfig} matched chamberId for fitting ${chamberId}`);
                        const index = product.configuration.findIndex(config => config.facet_name == firstMatchingConfig.facet_name);
                        if(index >= 0)
                        {
                            logger.debug(`found available facet chamberId for fitting ${chamberId}`);
                            product.configuration[index].chamber_name = firstMatchingConfig.chamber_name;
                        }
                        masterConfigurationOfProduct = masterConfigurationOfProduct.filter(value => value.facet_name != firstMatchingConfig.facet_name);
                    }
                    else
                    {
                        logger.debug(`Not found chamberId for fitting ${chamberId}, will add it to array notFoundInMostMatchingConfigurationChamberIds`);
                        notFoundInMostMatchingConfigurationChamberIds.push(chamberId);
                    }
                        
                }

                if(notFoundInMostMatchingConfigurationChamberIds.length > 0)
                {
                    logger.debug(`notFoundInMostMatchingConfigurationChamberIds is not empty , so will process it`);
                    const siblingConfigIdChamberIdsList = new sql.Table('IdList');
                    siblingConfigIdChamberIdsList.columns.add('id', sql.Int);
                    for(let chamberId of notFoundInMostMatchingConfigurationChamberIds)
                    {
                        siblingConfigIdChamberIdsList.rows.add(chamberId);
                    }

                    let request6 =  pool.request();
                    logger.debug(`will execute stored procedure spGetFacetChamberMappingsForProductConfiguration @ProductConfigId =  ${product.nearest_product_config_id}, @ChamberIdList = ${notFoundInMostMatchingConfigurationChamberIds}`);
                    request6.input('ProductConfigId', product.nearest_product_config_id);
                    request6.input('ChamberIdList', siblingConfigIdChamberIdsList);
                    result = await request6.execute('spGetFacetChamberMappingsFromCorrespondingEntireG2Matrix');
                    let facetChamberPossibleConfigurations = result.recordset;
                    logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
                    logger.debug(`facetChamberPossibleConfigurations : ${JSON.stringify(facetChamberPossibleConfigurations)}`);

                    logger.debug(`will iterate thru notFoundInMostMatchingConfigurationChamberIds`);
                    for(let i=0; i<notFoundInMostMatchingConfigurationChamberIds.length;i++)
                    {
                        let chamberId = notFoundInMostMatchingConfigurationChamberIds[i];

                        //trying to fit any one of the facetChamberPossibilities for the current extra-terrestial chamberId (:D)
                        let facetChamberPossibilities = facetChamberPossibleConfigurations.filter(facetChamber => facetChamber.chamber_id == chamberId);
                        for(var facetChamberPossibility of facetChamberPossibilities)
                        {
                            logger.debug(`trying to fit chamberId  facetChamberPossibility.chamber_name = ${facetChamberPossibility.chamber_name}    facetChamberPossibility.facet_name = ${facetChamberPossibility.facet_name} `);


                            const index = product.configuration.findIndex(config =>  config.chamber_name == '' && config.facet_name == facetChamberPossibility.facet_name);
                            if(index >= 0)
                            {
                                logger.debug(`vacant place found in main configuration for chamberId ${chamberId}`);

                                product.configuration[index].chamber_name = facetChamberPossibility.chamber_name;
                                facetChamberPossibleConfigurations = facetChamberPossibleConfigurations.filter(value => value.facet_name != facetChamberPossibility.facet_name);
                                break;
                            }
                            else
                            {
                                logger.debug(`vacant place not found in main configuration for chamberId ${chamberId}`);

                            }
                            
                        }
                       
                       
                    }
                }

    
            }

            logger.trace(`products count before de-duplication process - ${products.length}`);
            let reduced_products = _.map(products, function(product, index){
                return {index : index, uniqueByProperties : JSON.stringify({ product_code : product.product_code , configuration : product.configuration}) }
            });

            logger.trace(`reduced_products_1 \n\t ${JSON.stringify(reduced_products)}`);
    
            reduced_products = _.uniq(reduced_products, 'uniqueByProperties');

            logger.trace(`reduced_products_2 \n\t ${reduced_products}`);


            const unique_indices = _.map(reduced_products, 'index');

            logger.trace(`unique_indices \n\t ${JSON.stringify(unique_indices)}`);


            const deduplicated_products = new Array();
            for(let unique_index of unique_indices)
            {
                deduplicated_products.push(products[unique_index]);
            }


            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(deduplicated_products)}`);
            res.status(200).json(deduplicated_products);
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



    findProductsBySelectedChambersV2: async(req, res, next) =>{

        logger.debug('Controller method chambers -> findProductsBySelectedChambersV2');

        try
        {
            const chamberIds = req.value.body.chamberIds;
            const platformId = req.value.body.platformId;
            logger.trace(`request body : ${JSON.stringify(req.value.body)}`);
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
           

            const chamberIdsTvp = new sql.Table();
            chamberIdsTvp.columns.add('id', sql.Int);
            for(let chamberId of chamberIds)
            {
                chamberIdsTvp.rows.add(chamberId); 
            }

            const request2 =  pool.request();
            logger.debug(`will execute stored procedure spGetProductsValidNonRndV2 @SelectedChambersIdList=${JSON.stringify(chamberIds)}.toTable(IdList), @SelectedPlatformId =  ${platformId}`);
            request2.input('SelectedChambersIdList', chamberIdsTvp);
			logger.debug(`SelectedChambersIdList result : ${JSON.stringify(chamberIdsTvp)}`);
            request2.input('SelectedPlatformId', platformId);
            let result = await request2.execute('spGetProductsValidNonRndV2');
            let products = result.recordset;
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            logger.debug(`products : ${JSON.stringify(result.recordset)}`);
 

            if(products.length == 0)
            {
                const request3 =  pool.request();
                logger.trace(`since no valid products were found, attempting to retrieve rndOnlyProducts`);
                logger.debug(`will execute stored procedure spGetProductsRndOnlyV2 @SelectedChambersIdList=${JSON.stringify(chamberIds)}.toTable(IdList), @SelectedPlatformId =  ${platformId}`);
                request3.input('SelectedChambersIdList', chamberIdsTvp);
                request3.input('SelectedPlatformId', platformId);
                request3.input('IncludeValidNonRndProductsNotHavingEnoughChamberSelectionsYet', true);
                result = await request3.execute('spGetProductsRndOnlyV2');
                products = result.recordset;
                logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
                logger.debug(`products : ${JSON.stringify(result.recordset)}`);

            }
    
            const request4 =  pool.request();
            logger.debug(`will execute stored procedure spGetAllFacetsForPlatform @SelectedPlatformId =  ${platformId}`);
            request4.input('PlatformId', platformId);
            result = await request4.execute('spGetAllFacetsForPlatform');
            const facets = result.recordset;
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            logger.debug(`facets : ${JSON.stringify(result.recordset)}`);

    
           //console.log('all facets for platform ' + platformId + ' - ' + facets);
           logger.debug(`begin iterating products...`);
            for(var product of products)
            {      
                logger.debug(`product name : ${product.product_name}`);          
                product['model_svg_url'] = process.env.CLIENT_ASSETS_BASE_URI + subpaths.SVG_FILES +   product['model_svg_filename'];
                logger.trace(`product model_svg_url set to : ${product.model_svg_url}`);
                product['configuration'] = new Array();
                logger.trace(`product configuration set to new Array()`);
                for(var facet of facets)
                {
                    const config = new Object();
                    config['facet_name'] = facet.facet_name;
                    config['chamber_name'] = '';
                    product.configuration.push(config);
                }
                logger.trace(`product configuration pushed config objects(initialised) with only facet_names : ${JSON.stringify(product.configuration)}`);

    
                let request5 =  pool.request();
                logger.debug(`will execute stored procedure spGetFacetChamberMappingsForProductConfiguration @ProductConfigId =  ${product.nearest_product_config_id}`);
                request5.input('ProductConfigId', product.nearest_product_config_id);
                result = await request5.execute('spGetFacetChamberMappingsForProductConfiguration');
                let masterConfigurationOfProduct = result.recordset;
                logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
                logger.debug(`masterConfigurationOfProduct : ${JSON.stringify(result.recordset)}`);

                //console.log(`masterConfigurationOfProduct for nearest_product_config_id ${product.nearest_product_config_id} - ${masterConfigurationOfProduct}`);
    
                let notFoundInMostMatchingConfigurationChamberIds = new Array();
                logger.trace(`notFoundInMostMatchingConfigurationChamberIds initialised to new Array for the current product`);
                logger.trace(`will iterate through the chamberIds array to find out fitting chamberIds and fit them in the current productConfig's facet-chamber configuration array`);
                for(let i=0; i<chamberIds.length;i++)
                {
                    let chamberId = chamberIds[i];

                    let firstMatchingConfig = masterConfigurationOfProduct.find(config => config.chamber_id == chamberId);
                    if(firstMatchingConfig)
                    {
                        logger.trace(`masterConfiguration ${firstMatchingConfig} matched chamberId for fitting ${chamberId}`);
                        const index = product.configuration.findIndex(config => config.facet_name == firstMatchingConfig.facet_name);
                        if(index >= 0)
                        {
                            logger.debug(`found available facet chamberId for fitting ${chamberId}`);
                            product.configuration[index].chamber_name = firstMatchingConfig.chamber_name;
                        }
                        masterConfigurationOfProduct = masterConfigurationOfProduct.filter(value => value.facet_name != firstMatchingConfig.facet_name);
                    }
                    else
                    {
                        logger.debug(`Not found chamberId for fitting ${chamberId}, will add it to array notFoundInMostMatchingConfigurationChamberIds`);
                        notFoundInMostMatchingConfigurationChamberIds.push(chamberId);
                    }
                        
                }

                if(notFoundInMostMatchingConfigurationChamberIds.length > 0)
                {
                    logger.debug(`notFoundInMostMatchingConfigurationChamberIds is not empty , so will process it`);
                    const siblingConfigIdChamberIdsList = new sql.Table('IdList');
                    siblingConfigIdChamberIdsList.columns.add('id', sql.Int);
                    for(let chamberId of notFoundInMostMatchingConfigurationChamberIds)
                    {
                        siblingConfigIdChamberIdsList.rows.add(chamberId);
                    }

                    let request6 =  pool.request();
                    logger.debug(`will execute stored procedure spGetFacetChamberMappingsForProductConfiguration @ProductConfigId =  ${product.nearest_product_config_id}, @ChamberIdList = ${notFoundInMostMatchingConfigurationChamberIds}`);
                    request6.input('ProductConfigId', product.nearest_product_config_id);
                    request6.input('ChamberIdList', siblingConfigIdChamberIdsList);
                    result = await request6.execute('spGetFacetChamberMappingsFromCorrespondingEntireG2Matrix');
                    let facetChamberPossibleConfigurations = result.recordset;
                    logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
                    logger.debug(`facetChamberPossibleConfigurations : ${JSON.stringify(facetChamberPossibleConfigurations)}`);

                    logger.debug(`will iterate thru notFoundInMostMatchingConfigurationChamberIds`);
                    for(let i=0; i<notFoundInMostMatchingConfigurationChamberIds.length;i++)
                    {
                        let chamberId = notFoundInMostMatchingConfigurationChamberIds[i];

                        //trying to fit any one of the facetChamberPossibilities for the current extra-terrestial chamberId (:D)
                        let facetChamberPossibilities = facetChamberPossibleConfigurations.filter(facetChamber => facetChamber.chamber_id == chamberId);
                        for(var facetChamberPossibility of facetChamberPossibilities)
                        {
                            logger.debug(`trying to fit chamberId  facetChamberPossibility.chamber_name = ${facetChamberPossibility.chamber_name}    facetChamberPossibility.facet_name = ${facetChamberPossibility.facet_name} `);


                            const index = product.configuration.findIndex(config =>  config.chamber_name == '' && config.facet_name == facetChamberPossibility.facet_name);
                            if(index >= 0)
                            {
                                logger.debug(`vacant place found in main configuration for chamberId ${chamberId}`);

                                product.configuration[index].chamber_name = facetChamberPossibility.chamber_name;
                                facetChamberPossibleConfigurations = facetChamberPossibleConfigurations.filter(value => value.facet_name != facetChamberPossibility.facet_name);
                                break;
                            }
                            else
                            {
                                logger.debug(`vacant place not found in main configuration for chamberId ${chamberId}`);

                            }
                            
                        }
                       
                       
                    }
                }

    
            }

            logger.trace(`products count before de-duplication process - ${products.length}`);
            let reduced_products = _.map(products, function(product, index){
                return {index : index, uniqueByProperties : JSON.stringify({ product_code : product.product_code , configuration : product.configuration}) }
            });

            logger.trace(`reduced_products_1 \n\t ${JSON.stringify(reduced_products)}`);
    
            reduced_products = _.uniq(reduced_products, 'uniqueByProperties');

            logger.trace(`reduced_products_2 \n\t ${reduced_products}`);


            const unique_indices = _.map(reduced_products, 'index');

            logger.trace(`unique_indices \n\t ${JSON.stringify(unique_indices)}`);


            const deduplicated_products = new Array();
            for(let unique_index of unique_indices)
            {
                deduplicated_products.push(products[unique_index]);
            }


            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(deduplicated_products)}`);
            res.status(200).json(deduplicated_products);
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



    findCompatibilityDataForSelectedChambers : async(req, res, next) =>{

        logger.debug('Controller method chambers -> findCompatibilityDataForSelectedChambers');

        try{

            const chamberIds = req.value.body.chamberIds;
            const platformId = req.value.body.platformId;
           
            logger.debug(`request body : ${JSON.stringify(req.value.body)}`);
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            const request1 =  pool.request();
            logger.debug(`will execute select Chamber query with id list =  ${JSON.stringify(chamberIds)}`);
            let result = await request1.query`select name from Chamber where id in (${chamberIds})`;
            const chamberNames  = result.recordset;
            logger.debug(`executed select Chamber query, result : ${JSON.stringify(result)}`);
            logger.debug(`chamberNames : ${JSON.stringify(result.recordset)}`);
            
            
    
            logger.debug(`will execute stored procedure spGetCompatibleChamberNames @SelectedChambersNameList=${JSON.stringify(chamberNames)}.toTable(NameList), @SelectedPlatformId =  ${platformId}`);
            const request2 =  pool.request();
            request2.input('SelectedChambersNameList', chamberNames.toTable('NameList'));
            request2.input('SelectedPlatformId', platformId);
            result = await request2.execute('spGetCompatibleChamberNames');
            const compatibleChamberNameList = result.recordset;
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            logger.debug(`compatibleChamberNameList : ${JSON.stringify(compatibleChamberNameList)}`);
    

            logger.debug(`will execute stored procedure spGetRndTypeOnlyChamberNames @SelectedChambersNameList=${JSON.stringify(chamberNames)}.toTable(NameList), @SelectedPlatformId =  ${platformId}, @AlreadyComputedCompatibleChamberNameList = ${JSON.stringify(compatibleChamberNameList)}.toTable(NameList)`);
            const request3 =  pool.request();
            request3.input('SelectedChambersNameList', chamberNames.toTable('NameList'));
            request3.input('SelectedPlatformId', 1)
            request3.input('AlreadyComputedCompatibleChamberNameList', compatibleChamberNameList.toTable('NameList'));
            result = await request3.execute('spGetRndTypeOnlyChamberNames');
            const rndOnlyChamberNameList = result.recordset;
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            logger.debug(`rndOnlyChamberNameList : ${JSON.stringify(rndOnlyChamberNameList)}`);
            

            logger.trace(`will execute stored procedure spGetChambersByNameList @ChamberNames=${JSON.stringify(compatibleChamberNameList)}.toTable(NameList)`);
            const request4 =  pool.request();
            request4.input('ChamberNames', compatibleChamberNameList.toTable('NameList'));
            result = await request4.execute('spGetChambersByNameList');
            let compatibleChambers = result.recordset;
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            logger.debug(`compatibleChambers : ${JSON.stringify(compatibleChambers)}`);

            
            logger.debug(`will execute stored procedure spGetChambersByNameList @ChamberNames=${JSON.stringify(rndOnlyChamberNameList)}.toTable(NameList)`);
            const request5 =  pool.request();
            request5.input('ChamberNames', rndOnlyChamberNameList.toTable('NameList'));
            result = await request5.execute('spGetChambersByNameList');
            let rndOnlyChambers = result.recordset;
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            logger.debug(`rndOnlyChambers : ${JSON.stringify(rndOnlyChambers)}`);
    
            compatibleChambers = compatibleChambers.filter(ch => {

                let alreadySelectedChamberIds = chamberIds.filter(ch_id => {
                    return ch_id == ch.id;
                }) ;

                return alreadySelectedChamberIds.length <= 0
                  
            });
            logger.debug(`after stripping compatibleChambers off of already selected chambers --> ${compatibleChambers}`);


            rndOnlyChambers = rndOnlyChambers.filter(ch => {

                let alreadySelectedChamberIds = chamberIds.filter(ch_id => {
                    return ch_id == ch.id;
                }) ;

                return alreadySelectedChamberIds.length <= 0
                  
            });
            logger.debug(`after stripping rndOnlyChambers off of already selected chambers --> ${rndOnlyChambers}`);




            const compatibilityInfo = new Object() ;
            compatibilityInfo['compatibleChambers'] = new Array();
            compatibilityInfo['rndOnlyChambers'] = new Array();
    
            if(compatibleChambers)
                compatibilityInfo['compatibleChambers'] = compatibleChambers;
            if(rndOnlyChambers)
                compatibilityInfo['rndOnlyChambers'] = rndOnlyChambers;
    

            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(compatibilityInfo)}`);
            res.status(200).json(compatibilityInfo);


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

    findCompatibilityDataForSelectedChambersV2 : async(req, res, next) =>{

        logger.debug('Controller method chambers -> findCompatibilityDataForSelectedChambersV2');

        try{

            const chamberIds = req.value.body.chamberIds;
            const platformId = req.value.body.platformId;
           
            logger.debug(`request body : ${JSON.stringify(req.value.body)}`);
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
           
            
            const chamberIdsTvp = new sql.Table();
            chamberIdsTvp.columns.add('id', sql.Int);
            for(let chamberId of chamberIds)
            {
                chamberIdsTvp.rows.add(chamberId); 
            }
                
            
    
            logger.debug(`will execute stored procedure spGetCompatibleChambers @SelectedChambersIdList=${JSON.stringify(chamberIds)}.toTable(IdList), @SelectedPlatformId =  ${platformId}`);
            const request1 =  pool.request();
            request1.input('SelectedChambersIdList', chamberIdsTvp);
            request1.input('SelectedPlatformId', platformId);
            let result = await request1.execute('spGetCompatibleChambers');
            let compatibleChambers = result.recordset ? result.recordset : [];
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            logger.debug(`compatibleChambers : ${JSON.stringify(compatibleChambers)}`);
    
            const compatibleChamberIdsTvp = new sql.Table();
            compatibleChamberIdsTvp.columns.add('id', sql.Int)

            for(let chamber of compatibleChambers)
            {
                compatibleChamberIdsTvp.rows.add(chamber['id']); 
    
            }

            logger.debug(`will execute stored procedure spGetRndTypeOnlyChambers @SelectedChambersIdList=${JSON.stringify(chamberIds)}.toTable(IdList), @SelectedPlatformId =  ${platformId}, @AlreadyComputedCompatibleChamberIdList = ${JSON.stringify(compatibleChamberIdsTvp)}`);
            const request2 =  pool.request();
            request2.input('SelectedChambersIdList', chamberIdsTvp);
            request2.input('SelectedPlatformId', 1)
            request2.input('AlreadyComputedCompatibleChamberIdList', compatibleChamberIdsTvp);
            result = await request2.execute('spGetRndTypeOnlyChambers');
            let rndOnlyChambers = result.recordset ? result.recordset : [];
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            logger.debug(`rndOnlyChambers : ${JSON.stringify(rndOnlyChambers)}`);
            
    
            compatibleChambers = compatibleChambers.filter(ch => {

                let alreadySelectedChamberIds = chamberIds.filter(ch_id => {
                    return ch_id == ch.id;
                }) ;

                return alreadySelectedChamberIds.length <= 0
                  
            });
            logger.debug(`after stripping compatibleChambers off of already selected chambers --> ${compatibleChambers}`);


            rndOnlyChambers = rndOnlyChambers.filter(ch => {

                let alreadySelectedChamberIds = chamberIds.filter(ch_id => {
                    return ch_id == ch.id;
                }) ;

                return alreadySelectedChamberIds.length <= 0
                  
            });
            logger.debug(`after stripping rndOnlyChambers off of already selected chambers --> ${rndOnlyChambers}`);




            const compatibilityInfo = new Object() ;
            compatibilityInfo['compatibleChambers'] = new Array();
            compatibilityInfo['rndOnlyChambers'] = new Array();
    
            if(compatibleChambers)
                compatibilityInfo['compatibleChambers'] = compatibleChambers;
            if(rndOnlyChambers)
                compatibilityInfo['rndOnlyChambers'] = rndOnlyChambers;
    

            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(compatibilityInfo)}`);
            res.status(200).json(compatibilityInfo);


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
	
	 validateChamberPosition : async(req, res, next) =>{

        logger.debug('Controller method chambers -> validateChamberPosition');

        try{

            const selected_chamberId = req.value.body.selected_chamberId;
            const selected_facet_name = req.value.body.selected_facet_name;
			const platformId = req.value.body.platformId;
           
            logger.debug(`request body : ${JSON.stringify(req.value.body)}`);
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
			
			const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
			
			const opRequest=req.value.body;
			let chamberConfigurationArray =opRequest.configuration;
			logger.debug(`chamber config body : ${JSON.stringify(chamberConfigurationArray)}`);
			
			const chamberIdsTmp = new sql.Table();
            chamberIdsTmp.columns.add('id', sql.Int);
            for(let chamberData of chamberConfigurationArray)
            {
                chamberIdsTmp.rows.add(chamberData.chamberIds); 
            }
			
			let request2 =  pool.request();
			logger.debug(`will execute stored procedure spGetProductsValidNonRndV2`);  
			request2.input('SelectedChambersIdList', chamberIdsTmp);
			logger.debug(`SelectedChambersIdList : ${JSON.stringify(chamberIdsTmp)}`);


            request2.input('SelectedPlatformId', platformId);
            let result = await request2.execute('spGetProductsValidNonRndV2');
            let products = result.recordset;
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            logger.debug(`products : ${JSON.stringify(result.recordset)}`);
			
			 if(products.length == 0)
            {
                const request3 =  pool.request();
                logger.trace(`since no valid products were found, attempting to retrieve rndOnlyProducts`);
                logger.debug(`will execute stored procedure spGetProductsRndOnlyV2`);
                request3.input('SelectedChambersIdList', chamberIdsTmp);
                request3.input('SelectedPlatformId', platformId);
                request3.input('IncludeValidNonRndProductsNotHavingEnoughChamberSelectionsYet', true);
                result = await request3.execute('spGetProductsRndOnlyV2');
                products = result.recordset;
                logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
                logger.debug(`products : ${JSON.stringify(result.recordset)}`);

            }
			
			const request4 =  pool.request();
            logger.debug(`will execute stored procedure spGetAllFacetsForPlatform @SelectedPlatformId =  ${platformId}`);
            request4.input('PlatformId', platformId);
            result = await request4.execute('spGetAllFacetsForPlatform');
            const facets = result.recordset;
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            logger.debug(`facets : ${JSON.stringify(result.recordset)}`);
			
			
			
           //console.log('all facets for platform ' + platformId + ' - ' + facets);
           logger.debug(`begin iterating products...`);
            for(var product of products)
            {      
                logger.debug(`product name : ${product.product_name}`);          
                product['model_svg_url'] = process.env.CLIENT_ASSETS_BASE_URI +  product['model_svg_filename'];
                logger.trace(`product model_svg_url set to : ${product.model_svg_url}`);
                product['configuration'] = new Array();
                logger.trace(`product configuration set to new Array()`);
                for(var facet of facets)
                {
                    const config = new Object();
                    config['facet_name'] = facet.facet_name;
                    config['chamber_name'] = '';
                    product.configuration.push(config);
                }
                logger.trace(`product configuration pushed config objects(initialised) with only facet_names : ${JSON.stringify(product.configuration)}`);

                let request5 =  pool.request();
                 logger.debug(`will execute stored procedure spGetFacetChamberMappingsForProductConfiguration @ProductConfigId =  ${product.nearest_product_config_id}`);
                 request5.input('ProductConfigId', product.nearest_product_config_id);
                 result = await request5.execute('spGetFacetChamberMappingsForProductConfiguration');
                 let masterConfigurationOfProduct = result.recordset;
                 logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
                 logger.debug(`masterConfigurationOfProduct : ${JSON.stringify(result.recordset)}`);
				 
				 
				let notFoundInMostMatchingConfigurationChamberIds = new Array();
                 logger.trace(`notFoundInMostMatchingConfigurationChamberIds initialised to new Array for the current product`);
                 logger.trace(`will iterate through the chamberIds array to find out fitting chamberIds and fit them in the current productConfig's facet-chamber configuration array`);
                for(let i=0; i<chamberConfigurationArray.length;i++)
                {
                    let chamberId = chamberConfigurationArray[i].chamberIds;

                    let firstMatchingConfig = masterConfigurationOfProduct.find(config => config.chamber_id == chamberId);
                    if(firstMatchingConfig)
                    {
                        logger.trace(`masterConfiguration ${firstMatchingConfig} matched chamberId for fitting ${chamberId}`);
                        const index = product.configuration.findIndex(config => config.facet_name == firstMatchingConfig.facet_name);
                        if(index >= 0)
                        {
                            logger.debug(`found available facet chamberId for fitting ${chamberId}`);
                            product.configuration[index].chamber_name = firstMatchingConfig.chamber_name;
                        }
                        masterConfigurationOfProduct = masterConfigurationOfProduct.filter(value => value.facet_name != firstMatchingConfig.facet_name);
                    }
                    else
                    {
                        logger.debug(`Not found chamberId for fitting ${chamberId}, will add it to array notFoundInMostMatchingConfigurationChamberIds`);
                        notFoundInMostMatchingConfigurationChamberIds.push(chamberId);
                    }
                        
                }
				
				
				if(notFoundInMostMatchingConfigurationChamberIds.length > 0)
                {
                    logger.debug(`notFoundInMostMatchingConfigurationChamberIds is not empty , so will process it`);
                    const siblingConfigIdChamberIdsList = new sql.Table('IdList');
                    siblingConfigIdChamberIdsList.columns.add('id', sql.Int);
                    for(let chamberId of notFoundInMostMatchingConfigurationChamberIds)
                    {
                        siblingConfigIdChamberIdsList.rows.add(chamberId);
                    }

                    let request6 =  pool.request();
                    logger.debug(`will execute stored procedure spGetFacetChamberMappingsForProductConfiguration @ProductConfigId =  ${product.nearest_product_config_id}, @ChamberIdList = ${notFoundInMostMatchingConfigurationChamberIds}`);
                    request6.input('ProductConfigId', product.nearest_product_config_id);
                    request6.input('ChamberIdList', siblingConfigIdChamberIdsList);
                    result = await request6.execute('spGetFacetChamberMappingsFromCorrespondingEntireG2Matrix');
                    let facetChamberPossibleConfigurations = result.recordset;
                    logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
                    logger.debug(`facetChamberPossibleConfigurations : ${JSON.stringify(facetChamberPossibleConfigurations)}`);

                    logger.debug(`will iterate thru notFoundInMostMatchingConfigurationChamberIds`);
                    for(let i=0; i<notFoundInMostMatchingConfigurationChamberIds.length;i++)
                    {
                        let chamberId = notFoundInMostMatchingConfigurationChamberIds[i];

                        //trying to fit any one of the facetChamberPossibilities for the current extra-terrestial chamberId (:D)
                        let facetChamberPossibilities = facetChamberPossibleConfigurations.filter(facetChamber => facetChamber.chamber_id == chamberId);
                        for(var facetChamberPossibility of facetChamberPossibilities)
                        {
                            logger.debug(`trying to fit chamberId  facetChamberPossibility.chamber_name = ${facetChamberPossibility.chamber_name}    facetChamberPossibility.facet_name = ${facetChamberPossibility.facet_name} `);


                            const index = product.configuration.findIndex(config =>  config.chamber_name == '' && config.facet_name == facetChamberPossibility.facet_name);
                            if(index >= 0)
                            {
                                logger.debug(`vacant place found in main configuration for chamberId ${chamberId}`);

                                product.configuration[index].chamber_name = facetChamberPossibility.chamber_name;
                                facetChamberPossibleConfigurations = facetChamberPossibleConfigurations.filter(value => value.facet_name != facetChamberPossibility.facet_name);
                                break;
                            }
                            else
                            {
                                logger.debug(`vacant place not found in main configuration for chamberId ${chamberId}`);

                            }
                            
                        }
                       
                       
                    }
                }

    
            }

            logger.trace(`products count before de-duplication process - ${products.length}`);
            let reduced_products = _.map(products, function(product, index){
                return {index : index, uniqueByProperties : JSON.stringify({ product_code : product.product_code , configuration : product.configuration}) }
            });

            logger.trace(`reduced_products_1 \n\t ${JSON.stringify(reduced_products)}`);
    
            reduced_products = _.uniq(reduced_products, 'uniqueByProperties');

            logger.trace(`reduced_products_2 \n\t ${reduced_products}`);


            const unique_indices = _.map(reduced_products, 'index');

            logger.trace(`unique_indices \n\t ${JSON.stringify(unique_indices)}`);


            const deduplicated_products = new Array();
               for(let unique_index of unique_indices)
               {
                deduplicated_products.push(products[unique_index]);
               }
			
			const producttmp= new sql.Table();
			producttmp.columns.add('id',sql.Int);
			  for(let productData of deduplicated_products)
			    {
				producttmp.rows.add(productData.nearest_product_config_id);
			    }
			
			let request7 =  pool.request();
				logger.debug(`will execute stored procedure spGetMatchingFacetNamesForSelectedChamberId`);
				request7.input('ProductConfigIdNo',producttmp);
				request7.input('SelectedChamberId',selected_chamberId);
				request7.input('platformId', platformId);
				
				logger.debug(`ProductConfigIdNo : ${JSON.stringify(producttmp)}`);
				logger.debug(`SelectedChamberId : ${JSON.stringify(selected_chamberId)}`);
				logger.debug(`platformId : ${JSON.stringify(platformId)}`);
				
				
				result = await request7.execute('spGetMatchingFacetNamesForSelectedChamberId'); 
                let facetFetch= result.recordset;	
				
				logger.debug(`facetFetch: ${JSON.stringify(facetFetch)}`);
				
				const facetRequest= new Array();
				for(i=0;i<chamberConfigurationArray.length;i++)
			
				{
					facetRequest.push(chamberConfigurationArray[i].facet_name);
					
				}
				logger.debug(`facetFetchRequest: ${JSON.stringify(facetRequest)}`);
				
				
				
				
				const facetProductResult= new Array();
				for(i=0;i<facetFetch.length;i++)
			
				{
					facetProductResult.push(facetFetch[i].Facetname);
					
				}
				
			
				logger.debug(`facetFetchResult : ${JSON.stringify(facetProductResult)}`);
				
				const FacetfitPosition= new Array();
				
				for(i=0; i<facetProductResult.length; i++)
				{
					var found=false;
					for(j=0; j<facetRequest.length; j++)
					{
						
						if(facetProductResult[i]== facetRequest[j]){
							
						 found=true;
						 break;
						}					
											
					}
					if(found==false){
					FacetfitPosition.push(facetProductResult[i]);
					}
				}
				
				logger.debug(`facetFetchResult : ${JSON.stringify(FacetfitPosition)}`);
				
											
				 if(FacetfitPosition.length >0){
					 res.status(200).json({sucess: true});
				 }
				 else{
					 res.status(200).json({sucess: false});
				 }
				 
				 

			      
            logger.trace(`will close sql connection`);
            sql.close();
			logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(deduplicated_products)}`);
		
		
			
			
            
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
	
	
	addCoreDataToG3MapperPlatformLink: async(req, res, next) =>{

        logger.debug('Controller method chambers -> addCoreDataToG3MapperPlatformLink');

        try{
            const platformId = req.query['platformId'];
			const modification = req.value.body;

            logger.debug(`platform id  : ${platformId}`);
           
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            request.input('id', platformId);
			request.input('CorePlatformId', modification.core_platform_id);
            result = await request.execute('spAddCoreDataToG3MapperLink');
            
            logger.debug(`executed procedure result : ${JSON.stringify(result.recordset)}`);
          

                       
            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify({success : true})}`);
            
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
	
	  getCoreDataToMapperPlatformDetails :  async(req, res, next) =>{

        logger.debug('Controller method chambers -> getCoreDataToMapperPlatformDetails');

        try {
			
            const platformId = req.query['platformId'];
            
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request1 =  pool.request();

            request1.input('PlatformId', platformId);

            logger.debug(`will execute stored procedure spGetCoreDataToMapperLinkDetails`);

            result = await request1.execute('spGetCoreDataToMapperLinkDetails');
            
            logger.debug(`executed procedure result1 : ${JSON.stringify(result)}`);
            
            let response = result.recordset;	

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
	
	
	
	
	
};




function arrayUnique(array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
}
