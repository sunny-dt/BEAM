
const {config, sql} = require('../helpers/db-config-helper');
const {logger} = require('../helpers/logging-helper');
const _ = require('underscore');
const subpaths = require('../helpers/assests-subpaths');


module.exports = {

    //Validation DONE
    getKeywordSuggestions : async (req, res, next) =>{
        
        logger.debug(`Controller method explorersearch -> getKeywordSuggestions`);


        try{

            const partialSearchTerm = req.value.body.partial_search_term;
            const otherSearchTerms = req.value.body.other_search_terms;
            const filters = req.value.body.filters;
            const includeLinks = req.value.body.include_links;
           
            logger.debug(`request body : ${JSON.stringify(req.value.body)}`);
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            
            const otherSearchWordsNameList = new sql.Table();
            otherSearchWordsNameList.columns.add('name', sql.VarChar);
            for(let otherSearchTerm of otherSearchTerms)
            {
                otherSearchWordsNameList.rows.add(otherSearchTerm); 
            }


            const filtersNameList = new sql.Table();
            filtersNameList.columns.add('name', sql.VarChar);
            for(let filter of filters)
            {
               let pFilters =  filter.items.map(i => {
                   if(i.is_active === true)
                   {
                        return filter.category + '|' + i.name;
                   }
                   return '';
                });

                pFilters = pFilters.filter(Boolean);
                for(let pF of pFilters)
                    filtersNameList.rows.add(pF); 
            }


            const suggestions = new Object() ;
            if(partialSearchTerm == '')
            {
                logger.trace(`partial search terms is empty, will abort and return empty results`);

                suggestions['keywords'] = new Array();
                suggestions['links'] = new Array();
            }
            else
            {
                logger.debug(`will execute stored procedure spFindMatchingSearchKeywords @PartialSearchWord =${JSON.stringify(partialSearchTerm)} @OtherSearchWords=${JSON.stringify(otherSearchTerms)}.toTable(NameList), @Filters=${JSON.stringify(filtersNameList)}`);
                const request1 =  pool.request();
                request1.input('OtherSearchWords', otherSearchWordsNameList);
                request1.input('PartialSearchWord', partialSearchTerm);
                request1.input('Filters', filtersNameList);
                let result1 = await request1.execute('spFindMatchingSearchKeywords');
                const keywordSuggestions = result1.recordset;
                logger.debug(`executed procedure result : ${JSON.stringify(result1)}`);
                logger.debug(`keywordSuggestions : ${JSON.stringify(keywordSuggestions)}`);
        
                let linkSuggestions = [];
                if(keywordSuggestions != undefined && keywordSuggestions.length > 0)
                {
                    
                    if(includeLinks != undefined && includeLinks == true)
                    {

                        const keywordSuggestionsNameList = new sql.Table();
                        keywordSuggestionsNameList.columns.add('name', sql.VarChar);
                        for(let ks of keywordSuggestions)
                        {
                            keywordSuggestionsNameList.rows.add(ks.display_term); 
                        }

                        logger.debug(`includeLinks is set to true so will fetch Suggested Node Links as well`);
                        logger.debug(`will execute stored procedure spFindSearchResults with`);
                        const request2 =  pool.request();
                        logger.debug('@SearchWords', `${JSON.stringify(keywordSuggestionsNameList)}`);
                        request2.input('SearchWords',  keywordSuggestionsNameList);
                        logger.debug('@Filters', `${filtersNameList}`);
                        request2.input('Filters',  filtersNameList);
                        logger.debug('@PageNo', 1);
                        request2.input('PageNo', 1);
                        logger.debug('@PageSize',3);
                        request2.input('PageSize', 3);
        
        
                        const result2 = await request2.execute('spFindSearchResults');
                        
                        logger.debug(`executed procedure result2 : ${JSON.stringify(result2)}`);
                        linkSuggestions = result2.recordset;

                        linkSuggestions.forEach(l => {
                            l["tile_image_link"] =  process.env.CLIENT_ASSETS_BASE_URI+ subpaths.FEATURED_FILES +  l.tile_image_filename;
                            l["media_file_url"] =  process.env.CLIENT_ASSETS_BASE_URI+ subpaths.METADATA_MEDIA_FILES +  l.media_filename;
                        });

                        linkSuggestions = linkSuggestions.map(({TotalCount, ROWNUM, WeightedRank, id, name, full_path, description, search_keywords, tile_image_filename, tile_image_link, media_file_url, media_filename}) => ({id, name, full_path, description, tile_image_filename, tile_image_link, media_file_url, media_filename}));
            
                        /// injecting root_path
                        linkSuggestions = linkSuggestions.map(function(r) {
                    let o = Object.assign({}, r);
                    
                    let pathArr = o.full_path.split("|");
                    let rootPathArr = [];
                    if(pathArr.length >= 3)
                    {
                        rootPathArr = [pathArr[1], pathArr[2]];
                        o.root = pathArr[1];
                        o.sub_root = pathArr[2];
                    }
                        
                    else if(pathArr.length >= 2)
                    {
                        rootPathArr[0] = [pathArr[1], ''];
                        o.root = pathArr[1];
                        o.sub_root = '';
                    }
                        

                    o.root_path = rootPathArr.join('/');
                    o.full_path_components = o.full_path.split('|').filter(Boolean);
                    return o;
                });
                



                        logger.debug(`executed procedure results : ${JSON.stringify(linkSuggestions)}`);
                        logger.debug(`suggested node links : ${JSON.stringify(linkSuggestions)}`);
                        
                    }
                }
    
                
    
               
                if(keywordSuggestions != undefined)
                    suggestions['keywords'] = keywordSuggestions;
    
                if(linkSuggestions != undefined)
                    suggestions['links'] = linkSuggestions;
            }
    
            
    

            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(suggestions)}`);
            res.status(200).json(suggestions);


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

    getSearchResults : async (req, res, next) =>{
        
        logger.debug('Controller method explorersearch -> getSearchResults');

        try {

            const findSearchResultsReqBody = req.value.body;
            logger.debug(`add chamber request body  : ${JSON.stringify(req.value.body)}`);
            const searchTerms = findSearchResultsReqBody.search_terms;
            let filters = findSearchResultsReqBody.filters;

            logger.debug(`find search Results query params  : ${JSON.stringify(req.query)}`);
            
            
            let response = {};
            if(searchTerms.length === 0)
            {
                logger.debug(`search terms empty,  returning empty results`);

                response = {totalCount : 0, items : [], filters : []};

            }
            else
            {

                let sortByQueryParamValue = 'relevance';

                logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
                const pool = await new sql.ConnectionPool(config).connect();
                logger.trace(`connected to mssql, will create request`);
                let request =  pool.request();

                logger.debug(`will execute stored procedure spFindSearchResults with`);

                for (var queryParamName in req.query) {
                    if (req.query.hasOwnProperty(queryParamName)) {

                        
                        switch(queryParamName.toLowerCase())
                        {
                            
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
                                    
                                    case 'name':
                                    case 'relevance':
                                    {
                                        sortByQueryParamValue = req.query[queryParamName];
                                        request.input('SortBy',  req.query[queryParamName]);
                                        logger.debug('@SortBy', req.query[queryParamName]);
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

                

                


                const searchWordsNameList = new sql.Table();
                searchWordsNameList.columns.add('name', sql.VarChar);
                for(let searchTerm of searchTerms)
                {
                    searchWordsNameList.rows.add(searchTerm); 
                }

                const filtersNameList = new sql.Table();
                filtersNameList.columns.add('name', sql.VarChar);

                
                for(let filter of filters)
                {
                   let pFilters =  filter.items.map(i => {
                       if(i.is_active === true)
                       {
                            return filter.category + '|' + i.name;
                       }
                       return '';
                    });

                    pFilters = pFilters.filter(Boolean);
                    for(let pF of pFilters)
                        filtersNameList.rows.add(pF); 
                }


                logger.debug('@SearchWords', `${JSON.stringify(searchWordsNameList)}`);
                request.input('SearchWords',  searchWordsNameList);

                logger.debug('@Filters', `${JSON.stringify(filtersNameList)}`);
                request.input('Filters',  filtersNameList);

                result = await request.execute('spFindSearchResults');
                
                logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
                let results = result.recordset;

                results.forEach(result => {
                    
					if (result.tile_image_filename == '' || result.tile_image_filename == null) {
								
						result["tile_image_link"] = '';
					} else {
						
						result["tile_image_link"] =  process.env.CLIENT_ASSETS_BASE_URI+ subpaths.FEATURED_FILES +  result.tile_image_filename;
					}
					
					if (result.media_filename == '' || result.media_filename == null) {
								
						result["media_file_url"] = '';
					} else {
						
						result["media_file_url"] = process.env.CLIENT_ASSETS_BASE_URI + subpaths.METADATA_MEDIA_FILES + 'img/' + result.media_filename;
					}
                    
                });
                
                results = results.map(({TotalCount, ROWNUM, WeightedRank, id, name, full_path, description, search_keywords, tile_image_filename, tile_image_link, media_file_url, media_filename}) => ({id, name, full_path, description, tile_image_filename, tile_image_link, media_file_url, media_filename}));
                
                /// injecting root_path
                results = results.map(function(r) {
                    let o = Object.assign({}, r);
                    
                    let pathArr = o.full_path.split("|");
                    let rootPathArr = [];
                    if(pathArr.length >= 3)
                    {
                        rootPathArr = [pathArr[1], pathArr[2]];
                        o.root = pathArr[1];
                        o.sub_root = pathArr[2];
                    }
                        
                    else if(pathArr.length >= 2)
                    {
                        rootPathArr[0] = [pathArr[1], ''];
                        o.root = pathArr[1];
                        o.sub_root = '';
                    }
                        

                    o.root_path = rootPathArr.join('/');
                    o.full_path_components = o.full_path.split('|').filter(Boolean);
                    return o;
                });
                



                logger.debug(`will execute stored procedure spGetSearchResultPathsOnlyForFilters with`);
                let request2 =  pool.request();
                logger.debug('@SearchWords', `${searchWordsNameList}`);
                request2.input('SearchWords',  searchWordsNameList);
                logger.debug('@SortBy', sortByQueryParamValue);
                request2.input('SortBy',  sortByQueryParamValue);

                let result2 = await request2.execute('spGetSearchResultPathsOnlyForFilters');
                
                logger.debug(`executed procedure result : ${JSON.stringify(result2)}`);
                let results2 = result2.recordset;

                 /// injecting root_path
                 results2 = results2.map(function(r) {
                    let o = Object.assign({}, r);
                    
                    let pathArr = o.full_path.split("|");
                    let rootPathArr = [];
                    if(pathArr.length >= 3)
                    {
                        rootPathArr = [pathArr[1], pathArr[2]];
                        o.root = pathArr[1];
                        o.sub_root = pathArr[2];
                    }
                        
                    else if(pathArr.length >= 2)
                    {
                        rootPathArr[0] = [pathArr[1], ''];
                        o.root = pathArr[1];
                        o.sub_root = '';
                    }
                        

                    o.root_path = rootPathArr.join('/');
                    o.full_path_components = o.full_path.split('|').filter(Boolean);
                    return o;
                });


                let root_groups = _.groupBy(results2, function(r){
                    return r.root;
                });

                logger.debug(` root_groups : ${JSON.stringify(root_groups)}`);


                let computedFilters = _.map(root_groups, function(root_group){

                    return {
                        category : root_group[0].root,
                        items : _.map(_.uniq(_.pluck(root_group, 'sub_root'), function(item, key, a){
                            return item;

                        }), function(sub_root){
                            return {
                                name : sub_root,
                                is_active : getIsActiveValue(filters, root_group[0].root, sub_root)
                            };
                        }) 
                    };
                });

                


                // computedFilters = computedFilters.map(computedFilter => {
                //    const matchingRequestFilter =  filters.find(filter => {
                //         return (computedFilter.category == filter.category)
                //     })

                //     if(matchingRequestFilter != undefined && matchingRequestFilter.length > 0)
                //     {
                //         computedFilter.items.forEach(function iter(computedItem) {
                            
                //             const matchingExistingItem = matchingRequestFilter.items.find(matchingItem => {
                //                         return computedItem.name == matchingItem.name;
                //                     });

                //             if(matchingExistingItem != undefined)
                //             {
                //                 computedItem.is_active = matchingExistingItem.is_active;
                //             }
                //         });

                //         return computedFilter;
                //     }
                //     else
                //     {
                //         return computedFilter;
                //     }

                // });

                logger.debug(` computedFilters : ${JSON.stringify(computedFilters)}`);



                const totalCount = result.recordset.length > 0 ? result.recordset[0]['TotalCount'] : 0 ;
                response = {totalCount : totalCount, items : results, filters : computedFilters};
            }
            
            
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
};


function getIsActiveValue(filters, filterCategory, filterName) 
{
    const matchingFilter =  filters.find(filter => {
        return (filter.category == filterCategory);
    })

    if(matchingFilter != undefined)
    {
       const matchingItem = matchingFilter.items.find(item => {
            return (item.name == filterName);
        })

        if(matchingItem != undefined)
        {
            return matchingItem.is_active;
        }
        
    }

    return false;
}