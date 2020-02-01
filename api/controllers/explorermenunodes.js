
const {config, sql} = require('../helpers/db-config-helper');
const {logger} = require('../helpers/logging-helper');
const {makeTree} = require('../helpers/ds-helper')
const convert = require('xml-js');
const subpaths = require('../helpers/assests-subpaths');

module.exports = {

    //Validation DONE
    index : async (req, res, next) =>{
        
        logger.debug(`Controller method explorermenunodes -> index`);

        try {

            logger.debug(`find explorermenunode query params  : ${JSON.stringify(req.query)}`);
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();
    
            logger.debug(`will execute stored procedure spGetMenuNode`);
 
    
            
            result = await request.execute('spGetMenuNode');
            
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            let explorermenunodes = result.recordset;
			
			for(var menunode of explorermenunodes)
			{						                      
				menunode.tile_image_link = process.env.CLIENT_ASSETS_BASE_URI + subpaths.FEATURED_FILES +  menunode.tile_image_filename;
			}
			
			logger.debug(`executed procedure spGetMenuNode explorermenunodes : ${JSON.stringify(explorermenunodes)}`);
		
            const response = makeTree({q: explorermenunodes})
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

     getNodesComparisionResult : async (req, res, next) =>{
        
        logger.debug(`Controller method explorermenunodes -> getNodesComparisionResult`);

        try {

            let format = 'json';
            if(req.query['format'] != undefined)
            {
                format = req.query['format'].toLowerCase();
            }

            const nodesComparisionRequestBody = req.value.body;

            logger.debug(`getNodesComparisionResult request body  : ${JSON.stringify(nodesComparisionRequestBody)}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            // logger.debug(`checking if the nodeIds requested are comparable (same node type)...`);
            // let requestNodeTypeIds = await request.query`select distinct node_type_id from MenuNode where id in ${nodesComparisionRequestBody.nodeIds} `;
            // logger.debug(`executed query, result : ${JSON.stringify(requestNodeTypeIds)}`);
            
            // if(requestNodeTypeIds.length > 1)
            // {
            //     const message = "Nodes to be compared need to be of the same type";
            //     logger.trace(`${message} aborting and closing sql conn`);
            //     sql.close();
            //     logger.debug(`sql connection closed, sending 409  response to client`);
    
            //     res.status(409).send(message);
            //     return;
            // }
            


            // request = pool.request();
    
            logger.debug(`will execute stored procedure spGetComparoDataForMenuNodes with @MenuNodeIds = ${JSON.stringify(nodesComparisionRequestBody.nodeIds)}`);
 
            const nodesIdList = new sql.Table();
            nodesIdList.columns.add('id', sql.Int);
            for(let nodeId of nodesComparisionRequestBody.nodeIds)
            {
                nodesIdList.rows.add(nodeId); 
            }

            logger.debug(`${JSON.stringify(nodesIdList)}`);

            request.input('MenuNodeIds', nodesIdList);

    
            
            let result = await request.execute('spGetComparoDataForMenuNodes');
            
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            let comparisionData = result.recordset;
        
            let jsonFormattedComparisionData =  comparisionData.map(nodeComparisionData => {
                const mediasJs = convert.xml2js(nodeComparisionData['medias'], {compact: true}); 
                logger.trace(`mediaJs : ${JSON.stringify(mediasJs)}`);

                if(mediasJs.medias != undefined)
                {
                    if(Array.isArray(mediasJs.medias.media)  === false)
                    {
                        logger.trace(`mediaJs.medias.media is an object`);
                            const media = mediasJs.medias.media;
                            let new_media_obj = {media_file_url : "",media_title : "" };
                            //new_media_obj.media_file_url = media.media_file_url ? media.media_file_url._text : null;
							
							if (media.media_filename._text == '') {
								
								new_media_obj.media_file_url = '';
							} else {
								
								let destFolder = process.env.CLIENT_ASSETS_BASE_URI + subpaths.METADATA_MEDIA_FILES;
								switch(media.media_type._text)
								{
									case 'image':
										destFolder = destFolder + 'img/';
										break;
									case 'video':
										destFolder = destFolder + 'vid/';
										break;
									case 'ppt':
										 destFolder = destFolder + 'ppt/';
										 break;
									case 'doc':
										destFolder = destFolder + 'doc/';
										break;
									case 'excel':
										destFolder = destFolder + 'excel/';
										break;
									case 'pdf':
										destFolder = destFolder + 'pdf/';
										break;
									default : 
										destFolder = destFolder + '';
									break;

								}
								new_media_obj.media_file_url = destFolder + media.media_filename._text;
							}
                            new_media_obj.media_title = media.media_title ? media.media_title._text :  null;
                            
                            nodeComparisionData['medias'] = [new_media_obj];
    
                    }
                    else
                    {
                        logger.trace(`mediaJs.medias.media is an array`);
    
                        nodeComparisionData['medias'] = mediasJs.medias.media.map(media => {
    

                            //media.media_file_url = media.media_file_url ? media.media_file_url._text : null;
                            //media.media_title = media.media_title ? media.media_title._text :  null;

							if (media.media_filename._text == '') {
								
								media.media_file_url = '';
							} else {
								
								let destFolder = process.env.CLIENT_ASSETS_BASE_URI + subpaths.METADATA_MEDIA_FILES;
								switch(media.media_type._text)
								{
									case 'image':
										destFolder = destFolder + 'img/';
										break;
									case 'video':
										destFolder = destFolder + 'vid/';
										break;
									case 'ppt':
										 destFolder = destFolder + 'ppt/';
										 break;
									case 'doc':
										destFolder = destFolder + 'doc/';
										break;
									case 'excel':
										destFolder = destFolder + 'excel/';
										break;
									case 'pdf':
										destFolder = destFolder + 'pdf/';
										break;
									default : 
										destFolder = destFolder + '';
									break;

								}
								media.media_file_url = destFolder + media.media_filename._text;
							}
                            media.media_title = media.media_title ? media.media_title._text :  null;
                            
                            return media;
                        });
                    }
                }
                else
                {
					let new_media_obj = {media_file_url : "",media_title : "" };
                    nodeComparisionData['medias'] = [new_media_obj];
                }

                

                const attributesJs = convert.xml2js(nodeComparisionData['attributes'], {compact: true}); 
                logger.trace(`attributesJs : ${JSON.stringify(attributesJs)}`);
                if(attributesJs.attributes != undefined)
                {
                    if(Array.isArray(attributesJs.attributes.attribute)  === false)
                    {
                        logger.trace(`attributesJs.attributes.attribute is an object`);
                            const attribute = attributesJs.attributes.attribute;
                            let new_attribute_obj = {name : "",value : ""};
                            new_attribute_obj.name = attribute.name ? attribute.name._text : null;
                            new_attribute_obj.value = attribute.value ? attribute.value._text : null;
                        
                            
                            nodeComparisionData['attributes'] = [new_attribute_obj];

                    }
                    else
                    {
                        logger.trace(`attributesJs.attributes.attribute is an array`);

                        nodeComparisionData['attributes'] = attributesJs.attributes.attribute.map(attribute => {

                            attribute.name = attribute.name ? attribute.name._text : null;
                            attribute.value = attribute.value ? attribute.value._text : null;

                            return attribute;
                        });
                    }

                }
                else
                {
                    nodeComparisionData['attributes'] = [];
                }

              

                const characteristicsJs = convert.xml2js(nodeComparisionData['characteristics'], {compact: true}); 
                logger.trace(`characteristicsJs : ${JSON.stringify(characteristicsJs)}`);
                if(characteristicsJs.characteristics != undefined)
                {
                    if(Array.isArray(characteristicsJs.characteristics.characteristic)  === false)
                    {
                        logger.trace(`characteristicsJs.characteristics.characteristic is an object`);
                            const characteristic = characteristicsJs.characteristics.characteristic;
                            let new_characteristic_obj = {name : "",value : ""};
                            new_characteristic_obj.name = characteristic.name ? characteristic.name._text : null;
                            new_characteristic_obj.value = characteristic.value ? characteristic.value._text : null;
                        
                            
                            nodeComparisionData['characteristics'] = [new_characteristic_obj];

                    }
                    else
                    {
                        logger.trace(`characteristicsJs.characteristics.characteristic is an array`);

                        nodeComparisionData['characteristics'] = characteristicsJs.characteristics.characteristic.map(characteristic => {

                            characteristic.name = characteristic.name ? characteristic.name._text : null;
                            characteristic.value = characteristic.value ? characteristic.value._text : null;

                            
                            return characteristic;
                        });
                    }

                }
                else
                {
                    nodeComparisionData['characteristics'] = [];
                }

                

               
                return nodeComparisionData;
            });








            let response = {};

            if(format == 'simple')
            {


                
               
                let itemNames = [];
                jsonFormattedComparisionData.forEach(item => {
                    itemNames.push(item['node_name']);
                });


                jsonFormattedComparisionData.forEach(item => {

                    Object.keys(item).forEach(key => {
                      
                        
                      if (!response[key]) {
    
                        if(key != "attributes" && key != "characteristics" && key != "medias" && key != "node_name")
                        {
                            response[key] = [];
                        }
                        
                      }
    
    
                      if(key == "medias")
                      {
                        if( item[key] != undefined && item[key].length > 0 )
                        {
                            if (!response["Media File Url"]) {
                                response["Media File Url"] = [];
                              }
                            response["Media File Url"].push(item[key][0].media_file_url);
                        }  
                      }
                      else if(key == "attributes" || key == "characteristics")
                      {
                        item[key].forEach(subItem => {
    
                            if (!response[subItem["name"]]) {
                              response[subItem["name"]] = [];
                            }
    
                            // const obj = {};
                            // obj['name'] = subItem["name"];
                            // obj['value'] =  subItem["value"];
                            response[subItem["name"]].push(subItem["value"]);
                        });                            
                      }
                      else if(key != "node_name")
                      {
                        //  const obj = {};
                        //  obj['name'] = key;
                        //  obj['value'] =  item[key];
                        response[key].push(item[key]);
                      }
                      
                    });
                  });

                  let preparedExcelData = [];
                  Object.keys(response).forEach(key => {
                    let row = {};
                    row['x'] = key;
                    const itemValues = response[key];
                    let nullRowItemsCount = 0;
                    for(let i = 0 ; i< itemValues.length ; i++)
                    {
                        row[itemNames[i]] = itemValues[i];
                        if(itemValues[i] === null)
                        {
                            nullRowItemsCount++;
                        }

                    }

                    if(nullRowItemsCount < itemNames.length)
                    {
                        preparedExcelData.push(row);
                    }

                  });
    
                  response = preparedExcelData;
                  
              

                //   preparedExcelData = preparedExcelData.filter(preparedExcelDatum => {
                //       const nullRowItems =  otherComparoRowData.values.filter(rowItem =>{
                //           return rowItem.value === null
                //       })
    
                //       return nullRowItems.length != otherComparoRowData.values.length;
                //   })


            }
            else
            {
                let node_names = [];

                jsonFormattedComparisionData.forEach(item => {
                    Object.keys(item).forEach(key => {
                      
                        
                      if (!response[key]) {
    
                        if(key != "attributes" && key != "characteristics")
                        {
                            response[key] = [];
                        }
                        
                      }
    
    
                      if(key == "medias")
                      {
                        if( item[key] != undefined && item[key].length > 0 )
                        {
                            response[key].push(item[key][0]);
                        } 
                        else
                        {
                            response[key].push({});
                        } 
                      }
                      else if(key == "attributes" || key == "characteristics")
                      {
                        item[key].forEach(subItem => {
    
                            if (!response[subItem["name"]]) {
                              response[subItem["name"]] = [];
                            }
    
                            const obj = {};
                            obj['name'] = subItem["name"];
                            obj['value'] =  subItem["value"];
                            response[subItem["name"]].push(obj);
                        });                            
                      }
                      else if(key != "node_name")
                      {
                         const obj = {};
                         obj['name'] = key;
                         obj['value'] =  item[key];
                        response[key].push(obj);
                      }
                      else
                      {

                        node_names.push(item[key]);
                      }
                      
                    });
                  });
    
    
                  
                  let mediaComparoRowsData = [];
    
                  let otherComparoRowsData = Object.keys(response).map(function(key) {
    
                    if(key == 'medias')
                        mediaComparoRowsData.push({name : key, values : response[key]});
                    
                     return {name : key, values : response[key]};
                       
                  });

                  logger.debug(`NODE_NAMES ${JSON.stringify(node_names)}`);
                  logger.debug(`mediaComparoRowsData ${JSON.stringify(mediaComparoRowsData)}`);

                  ///adding node_name explicitly within an empty media object if no media exist on the request of frontend team
                  for(let i = 0 ; i < node_names.length ; i++)
                  {
                    logger.debug(`mediaComparoRowsData[0].values[i] ${JSON.stringify(mediaComparoRowsData[0].values[i])}`);
                      if(!mediaComparoRowsData[0].values[i] || !mediaComparoRowsData[0].values[i].media_title)
                      {
                          mediaComparoRowsData[0].values[i] = {media_file_url : "", media_title : node_names[i]};
                      }
                  }


    
                  let mediaIndex = otherComparoRowsData.findIndex(item => item.name == 'medias');
                  otherComparoRowsData.splice(mediaIndex, 1);
    
                  otherComparoRowsData = otherComparoRowsData.filter(otherComparoRowData => {
                      const nullRowItems =  otherComparoRowData.values.filter(rowItem =>{
                          return rowItem.value === null
                      })
    
                      return nullRowItems.length != otherComparoRowData.values.length;
                  })

                response = {media_rows_data : mediaComparoRowsData, other_comparo_rows_data :  otherComparoRowsData};
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
     },

     getOtherComparableNodes : async (req, res, next) =>{
        
        logger.debug(`Controller method explorermenunodes -> getOtherComparableNodes`);

        try {

            const getOtherComparableNodesRequestBody = req.value.body;

            logger.debug(`getOtherComparableNodes request body  : ${JSON.stringify(getOtherComparableNodesRequestBody)}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();
    
            logger.debug(`will execute stored procedure spGetOtherComparableNodes with @MenuNodeIds = ${JSON.stringify(getOtherComparableNodesRequestBody.nodeIds)}`);
 
            const nodesIdList = new sql.Table();
            nodesIdList.columns.add('id', sql.Int);
            for(let nodeId of getOtherComparableNodesRequestBody.nodeIds)
            {
                nodesIdList.rows.add(nodeId); 
            }

            logger.debug(`${JSON.stringify(nodesIdList)}`);

            request.input('MenuNodeIds', nodesIdList);

            let result = await request.execute('spGetOtherComparableNodes');
            
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            let otherComparableNodes = result.recordset;
        
            const response = otherComparableNodes;
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
    newExplorerMenuNode: async (req, res, next) =>{

        logger.debug('Controller method explorermenunodes -> newExplorerMenuNode');

        try{

            const newExplorerMenuNodeBody = req.value.body;
            const {explorermenunodeId} = req.value.params;
            
            logger.debug(`add explorermenunode request body  : ${JSON.stringify(req.value.body)}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            logger.debug(`will query for the existence of the supplied parent node id in the db`);

            let result = await request.query`select count(*) as count from MenuNode where id=${explorermenunodeId}`;
            logger.debug(`executed query, result : ${JSON.stringify(result.recordset)}`);
            const count = result.recordset[0].count;

            if(count <= 0)
            {
                const message = "Invalid parent node id.";
                logger.trace(`${message} aborting and closing sql conn`);
                sql.close();
                logger.debug(`sql connection closed, sending 409  response to client`);
    
                res.status(409).send(message);
                return;
            }
            
            let urlPath = newExplorerMenuNodeBody.name.replace(/[^a-zA-Z0-9 ]/g, '');
            urlPath = urlPath.split(' ').join('_');

            request =  pool.request();

            
            logger.debug(`will execute stored procedure spAddMenuNode @Name =  ${newExplorerMenuNodeBody.name}, @NodeTypeId=${newExplorerMenuNodeBody.node_type_id}, @UrlPath = ${urlPath} @ParentNodeId = ${explorermenunodeId} }`);
            request.input('Name', newExplorerMenuNodeBody.name);
            request.input('NodeTypeId', newExplorerMenuNodeBody.node_type_id);
            request.input('G3MapperId', newExplorerMenuNodeBody.g3mapper_id != undefined ? newExplorerMenuNodeBody.g3mapper_id : 0);
            request.input('UrlPath', urlPath);
            request.input('ParentNodeId', explorermenunodeId);
            request.input('CreatedById', `${req.user.employeeID || ''}`);
            request.input('CreatedByName', `${req.user.firstname || ''} ${req.user.lastname || ''}`);
            
            result = await request.execute('spAddMenuNode');
            
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            const explorermenunode = result.recordset;
            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(explorermenunode)}`);
            res.status(201).json(explorermenunode);

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

    // // //Validation DONE
    // // getExplorerMenuNode: async(req, res, next) =>{
    // //     const {explorermenunodeId} = req.value.params;
    // //     const explorermenunode = await ExplorerMenuNode.findById(explorermenunodeId);
    // //     if(!explorermenunode)
    // //     {
    // //         return res.status(404).json({
    // //             error: {
    // //                 message: "The specified explorermenunode doesn't exist"
    // //             }
    // //         });
    // //     }
    // //     res.status(200).json(explorermenunode);
    // // },

    // // //Validation DONE
    // // replaceExplorerMenuNode: async(req, res, next) =>{
    // //     const {explorermenunodeId} = req.value.params;
    // //     const newExplorerMenuNode = req.value.body;
    // //     const result = await ExplorerMenuNode.findByIdAndUpdate(explorermenunodeId, newExplorerMenuNode);
    // //     res.status(200).json({success : true});
    // // },

    //Validation DONE
    updateExplorerMenuNode: async(req, res, next) =>{
        
        logger.debug('Controller method explorermenunodes -> updateExplorerMenuNode');
        try{

            const {explorermenunodeId} = req.value.params;
            const modifications = req.value.body;

            logger.debug(`update explorermenunode id  : ${explorermenunodeId}`);
            logger.debug(`update explorermenunode request body  : ${JSON.stringify(req.value.body)}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            logger.debug(`will query for the existence of  the menu node in the db`);

            let result = await request.query`select count(*) as count from MenuNode where id <> ${explorermenunodeId}`;
            logger.debug(`executed query, result : ${JSON.stringify(result.recordset)}`);
            const count = result.recordset[0].count;

            if(count <= 0)
            {
                const message = "Invalid menu node id";
                logger.trace(`${message} aborting and closing sql conn`);
                sql.close();
                logger.debug(`sql connection closed, sending 409  response to client`);
    
                res.status(409).send(message);
                return;
            }

            let urlPath = modifications.name.replace(/[^a-zA-Z0-9 ]/g, '');
            urlPath = urlPath.split(' ').join('_');

            request =  pool.request();        

            logger.debug(`will execute stored procedure spUpdateMenuNode @Id=${explorermenunodeId} @Name =  ${modifications.name} @NodeTypeId=${modifications.node_type_id} @UrlPath = ${urlPath}`);
            request.input('Id', explorermenunodeId);
            request.input('Name', modifications.name);
            request.input('NodeTypeId', modifications.node_type_id);
            request.input('UrlPath', urlPath);
            request.input('ModifiedById', `${req.user.employeeID || ''}`);
            request.input('ModifiedByName', `${req.user.firstname || ''} ${req.user.lastname || ''}`);
            request.input('g3MapperId', modifications.g3mapper_id != undefined ? modifications.g3mapper_id : 0);

            result = await request.execute('spUpdateMenuNode');
            
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
    removeExplorerMenuNode: async(req, res, next) =>{
        
        logger.debug('Controller method explorermenunodes -> removeExplorerMenuNode');

        try{
            const {explorermenunodeId} = req.value.params;
            logger.debug(`delete explorermenunode id  : ${explorermenunodeId}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            logger.debug(`will query for the existence of  the menu node in the db`);

            let result = await request.query`select id, parent_node_id from MenuNode where id = ${explorermenunodeId}`;
            logger.debug(`executed query, result : ${JSON.stringify(result.recordset)}`);
            const count = result.recordset.length;

            if(count <= 0)
            {
                const message = "Invalid menu node id";
                logger.trace(`${message} aborting and closing sql conn`);
                sql.close();
                logger.debug(`sql connection closed, sending 409  response to client`);
    
                res.status(409).send(message);
                return;
            }


            const parentNodeId = result.recordset[0].parent_node_id;

            request =  pool.request();
            logger.debug(`will execute stored procedure spDeleteMenuNode @Id=${explorermenunodeId} @ParentNodeId=${parentNodeId}`);
            request.input('Id', explorermenunodeId);
            request.input('ParentNodeId', parentNodeId);
            result = await request.execute('spDeleteMenuNode');
            
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

    getMetadataForMenuNode: async(req, res, next) =>{


        logger.debug('Controller method explorermenunodes -> getMetadataForMenuNode');

        try
        {
            const {explorermenunodeId} = req.value.params;
            logger.debug(`params passed : ${JSON.stringify(req.value.params)}`);
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();


            logger.debug(`will execute stored procedure spGetMetadataForMenuNode @MenuNodeId =  ${explorermenunodeId}`);
            request.input('MenuNodeId', explorermenunodeId);
            result = await request.execute('spGetMetadataForMenuNode');
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            let metadata = {};
        
            if(result.recordset.length > 0)
            {
                metadata = result.recordset[0];
				metadata["tile_image_link"] =  process.env.CLIENT_ASSETS_BASE_URI + subpaths.FEATURED_FILES + metadata.tile_image_filename;
            }
            
            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(metadata)}`);
            res.status(200).json(metadata);
        }
        catch
        {
            logger.error(error);
            logger.trace(`error caught, closing sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 500 error response to client`);
            res.status(500).send(error.name || '');

        }

    },

    getNodeChildren : async(req, res, next) =>{


        logger.debug('Controller method explorermenunodes -> getNodeChildren');

        try
        {
            const {explorermenunodeId} = req.value.params;
            logger.debug(`params passed : ${JSON.stringify(req.value.params)}`);
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();


            logger.debug(`will execute stored procedure spGetMenuNodeChildren @MenuNodeId =  ${explorermenunodeId}`);
            request.input('MenuNodeId', explorermenunodeId);
            result = await request.execute('spGetMenuNodeChildren');
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            let children = result.recordset;
            
            children = children.map(function(r) {
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
            

            const totalCount = result.recordset.length > 0 ? result.recordset.length : 0 ;
			
			for (var child of children) {

				if (child.tile_image_filename == '' || child.tile_image_filename == null) {
					
					child["tile_image_link"] = "";
				} else {
					
					child["tile_image_link"] = process.env.CLIENT_ASSETS_BASE_URI+ subpaths.FEATURED_FILES + child.tile_image_filename;
				}
                
                let getRequest= pool.request();
				getRequest.input('Name',child.name);
				
			    
				let chambrGotCode = await getRequest.execute('spGetSalesAnalyticsFindChamberGotCodes');
				
                logger.debug(`executed procedure spGetSalesAnalyticsFindChamberGotCodes chamberCount : ${JSON.stringify(chambrGotCode)}`);
		 		let chambGotCode = chambrGotCode.recordset.map(record => record.gotCode);
				
				logger.debug(`chambGotCode : ${JSON.stringify(chambGotCode)}`);
				if(chambGotCode.length > 0 )
				{
				child.gotCode = chambGotCode[0];
				}
	
	             else{
					child.gotCode= '';

 				}
			}
			
			
            const response = {totalCount : totalCount, items : children};
        
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

    getRecommendedForMenuNode: async(req, res, next) =>{


        logger.debug(`Controller method explorermenunodes -> getRecommendedForMenuNode`);

        try {

            const {explorermenunodeId} = req.value.params;

            logger.debug(`find recommended query params  : ${JSON.stringify(req.query)}`);
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();
    


            logger.debug(`will execute stored procedure spGetRecommendedForMenuNode with @MenuNodeId = ${explorermenunodeId}`);
    
            request.input('MenuNodeId', explorermenunodeId);
            result = await request.execute('spGetRecommendedForMenuNode');
            
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            let recommended = result.recordset;
			
			recommended.forEach(f => {
                    
				f["tile_image_link"] = process.env.CLIENT_ASSETS_BASE_URI + subpaths.FEATURED_FILES + f.tile_image_filename;
			});
				
				
            const totalCount = result.recordset.length > 0 ? result.recordset[0]['TotalCount'] : 0 ;
            const response = {totalCount : totalCount, items : recommended};
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

    getDescendentDataNodesForMenuNode : async(req, res, next) =>{

        logger.debug('Controller method explorermenunodes -> getDescendentDataNodesForMenuNode');

        try
        {
            const {explorermenunodeId} = req.value.params;
            logger.debug(`params passed : ${JSON.stringify(req.value.params)}`);
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();
            logger.debug(`will execute stored procedure spGetAllDescendentDataNodesForMenuNode @MenuNodeId =  ${explorermenunodeId}`);
            request.input('MenuNodeId', explorermenunodeId);
            result = await request.execute('spGetAllDescendentDataNodesForMenuNode');
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            const descendentDataNodes = result.recordset;
            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(descendentDataNodes)}`);
            res.status(200).json(descendentDataNodes);
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

    newMetadataForMenuNode: async(req, res, next) =>{

        logger.debug('Controller method explorermenunodes -> newMetadataForMenuNode');

        try{

            const newMetadataBody = req.value.body;
            const {explorermenunodeId} = req.value.params;

            logger.debug(`add chamber request body  : ${JSON.stringify(req.value.body)}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            logger.debug(`will query for the existence of any metadata for the give node id in the db`);

            let result = await request.query`select count(*) as count from MenuMetadata where menu_node_id = ${explorermenunodeId}`;
            logger.debug(`executed query, result : ${JSON.stringify(result.recordset)}`);
            const count = result.recordset[0].count;

            if(count > 0)
            {
                const message = "A metadata instance for the given node already exists. Please update rather than adding";
                logger.trace(`${message} aborting and closing sql conn`);
                sql.close();
                logger.debug(`sql connection closed, sending 409  response to client`);
    
                res.status(409).send(message);
                return;
            }
           
            if(newMetadataBody.url == undefined)
            {
                newMetadataBody.url = "";
            }

            request =  pool.request();

            logger.debug(`will execute stored procedure spAddMenuNodeMetadata @MenuNodeId = ${explorermenunodeId} @Description =  ${newMetadataBody.description} @SearchKeywords=${newMetadataBody.search_keywords} @Url = ${newMetadataBody.url} @TileFgColor = ${newMetadataBody.tile_fg_color} @TileBgColor = ${newMetadataBody.tile_bg_color} @TileImageFilename = ${newMetadataBody.tile_image_filename} @TileImageLink = ${newMetadataBody.tile_image_link} `);
            request.input('MenuNodeId', explorermenunodeId);
            request.input('Description', newMetadataBody.description);
            request.input('SearchKeywords', newMetadataBody.search_keywords);
            request.input('Url', newMetadataBody.url);
            request.input('TileFgColor', newMetadataBody.tile_fg_color);
            request.input('TileBgColor', newMetadataBody.tile_bg_color);
            request.input('TileImageFilename', newMetadataBody.tile_image_filename);
            request.input('TileImageLink', newMetadataBody.tile_image_link);
            request.input('CreatedById', `${req.user.employeeID || ''}`);
            request.input('CreatedByName', `${req.user.firstname || ''} ${req.user.lastname || ''}`);
            
            
            result = await request.execute('spAddMenuNodeMetadata');
            
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            const metadata = result.recordset;
            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(metadata)}`);
            res.status(201).json(metadata);

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

    newRecommendedForMenuNode : async(req, res, next) =>{

        logger.debug('Controller method explorermenunodes -> newRecommendedForMenuNode');

        try{

            const newRecommendedBody = req.value.body;
            const {explorermenunodeId} = req.value.params;

            const recommendedNodeIds = newRecommendedBody.recommended_nodes_list;

            const recommendedNodeIdList = new sql.Table('IdList');
            recommendedNodeIdList.columns.add('id', sql.Int);
            for(let nodeId of recommendedNodeIds)
            {
                recommendedNodeIdList.rows.add(nodeId);
            }



            logger.debug(`add/link recommended node list request body  : ${JSON.stringify(req.value.body)}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            

            request =  pool.request();

            logger.debug(`will execute stored procedure spAddMenuNodeRecommended @MenuNodeId = ${explorermenunodeId} @RecommendedMenuNodeIds = ${recommendedNodeIds}  `);
            request.input('MenuNodeId', explorermenunodeId);
            request.input('RecommendedMenuNodeIds', recommendedNodeIdList);

            request.input('CreatedById', `${req.user.employeeID || ''}`);
            request.input('CreatedByName', `${req.user.firstname || ''} ${req.user.lastname || ''}`);
            
            
            result = await request.execute('spAddMenuNodeRecommended');
            
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            const recommended = result.recordset;
            logger.trace(`will close sql connection`);
            sql.close();
            logger.debug(`sql connection closed, sending 200 response to client : ${JSON.stringify(recommended)}`);
            res.status(201).json(recommended);

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

    getExplorerChamberFamilies : async(req, res, next) =>{

        logger.debug(`Controller method explorermenunodes -> getExplorerChamberFamilies`);

        try {

			//const {platformID} = req.value.params;

            logger.debug(`find getExplorerChamberFamilies query params  : ${JSON.stringify(req.query)}`);
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();
    
            logger.debug(`will execute stored procedure spGetMenuNodeExplorerChamberFamilies`);
			
			// logger.debug(`will execute stored procedure spGetMenuNode @platformID =  ${platformID}`);
            // request.input('PlatformID', platformID);
            
            result = await request.execute('spGetMenuNodeExplorerChamberFamilies');
            
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            
			let chambersFamilies = result.recordset;			
			
			const totalCount = result.recordset.length > 0 ? result.recordset[0]['TotalCount'] : 0 ;
			
			for (var chamber of chambersFamilies) {

                            
                let getRequest= pool.request();
				getRequest.input('Name',chamber.name);
				
			    
				let gotCode = await getRequest.execute('spGetSalesAnalyticsFindChamberGotCodes');
				
                logger.debug(`executed procedure spGetSalesAnalyticsFindChamberGotCodes chamberCount : ${JSON.stringify(gotCode)}`);
		 		let chamberGotCode = gotCode.recordset.map(record => record.gotCode);
				
				logger.debug(`chamberGotCode : ${JSON.stringify(chamberGotCode)}`);
				if(chamberGotCode.length > 0 )
				{
				chamber.gotCode = chamberGotCode[0];
				}
	
	             else{
					chamber.gotCode= '';

 				}
            }
			
			
			
            const response = {totalCount : totalCount, items : chambersFamilies};
			
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

    explorerChambersSearch : async(req, res, next) =>{

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

            
            result = await request.execute('spGetMenuNodeExplorerChamberSearch');
            
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            let chambers = result.recordset;
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
	
	  getExplorerToMapperDetails :  async(req, res, next) =>{

        logger.debug('Controller method chambers -> getExplorerToMapperDetails');

        try {
			
            const {explorermenunodeId} = req.value.params;
            
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request1 =  pool.request();

            request1.input('NodeTypeId', explorermenunodeId);

            logger.debug(`will execute stored procedure spGetExplorerToMapperLinkDetails`);

            result = await request1.execute('spGetExplorerToMapperLinkDetails');
            
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

function findChambersInList(list) {
    let node;
    list.some(function(currentItem) {
        return node = currentItem.node_type_name == "CHAMBER-FAMILY" ? currentItem : findChambersInList(currentItem.children);
    });
    return node;
}
