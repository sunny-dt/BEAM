
const {config, sql} = require('../helpers/db-config-helper');
const {logger} = require('../helpers/logging-helper');
const fs = require('fs');
const subpaths = require('../helpers/assests-subpaths');

module.exports = {

    //Validation DONE
    index : async (req, res, next) =>{
        
        logger.debug(`Controller method platforms -> index`);

        if(Object.keys(req.query).length <= 0)
        {
            try{
                logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
                const pool = await new sql.ConnectionPool(config).connect();
                logger.trace(`connected to mssql, will create request and execute query`);
                let request =  pool.request();
                let platforms = await request.execute('spMapperGetPlatformDetails');
                logger.debug(`executed query, result : ${JSON.stringify(platforms)}`);
                
                logger.debug(`appending base client-assets http path for platforms model filename`);
                for(let platform of platforms.recordset)
                {
                    platform["model_svg_url"] = process.env.CLIENT_ASSETS_BASE_URI + subpaths.SVG_FILES +  platform.model_svg_filename;
                }

                logger.trace(`closing sql connection`);
                sql.close();
                logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(platforms.recordset)}`);
                res.status(200).json(platforms.recordset);
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

                logger.debug(`find platform query params  : ${JSON.stringify(req.query)}`);
                logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
                const pool = await new sql.ConnectionPool(config).connect();
                logger.trace(`connected to mssql, will create request`);
                let request =  pool.request();
        
                logger.debug(`will execute stored procedure spFindPlatforms with`);
        
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
                        }
                        
                    }
                }
        
                
                result = await request.execute('spFindPlatforms');
                
                logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
                let platforms = result.recordset;

                logger.debug(`appending base client-assets http path for platforms model filename`);
                for(let platform of platforms)
                {
                    platform["model_svg_url"] = process.env.CLIENT_ASSETS_BASE_URI + subpaths.SVG_FILES +  platform.model_svg_filename;
                }


                platforms = platforms.map(({TotalCount, ROWNUM, id, name,model_svg_filename, model_svg_url, facets_count, min_facetgroups_count}) => ({id, name,model_svg_filename, model_svg_url, facets_count, min_facetgroups_count}));
                const totalCount = result.recordset.length > 0 ? result.recordset[0]['TotalCount'] : 0 ;
                const response = {totalCount : totalCount, items : platforms};


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

    platformsDetailed : async (req, res, next) =>{

        const response = {
            totalCount : 4,
            items : [
                {
                    id : 1,
                    platform_id : 1,
                    name : "Endura2",
                    short_description_text : "Platform Endura 2",
                     image_link: "https://www.digitaas.io/amatg3mapper/client-assets/platform_details/8a416ec7-a2f1-5008-8ea6-b4607298f329.png",
                     image_filename : "8a416ec7-a2f1-5008-8ea6-b4607298f329.png",
                     created_by_id: "xx3ffhs",
                     created_by_name: "John Doe",
                     modified_by_id: null,
                     modified_by_name: null,
                     c_date: "2019-06-03T11:32:57.460Z",
                     m_date: "2019-06-03T11:32:57.460Z",
                     serial_order: 1
                },
                {
                    platform_id : 10,
                    name : "Endura2 UHV",
                    short_description_text : "Platform Endura2 UHV",
                    image_link: "https://www.digitaas.io/amatg3mapper/client-assets/platform_details/8a416ec7-a2f1-5008-8ea6-b4607298f329.png",
                    image_filename : "8a416ec7-a2f1-5008-8ea6-b4607298f329.png",
                    created_by_id: "xx3ffhs",
                    created_by_name: "John Doe",
                    modified_by_id: null,
                    modified_by_name: null,
                    c_date: "2019-06-03T11:32:57.460Z",
                    m_date: "2019-06-03T11:32:57.460Z",
                    serial_order: 2
                },
                {
                    platform_id : 15,
                    name : "Centura ACP",
                    short_description_text : "Platform Centura ACP",
                    image_link: "https://www.digitaas.io/amatg3mapper/client-assets/platform_details/e896c15b-cef3-5b2e-9492-dec4c219b060.png",
                    image_filename : "e896c15b-cef3-5b2e-9492-dec4c219b060.png",
                    created_by_id: "xx3ffhs",
                    created_by_name: "John Doe",
                    modified_by_id: null,
                    modified_by_name: null,
                    c_date: "2019-06-03T11:32:57.460Z",
                    m_date: "2019-06-03T11:32:57.460Z",
                    serial_order: 3
                },
                {
                    platform_id : 16,
                    name : "Producer Metal",
                    short_description_text : "Platform Producer Metal",
                    image_link: "https://www.digitaas.io/amatg3mapper/client-assets/platform_details/e678b112-39d4-525e-abcd-25ad782770d8.png",
                    image_filename : "e678b112-39d4-525e-abcd-25ad782770d8.png",
                    created_by_id: "xx3ffhs",
                    created_by_name: "John Doe",
                    modified_by_id: null,
                    modified_by_name: null,
                    c_date: "2019-06-03T11:32:57.460Z",
                    m_date: "2019-06-03T11:32:57.460Z",
                    serial_order: 4
                }
            ]
        }
        res.status(200).json(response);
    },

    //Validation DONE
    newPlatform: async (req, res, next) =>{

        logger.debug('Controller method platforms -> newPlatform');

        try{

            const newPlatformBody = req.value.body;
            logger.debug(`add platform request body  : ${JSON.stringify(req.value.body)}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();
                    
            
            request.input('Id', newPlatformBody.id);
            result = await request.execute('spAddPlatform');
			
            let reValue = result.returnValue;
			logger.debug(`return values  : ${JSON.stringify(reValue)}`);
			logger.debug(`return recordset  : ${JSON.stringify(result.recordset)}`);

            if(reValue == 1)
            {
			
            let resp1  = await request.query`select id, name, svg_image from [dbo].[BuilderPlatformFamily] where id =${result.recordset[0].id}`;
			const data = resp1.recordset;
			
            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(resp1)}`);
            res.status(200).json(data);
            }
            else {

             const resp = { sucess : false };
            
            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(resp)}`);
            res.status(200).json(resp);

            
           }

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
    // getPlatform: async(req, res, next) =>{
    //     const {platformId} = req.value.params;
    //     const platform = await Platform.findById(platformId);
    //     if(!platform)
    //     {
    //         return res.status(404).json({
    //             error: {
    //                 message: "The specified platform doesn't exist"
    //             }
    //         });
    //     }
    //     res.status(200).json(platform);
    // },

    // //Validation DONE
    // replacePlatform: async(req, res, next) =>{
    //     const {platformId} = req.value.params;
    //     const newPlatform = req.value.body;
    //     const result = await Platform.findByIdAndUpdate(platformId, newPlatform);
    //     res.status(200).json({success : true});
    // },

    //Validation DONE
    updatePlatform: async(req, res, next) =>{
        
        logger.debug('Controller method platforms -> updatePlatform');
        try{

            const {platformId} = req.value.params;
            const modifications = req.value.body;

            logger.debug(`update platform id  : ${platformId}`);
            logger.debug(`update platform request body  : ${JSON.stringify(req.value.body)}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            logger.debug(`will query for the existence of other platform in the db having same values`);

            let result = await request.query`select count(*) as count from Platform where id <> ${platformId} and name=${modifications.name}`;
            logger.debug(`executed query, result : ${JSON.stringify(result.recordset)}`);
            const count = result.recordset[0].count;

            if(count > 0)
            {
                const message = "No two platforms can have same value for name";
                logger.trace(`${message} aborting and closing sql conn`);
                sql.close();
                logger.debug(`sql connection closed, sending 409  response to client`);
    
                res.status(409).send(message);
                return;
            }

            request = pool.request();
            logger.debug(`will execute stored procedure spUpdatePlatform @Id=${platformId} @Name =  ${modifications.name}, @ModelSvgFilename=${modifications.model_svg_filename}`);
            request.input('Id', platformId);
            request.input('Name', modifications.name);
            request.input('ModelSvgFilename', modifications.model_svg_filename);
            
            result = await request.execute('spUpdatePlatform');
            
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
    removePlatform: async(req, res, next) =>{
        
        logger.debug('Controller method platforms -> removePlatform');

        try{
            const {platformId} = req.value.params;
            logger.debug(`delete platform id  : ${platformId}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
			
			let mapperChamberRequest = pool.request();
			let mapperChamberResult = await mapperChamberRequest.query`select count(*) as count from Chamber where platform_id=${platformId}`;
			logger.debug(`executed query, mapperChamberResult : ${JSON.stringify(mapperChamberResult.recordset)}`);
			const mapperChambercount = mapperChamberResult.recordset[0].count;
			
			if(mapperChambercount > 0)
			{
				const message = `There ${mapperChambercount <= 1 ? 'is' : 'are'} ${mapperChambercount} Chamber dependent on this platform. Please delete ${mapperChambercount <= 1 ? 'it' : 'them'} first.`;
				logger.trace(`${message} aborting and closing sql conn`);
				sql.close();
				logger.debug(`sql connection closed, sending 409  response to client`);

				res.status(409).send(message);
				return;
			}
		
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            logger.debug(`will query for the existence of Facets and G2ProductTypes in the db having dependency on this platform`);
            logger.debug(`will execute stored procedure spGetPlatformDependentG2ProductCount @PlatformId=${platformId}`);
            request.input('PlatformId', platformId);
            let result = await request.execute('spGetPlatformDependentG2ProductCount');
            
            logger.debug(`executed procedure result : ${JSON.stringify(result.recordset)}`);

            if(result.recordset[0]['dependents_count'] > 0)
            {
                const message = `There ${result.recordset[0]['dependents_count'] <= 1 ? 'is' : 'are'} ${result.recordset[0]['dependents_count']} G2ProductTypes dependent on this platform. Please delete ${result.recordset[0]['dependents_count'] <= 1 ? 'it' : 'them'} first.`;
                logger.trace(`${message} aborting and closing sql conn`);
                sql.close();
                logger.debug(`sql connection closed, sending 409  response to client`);
    
                res.status(409).send(message);
                return;
            }


            request1 =  pool.request();
            logger.debug(`will execute query select * from MapperPlatform where platform_id = ${platformId}`);
             result1 = await request1.query`select * from MapperPlatform where platform_id = ${platformId}`;
            logger.debug(`executed query, result1 : ${JSON.stringify(result1)}`);
            const platformToDelete = result1.recordset[0];

            request2 =  pool.request();
            logger.debug(`will execute stored procedure spDeletePlatform @Id=${platformId}`);
            request2.input('Id', platformId);
            result2 = await request2.execute('spDeletePlatform');
            
            logger.debug(`executed procedure result2 : ${JSON.stringify(result2)}`);
            

            //delete the platform model_svg_image url also

            logger.debug(`will delete model svg with name = ${platformToDelete.model_svg_filename}`);
            const path = '../client-assets/' + platformToDelete.model_svg_filename;

            //asynchronous
            fs.unlink(path, (err) => {
                if (err) {
                    logger.error(err);
                    return
                }
                logger.debug(`svg file deleted successfully`);
            })


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

   

    getPlatformChambers : async(req, res, next) =>{

        logger.debug('Controller method platforms -> getPlatformChambers');

        try
        {
            const {platformId} = req.value.params;
            logger.debug(`params passed : ${JSON.stringify(req.value.params)}`);
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();
            logger.debug(`will execute stored procedure spGetChambersByPlatformId @SelectedPlatformId =  ${platformId}`);
            request.input('SelectedPlatformId', platformId);
            result = await request.execute('spGetChambersByPlatformId');
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            const chambers = result.recordset;
            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(chambers)}`);
            res.status(200).json(chambers);
        }
        catch
        {
            logger.error(error);
            logger.trace(`error caught, closing sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 500 error response to client`);
            res.status(500).send(error.name || '');

        }
       
    }
};