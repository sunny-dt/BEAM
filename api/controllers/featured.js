
const {config, sql} = require('../helpers/db-config-helper');
const {logger} = require('../helpers/logging-helper');
const subpaths = require('../helpers/assests-subpaths');

module.exports = {

    //Validation DONE
    index : async (req, res, next) =>{
        
        logger.debug(`Controller method featured -> index`);

        if(Object.keys(req.query).length <= 0)
        {
            try{
                logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
                const pool = await new sql.ConnectionPool(config).connect();
                logger.trace(`connected to mssql, will create request and execute query`);
                let request =  pool.request();
                let featured = await request.query`select id, ui_type, linked_element_type, linked_element_id, type_title, title, sub_title, image_link, image_filename, created_by_id, created_by_name, modified_by_id, modified_by_name, c_date, m_date, serial_order, tile_bg_color, tile_fg_color, url from Featured`;
                logger.debug(`executed query, result : ${JSON.stringify(featured)}`);
                logger.trace(`closing sql connection`);
                sql.close();
                
                res.status(200).json(featured.recordset);
           }
           catch(error)
           {
                logger.error(error);
                logger.trace(`error caught, closing sql connection`);
                sql.close();
                logger.debug(`sql connection closed, sending 500 error response to client`);
                res.status(500).send(error.name || '');
           }
    
        }
        else
        {
            try {

                logger.debug(`find featured query params  : ${JSON.stringify(req.query)}`);
                logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
                const pool = await new sql.ConnectionPool(config).connect();
                logger.trace(`connected to mssql, will create request`);
                let request =  pool.request();
        
                logger.debug(`will execute stored procedure spFindFeatured with`);
        
                for (var queryParamName in req.query) {
                    if (req.query.hasOwnProperty(queryParamName)) {
        
                        
                        switch(queryParamName.toLowerCase())
                        {
                            case 'filter':
                            {
                                request.input('Id', parseInt(req.query[queryParamName]) || 0);
                                logger.debug('@Id', parseInt(req.query[queryParamName]) || 0);
        
                                request.input('LinkedElementId', parseInt(req.query[queryParamName]) || 0);
                                logger.debug('@LinkedElementId', parseInt(req.query[queryParamName]) || 0);

                                request.input('LinkedElementType',  req.query[queryParamName]);
                                logger.debug('@LinkedElementType', req.query[queryParamName]);

                                request.input('TypeTitle',  req.query[queryParamName]);
                                logger.debug('@TypeTitle', req.query[queryParamName]);
        
                                request.input('Title',  req.query[queryParamName]);
                                logger.debug('@Title', req.query[queryParamName]);

                                request.input('Subtitle',  req.query[queryParamName]);
                                logger.debug('@Subtitle', req.query[queryParamName]);

                                request.input('ImageLink',  req.query[queryParamName]);
                                logger.debug('@ImageLink', req.query[queryParamName]);
                               
                                request.input('CreatedById', parseInt(req.query[queryParamName]) || 0);
                                logger.debug('@CreatedById', parseInt(req.query[queryParamName]) || 0);

                                request.input('CreatedByName',  req.query[queryParamName]);
                                logger.debug('@CreatedByName', req.query[queryParamName]);

                                request.input('ModifiedById', parseInt(req.query[queryParamName]) || 0);
                                logger.debug('@ModifiedById', parseInt(req.query[queryParamName]) || 0);

                                request.input('ModifiedByName',  req.query[queryParamName]);
                                logger.debug('@ModifiedByName', req.query[queryParamName]);

                                request.input('SerialOrder', parseInt(req.query[queryParamName]) || 0);
                                logger.debug('@SerialOrder', parseInt(req.query[queryParamName]) || 0);
								
								
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
                                    case 'linked_element_id':
                                    case 'linked_element_type':
                                    case 'type_title':
                                    case 'title':
                                    case 'sub_title':
                                    case 'image_link':
                                    case 'created_by_id':
                                    case 'created_by_name':
                                    case 'modified_by_id':
                                    case 'modified_by_name':
                                    case 'serial_order':
                                    case 'c_date':
                                    case 'm_date':
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

                            case 'ui_type':
                            {
                                request.input('UiType',  req.query[queryParamName]);
                                logger.debug('@UiType', req.query[queryParamName]);
                                break;
                            }
                        }
                        
                    }
                }
        
                
                result = await request.execute('spFindFeatured');
                
                logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
                let featured = result.recordset;

                
                logger.trace(`subpaths FEATURED_FILES `, subpaths.FEATURED_FILES);

                featured = featured.map(({TotalCount, ROWNUM, id, ui_type, linked_element_type, linked_element_id, type_title, title, sub_title, image_link, image_filename, created_by_id, created_by_name, modified_by_id, modified_by_name, c_date,m_date, serial_order, tile_bg_color, tile_fg_color, url}) => ({id, ui_type, linked_element_type, linked_element_id, type_title, title, sub_title, image_link, image_filename, created_by_id, created_by_name, modified_by_id, modified_by_name, c_date,m_date, serial_order, tile_bg_color, tile_fg_color, url}));
                featured.forEach(f => {
                    
                    f["image_link"] =  process.env.CLIENT_ASSETS_BASE_URI+ subpaths.FEATURED_FILES +  f.image_filename
                });
                const totalCount = result.recordset.length > 0 ? result.recordset[0]['TotalCount'] : 0 ;
                const response = {totalCount : totalCount, items : featured};
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
        }
    },

    //Validation DONE
    newFeatured: async (req, res, next) =>{

        logger.debug('Controller method featured -> newFeatured');

        try{

            const newFeaturedBody = req.value.body;
            logger.debug(`add Featured request body  : ${JSON.stringify(req.value.body)}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            // logger.debug(`will query for the existence of the featured in the db`);

            // let result = await request.query`select count(*) as count from G2ProductType where name=${newG2ProductBody.name} OR rnd_product_name=${newG2ProductBody.rnd_product_name} OR rnd_product_code=${newG2ProductBody.rnd_product_code}`;
            // logger.debug(`executed query, result : ${JSON.stringify(result.recordset)}`);
            // const count = result.recordset[0].count;

            // if(count > 0)
            // {
            //     const message = "A g2product with the supplied values already exists.";
            //     logger.trace(`${message} aborting and closing sql conn`);
            //     sql.close();
            //     logger.debug(`sql connection closed, sending 409  response to client`);
    
            //     res.status(409).send(message);
            //     return;
            // }
           

            // request =  pool.request();






            logger.debug(`will execute stored procedure spAddFeatured @UiType =  ${newFeaturedBody.ui_type}, @LinkedElementType = ${newFeaturedBody.linked_element_type}, @LinkedElementId=${newFeaturedBody.linked_element_id}, @TypeTitle=${newFeaturedBody.type_title}, @Title=${newFeaturedBody.title}, @Subtitle=${newFeaturedBody.sub_title}, @ImageLink=${newFeaturedBody.image_link}, @SerialOrder=${newFeaturedBody.serial_order}, @TileBgColor=${newFeaturedBody.tile_bg_color}, @TileFgColor=${newFeaturedBody.tile_fg_color} @CreatedById=${req.user.employeeID || ''}, @CreatedByName=${req.user.firstname || ''} ${req.user.lastname || ''} `);
            request.input('UiType', newFeaturedBody.ui_type);
            request.input('LinkedElementType', newFeaturedBody.linked_element_type);
            request.input('LinkedElementId', newFeaturedBody.linked_element_id);
            request.input('TypeTitle', newFeaturedBody.type_title);
            request.input('Title', newFeaturedBody.title);
            request.input('Subtitle', newFeaturedBody.sub_title);
            request.input('ImageLink', '');
            request.input('ImageFilename', newFeaturedBody.image_filename);

            request.input('SerialOrder', newFeaturedBody.serial_order);
            request.input('TileBgColor', newFeaturedBody.tile_bg_color);
            request.input('TileFgColor', newFeaturedBody.tile_fg_color);
			request.input('WebUrl',newFeaturedBody.url);

            request.output('FeaturedCreatedId', sql.Int, 0);

            request.input('CreatedById', `${req.user.employeeID || ''}`);
            request.input('CreatedByName', `${req.user.firstname || ''} ${req.user.lastname || ''}`);

            
            
            result = await request.execute('spAddFeatured');

            const featureId = request.parameters.FeaturedCreatedId.value;
            
            
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            logger.trace(`featureId (request.parameters.FeaturedCreatedId.value)  : ${featureId}`);

            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify({success : true})}`);
            res.status(201).json({success : true});

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
    updateFeatured: async(req, res, next) =>{
        
        logger.debug('Controller method featured -> updateFeatured');
        try{

            const {featuredId} = req.value.params;
            const modifications = req.value.body;

            logger.debug(`update featured id  : ${featuredId}`);
            logger.debug(`update featuredId request body  : ${JSON.stringify(req.value.body)}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            // logger.debug(`will query for the existence of other g2product in the db having same values`);

            // let result = await request.query`select count(*) as count from G2ProductType where id <> ${g2productId} and (name=${modifications.name} OR rnd_product_name=${modifications.rnd_product_name} OR rnd_product_code=${modifications.rnd_product_code})`;
            // logger.debug(`executed query, result : ${JSON.stringify(result.recordset)}`);
            // const count = result.recordset[0].count;

            // if(count > 0)
            // {
            //     const message = "No two g2products can have same value for name, r&d product name or r&d product code";
            //     logger.trace(`${message} aborting and closing sql conn`);
            //     sql.close();
            //     logger.debug(`sql connection closed, sending 409  response to client`);
    
            //     res.status(409).send(message);
            //     return;
            // }

            // request = pool.request();



            logger.debug(`will execute stored procedure spUpdateFeatured @Id=${featuredId} @UiType =  ${modifications.ui_type}, @LinkedElementType = ${modifications.linked_element_type}, @LinkedElementId=${modifications.linked_element_id}, @TypeTitle=${modifications.type_title}, @Title=${modifications.title}, @Subtitle=${modifications.sub_title}, @ImageLink=${modifications.image_link}, @SerialOrder=${modifications.serial_order}, @TileBgColor=${modifications.tile_bg_color}, @TileFgColor=${modifications.tile_fg_color} @ModifiedById=${req.user.employeeID || ''}, @ModifiedByName=${req.user.firstname || ''} ${req.user.lastname || ''}`);
            request.input('Id', featuredId);
            request.input('UiType', modifications.ui_type);
            request.input('LinkedElementType', modifications.linked_element_type);
            request.input('LinkedElementId', modifications.linked_element_id);
            request.input('TypeTitle', modifications.type_title);
            request.input('Title', modifications.title);
            request.input('Subtitle', modifications.sub_title);
            request.input('ImageLink', '');
            request.input('ImageFilename', modifications.image_filename);

            request.input('SerialOrder', modifications.serial_order);
            request.input('TileBgColor', modifications.tile_bg_color);
            request.input('TileFgColor', modifications.tile_fg_color);
			request.input('WebUrl', modifications.url);

            request.input('ModifiedById', `${req.user.employeeID || ''}`);
            request.input('ModifiedByName', `${req.user.firstname || ''} ${req.user.lastname || ''}`);
            
            result = await request.execute('spUpdateFeatured');
            
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
    removeFeatured: async(req, res, next) =>{
        
        logger.debug('Controller method featured -> removeFeatured');

        try{
            const {featuredId} = req.value.params;
            logger.debug(`delete featured id  : ${featuredId}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            // logger.debug(`will query for the existence of g3products in the db having dependency on this g2product`);
            // logger.debug(`will execute stored procedure spGetG2ProductDependentsCount @G2ProductId=${g2productId}`);
            // request.input('G2ProductId', g2productId);
            // result = await request.execute('spGetG2ProductDependentsCount');
            
            // logger.debug(`executed procedure result : ${JSON.stringify(result.recordset)}`);

            // if(result.recordset[0]['dependents_count'] > 0)
            // {
            //     const message = `There ${result.recordset[0]['dependents_count'] <= 1 ? 'is' : 'are'} ${result.recordset[0]['dependents_count']} G3 Products dependent on this G2 Product. Please delete ${result.recordset[0]['dependents_count'] <= 1 ? 'it' : 'them'} first.`;
            //     logger.trace(`${message} aborting and closing sql conn`);
            //     sql.close();
            //     logger.debug(`sql connection closed, sending 409  response to client`);
    
            //     res.status(409).send(message);
            //     return;
            // }


            // request =  pool.request();

            logger.debug(`will execute stored procedure spDeleteFeatured @Id=${featuredId}`);
            request.input('Id', featuredId);
            result = await request.execute('spDeleteFeatured');
            
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

     }
};