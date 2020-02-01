
const {config, sql} = require('../helpers/db-config-helper');
const {logger} = require('../helpers/logging-helper');


module.exports = {

    //Validation DONE
    index : async (req, res, next) =>{
        
        logger.debug(`Controller method facets -> index`);

        if(Object.keys(req.query).length <= 0)
        {
            try{
                logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
                const pool = await new sql.ConnectionPool(config).connect();
                logger.trace(`connected to mssql, will create request and execute query`);
                let request =  pool.request();
                let facets = await request.query`select id, name from BuilderFacets`;
                logger.debug(`executed query, result : ${JSON.stringify(facets)}`);
                logger.trace(`closing sql connection`);
                sql.close();
                logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(facets.recordset)}`);
                res.status(200).json(facets.recordset);
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

                logger.debug(`find facet query params  : ${JSON.stringify(req.query)}`);
                logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
                const pool = await new sql.ConnectionPool(config).connect();
                logger.trace(`connected to mssql, will create request`);
                let request =  pool.request();
        
                logger.debug(`will execute stored procedure spFindFacets with`);
        
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

                            case 'platformid':
                            {
                                request.input('PlatformId',  req.query[queryParamName]);
                                logger.debug('@PlatformId', req.query[queryParamName]);
                                break;
                            }
                        }
                        
                    }
                }
        
                
                result = await request.execute('spFindFacets');
                
                logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
                let facets = result.recordset;
				
				logger.debug(`facet resultset : ${JSON.stringify(facets)}`); 
				
				const tomsIndex = facets.findIndex(facet => facet.name == 'A');
                facets.push(...facets.splice(0, tomsIndex));
                   
					
			
				logger.debug(`sorted Faccet : ${JSON.stringify(facets)}`); 
				
                facet = facets.map(({TotalCount, ROWNUM, id, name, platform_id}) => ({id, name, platform_id}));
                const totalCount = result.recordset.length > 0 ? result.recordset[0]['TotalCount'] : 0 ;
                const response = {totalCount : totalCount, items : facet};
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
    newFacet: async (req, res, next) =>{

        logger.debug('Controller method facets -> newFacet');

        try{

            const newFacetBody = req.value.body;
            const platformId = parseInt(req.query['platformId']);

            logger.debug(`add facet request body  : ${JSON.stringify(req.value.body)}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            logger.debug(`will query for the existence of the platform in the db`);

            let result = await request.query`select count(*) as count, facets_count from BuilderPlatformFamily where id=${platformId} group by facets_count`;
            logger.debug(`executed query, result : ${JSON.stringify(result.recordset)}`);
            const count = result.recordset[0].count;
			const totalFacetCount = result.recordset[0].facets_count;

            if(count <= 0)
            {
                const message = "Invalid platform id.";
                logger.trace(`${message} aborting and closing sql conn`);
                sql.close();
                logger.debug(`sql connection closed, sending 409  response to client`);
    
                res.status(409).send(message);
                return;
            }
            
			
			let facetsCountRequest =  pool.request();

            logger.debug(`will query for the existence of the platform in the db`);

            let facetsCountResult = await facetsCountRequest.query`select count(*) as count from BuilderFacetPlatformFamilyMap where platform_family_id =${platformId}`;
            logger.debug(`executed query, facetsCountResult : ${JSON.stringify(facetsCountResult.recordset)}`);
            const facetsCount = facetsCountResult.recordset[0].count;
			
			logger.debug(`executed query, totalFacetCount : ${totalFacetCount}`);
			logger.debug(`executed query, facetsCount : ${facetsCount}`);
			
			if (facetsCount >= totalFacetCount) {
				
				const message = `Allowed Facets are ${totalFacetCount}`;
                logger.trace(`${message} aborting and closing sql conn`);
                sql.close();
                logger.debug(`sql connection closed, sending 409  response to client`);
    
                res.status(409).send(message);
                return;
			}
			
			let request3 =  pool.request();

            let result3 = await request3.query`select count(*) as count, id from BuilderFacets where name = ${newFacetBody.name} group by id `;
			logger.debug(`executed query, result3 : ${JSON.stringify(result3)}`);
			let count1 = 0;
			logger.debug(`executed query, result3 length : ${result3.recordset.length}`);
			if (result3.recordset.length > 0) {
				
				count1 = result3.recordset[0].count;
			}
            
			logger.debug(`executed query, result3 count1 : ${JSON.stringify(count1)}`);
			let facetCountID = 0;

            if(count1 > 0) {
				
				facetCountID = result3.recordset[0].id;
				logger.debug(`executed query, result3 facetCountID : ${facetCountID}`);
            } else {
				
				let addBuilderFacetRequest =  pool.request();
				addBuilderFacetRequest.input('Name', newFacetBody.name);
				addBuilderFacetResult = await addBuilderFacetRequest.execute('spAddBuilderFacet');
				
				logger.debug(`executed procedure spAddBuilderFacet addBuilderFacetResult : ${JSON.stringify(addBuilderFacetResult)}`);
				
				facetCountID = addBuilderFacetResult.recordset[0].id;
			}
				
			logger.debug(`executed query facetCountID : ${JSON.stringify(facetCountID)}`);
			
			if(facetCountID == 0) {

				const message = `Some thing went wrong`;
                logger.trace(`${message} aborting and closing sql conn`);
                sql.close();
                logger.debug(`sql connection closed, sending 409  response to client`);
    
                res.status(409).send(message);
                return;
			}
			
			let request1 =  pool.request();
			request1.input('FacetId', facetCountID);
			request1.input('PlatformId', platformId);
			result1 = await request1.execute('spAddFacet');
			
			logger.debug(`executed procedure result : ${JSON.stringify(result1)}`);
			const facet = result1.recordset;
			logger.trace(`will close sql connection`);
			sql.close();
			logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(facet)}`);
			res.status(200).json(facet);
        }
        catch(error)
        {
            logger.error(error);
            logger.trace(`error caught, closing sql connection`);
            sql.close();

            if(error.class == 16)
            {
				
		        /*const message = "A Facet with the supplied name already exists.";
                logger.trace(`${message} aborting and closing sql conn`);
                sql.close();
                logger.debug(`sql connection closed, sending 409  response to client`);
    
                res.status(409).send(message);
                return;*/
             
            
              
			 
            }
            logger.debug(`sql connection closed, sending 500 error response to client`);

            res.status(500).send(error.message || '');
        }
        
    },

    // //Validation DONE
    // getFacet: async(req, res, next) =>{
    //     const {facetId} = req.value.params;
    //     const facet = await Facet.findById(facetId);
    //     if(!facet)
    //     {
    //         return res.status(404).json({
    //             error: {
    //                 message: "The specified facet doesn't exist"
    //             }
    //         });
    //     }
    //     res.status(200).json(facet);
    // },

    // //Validation DONE
    // replaceFacet: async(req, res, next) =>{
    //     const {facetId} = req.value.params;
    //     const newFacet = req.value.body;
    //     const result = await Facet.findByIdAndUpdate(facetId, newFacet);
    //     res.status(200).json({success : true});
    // },

    //Validation DONE
    updateFacet: async(req, res, next) =>{
        
        logger.debug('Controller method facets -> updateFacet');
        try{

            const {facetId} = req.value.params;
            const modifications = req.value.body;
            const platformId = parseInt(req.query['platformId']);

            logger.debug(`update facet id  : ${facetId}`);
            logger.debug(`update facet request body  : ${JSON.stringify(req.value.body)}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            logger.debug(`will query for the existence of other facets in the db having same values`);

            let result = await request.query`select count(*) as count from BuilderFacets where id <> ${facetId} and (name=${modifications.name})`;
            logger.debug(`executed query, result : ${JSON.stringify(result.recordset)}`);
            const count = result.recordset[0].count;

            if(count > 0)
            {
                const message = "No two facets can have same value for name";
                logger.trace(`${message} aborting and closing sql conn`);
                sql.close();
                logger.debug(`sql connection closed, sending 409  response to client`);
    
                res.status(409).send(message);
                return;
            }


            request =  pool.request();
            logger.debug(`will execute stored procedure spUpdateFacet @Id=${facetId} @Name =  ${modifications.name}`);
            request.input('Id', facetId);
            request.input('Name', modifications.name);

            result = await request.execute('spUpdateFacet');
            
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
    removeFacet: async(req, res, next) =>{
        
        logger.debug('Controller method facets -> removeFacet');

        try{
            const {facetId} = req.value.params;
            const platformId = parseInt(req.query['platformId']);
            logger.debug(`delete facet id  : ${facetId}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            logger.debug(`will query for the existence of ProductConfigs in the db having dependency on this platform`);
            logger.debug(`will execute stored procedure spGetFacetDependentsCount @FacetId=${facetId}, @PlatformId=${platformId}`);
            request.input('FacetId', facetId);
            request.input('PlatformId', platformId);
            result = await request.execute('spGetFacetDependentsCount');
            
            logger.debug(`executed procedure result : ${JSON.stringify(result.recordset)}`);

            if(result.recordset[0]['dependents_count'] > 0)
            {
                const message = `There ${result.recordset[0]['dependents_count'] <= 1 ? 'is' : 'are'} ${result.recordset[0]['dependents_count']} Product Configs dependent on this facet. Please delete ${result.recordset[0]['dependents_count'] <= 1 ? 'it' : 'them'} first.`;
                logger.trace(`${message} aborting and closing sql conn`);
                sql.close();
                logger.debug(`sql connection closed, sending 409  response to client`);
    
                res.status(409).send(message);
                return;
            }


            request =  pool.request();
            logger.debug(`will execute stored procedure spDeleteFacet @Id=${facetId}, @PlatformId=${platformId}`);
            request.input('Id', facetId);
            request.input('PlatformId', platformId);
            result = await request.execute('spDeleteFacet');
            
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
	 
	  getBuilderFacets : async (req, res, next) =>{
        
        logger.debug(`Controller method facets -> getBuilderFacets`);

        if(Object.keys(req.query).length <= 0)
        {
            try{
                logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
                const pool = await new sql.ConnectionPool(config).connect();
                logger.trace(`connected to mssql, will create request and execute query`);
                let request =  pool.request();
                let facets = await request.query`select id, name from BuilderFacets`;
                logger.debug(`executed query, result : ${JSON.stringify(facets)}`);
                logger.trace(`closing sql connection`);
                sql.close();
                logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(facets.recordset)}`);
                res.status(200).json(facets.recordset);
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

                logger.debug(`find facet query params  : ${JSON.stringify(req.query)}`);
                logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
                const pool = await new sql.ConnectionPool(config).connect();
                logger.trace(`connected to mssql, will create request`);
                let request =  pool.request();
        
                
        
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

                            case 'platformid':
                            {
                                request.input('PlatformId',  req.query[queryParamName]);
                                logger.debug('@PlatformId', req.query[queryParamName]);
                                break;
                            }
                        }
                        
                    }
                }
        
                
                result = await request.execute('spFindBuilderFacets');
                
                logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
                let facets = result.recordset;
				
				logger.debug(`facet resultset : ${JSON.stringify(facets)}`); 
				
				const tomsIndex = facets.findIndex(facet => facet.name == 'A');
                facets.push(...facets.splice(0, tomsIndex));                   
					
			
				logger.debug(`sorted Faccet : ${JSON.stringify(facets)}`); 
				
                facet = facets.map(({TotalCount, ROWNUM, id, name, platform_id}) => ({id, name, platform_id}));
                const totalCount = result.recordset.length > 0 ? result.recordset[0]['TotalCount'] : 0 ;
                const response = {totalCount : totalCount, items : facet};
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


};