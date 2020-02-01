

const {config, sql} = require('../helpers/db-config-helper');
const {logger} = require('../helpers/logging-helper');
const subpaths = require('../helpers/assests-subpaths');


module.exports = {

    
    //Validation DONE
    updateMetadata: async(req, res, next) =>{

        logger.debug('Controller method menu_node_metadata -> updateMetadata');
        try{

            const modifications = req.value.body;
            const {metadataId} = req.value.params;

            logger.debug(`update metadata id  : ${metadataId}`);
            logger.debug(`update metadata request body  : ${JSON.stringify(req.value.body)}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            
            
            
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            if(modifications.url == undefined)
            {
                modifications.url = "";
            }
            logger.debug(`will execute stored procedure spUpdateMetadata @Id=${metadataId} @Description =  ${modifications.description}, @SearchKeywords = ${modifications.search_keywords} @Url=${modifications.url} @TileFgColor = ${modifications.tile_fg_color} @TileBgColor = ${modifications.tile_bg_color} @TileImageFilename = ${modifications.tile_image_filename} @TileImageLink = ${modifications.tile_image_link}`);
            request.input('Id', metadataId);
            request.input('Description', modifications.description);
            request.input('SearchKeywords', modifications.search_keywords);
            request.input('Url', modifications.url);
            request.input('TileFgColor', modifications.tile_fg_color);
            request.input('TileBgColor', modifications.tile_bg_color);
            request.input('TileImageFilename', modifications.tile_image_filename);
            request.input('TileImageLink', '');

            request.input('ModifiedById', `${req.user.employeeID || ''}`);
            request.input('ModifiedByName', `${req.user.firstname || ''} ${req.user.lastname || ''}`);
            
            
            
            result = await request.execute('spUpdateMetadata');
            
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
    removeMetadata: async(req, res, next) =>{

        logger.debug('Controller method menu_node_metadata -> removeMetadata');

        try{
            const {metadataId} = req.value.params;
            logger.debug(`delete metadata id  : ${metadataId}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

           
    
            logger.debug(`will execute stored procedure spDeleteMetadata @Id=${metadataId}`);
            request.input('Id', metadataId);
            result = await request.execute('spDeleteMetadata');
            
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

    getMediaForNodeMetadata : async(req, res, next) =>{


        logger.debug('Controller method menu_node_metadata -> getMediaForNodeMetadata');

        try {

            const {metadataId} = req.value.params;

            logger.debug(`find metadata query params  : ${JSON.stringify(req.query)}`);
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            logger.debug(`will execute stored procedure spFindMetadataMedia with`);

            for (var queryParamName in req.query) {
                if (req.query.hasOwnProperty(queryParamName)) {

                    
                    switch(queryParamName.toLowerCase())
                    {
                        case 'filter':
                        {
                            request.input('Id', parseInt(req.query[queryParamName]) || 0);
                            logger.debug('@Id', parseInt(req.query[queryParamName]) || 0);

                            request.input('MediaType',  req.query[queryParamName]);
                            logger.debug('@MediaType', req.query[queryParamName]);

                            request.input('SerialOrder',  req.query[queryParamName]);
                            logger.debug('@SerialOrder', req.query[queryParamName]);

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
                                case 'media_type':
                                case 'serial_order':
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

            request.input('MenuMetadataId',  metadataId);
            logger.debug('@MenuMetadataId', metadataId);
            
            result = await request.execute('spFindMetadataMedia');
            
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            let media = result.recordset;

            media.forEach(m => {
				let destFolder = process.env.CLIENT_ASSETS_BASE_URI+ subpaths.METADATA_MEDIA_FILES;
				switch(m.media_type)
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
                m["media_file_url"] = destFolder + m.media_filename;
                
            });
            media = media.map(({TotalCount, ROWNUM, id, media_filename, media_file_url, menu_metadata_id, media_type, created_by_id, created_by_name,
                modified_by_id,
                modified_by_name,
                c_date,
                m_date,
                serial_order}) => ({id, media_filename, media_file_url, menu_metadata_id, media_type, created_by_id, created_by_name,
                    modified_by_id,
                    modified_by_name,
                    c_date,
                    m_date,
                    serial_order}));
            const totalCount = result.recordset.length > 0 ? result.recordset[0]['TotalCount'] : 0 ;
            const response = {totalCount : totalCount, items : media};
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

    newMediaForNodeMetadata: async(req, res, next) =>{

        logger.debug('Controller method menu_node_metadata -> newMediaForNodeMetadata');

        try{

            const newMediaBody = req.value.body;
            const {metadataId} = req.value.params;

            logger.debug(`add media request body  : ${JSON.stringify(req.value.body)}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

           
            logger.debug(`will execute stored procedure spAddMetadataMedia @MenuMetadataId = ${metadataId} @MediaFilename =  ${newMediaBody.text} @MediaFileUrl = ${newMediaBody.url} @MediaType = ${newMediaBody.tile_fg_color} @SerialOrder = ${newMediaBody.serial_order}  `);
            request.input('MenuMetadataId', metadataId);
            
            request.input('MediaFilename', newMediaBody.media_filename);
            request.input('MediaFileUrl', '');
            request.input('MediaType', newMediaBody.media_type);
            request.input('SerialOrder', newMediaBody.serial_order);

            request.input('CreatedById', `${req.user.employeeID || ''}`);
            request.input('CreatedByName', `${req.user.firstname || ''} ${req.user.lastname || ''}`);
            
            
            result = await request.execute('spAddMetadataMedia');
            
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


    getAttrValuesForNodeMetadata : async(req, res, next) =>{


        logger.debug('Controller method menu_node_metadata -> getAttrValuesForNodeMetadata');

        try {

            const {metadataId} = req.value.params;

            logger.debug(`find metadata query params  : ${JSON.stringify(req.query)}`);
            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

            logger.debug(`will execute stored procedure spFindMetadataAttrValue with`);

            for (var queryParamName in req.query) {
                if (req.query.hasOwnProperty(queryParamName)) {

                    
                    switch(queryParamName.toLowerCase())
                    {
                        case 'filter':
                        {
                            request.input('Id', parseInt(req.query[queryParamName]) || 0);
                            logger.debug('@Id', parseInt(req.query[queryParamName]) || 0);

                            request.input('Value',  req.query[queryParamName]);
                            logger.debug('@Value', req.query[queryParamName]);


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
                                case 'value':
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

            request.input('MenuMetadataId',  metadataId);
            logger.debug('@MenuMetadataId', metadataId);
            
            result = await request.execute('spFindMetadataAttrValue');
            
            logger.debug(`executed procedure result : ${JSON.stringify(result)}`);
            let media = result.recordset;
            media = media.map(({TotalCount, ROWNUM, id, attr_name_id, value, name, attr_type_id, attr_type_name, menu_metadata_id}) => ({id, attr_name_id, value, name,attr_type_id, attr_type_name, menu_metadata_id}));
            const totalCount = result.recordset.length > 0 ? result.recordset[0]['TotalCount'] : 0 ;
			
			for (var mediaValue of media) {

                let descriptionValues = await request.query(`select id, description from MenuMetadataAttrValueDescriptionMap where att_value_map_id =` + mediaValue.id);
                mediaValue.description = descriptionValues.recordset;
            }
            
            logger.debug(`executed query, media result : ${JSON.stringify(media)}`);
			
            const response = {totalCount : totalCount, items : media};
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

    newAttrValueForNodeMetadata: async(req, res, next) =>{

        logger.debug('Controller method menu_node_metadata -> newAttrValueForNodeMetadata');

        try{

            const newAttrValueBody = req.value.body;
            const {metadataId} = req.value.params;

            logger.debug(`add attrValue request body  : ${JSON.stringify(req.value.body)}`);

            logger.trace(`trying for connection to mssql with config ${JSON.stringify(config)}`);
            const pool = await new sql.ConnectionPool(config).connect();
            logger.trace(`connected to mssql, will create request`);
            let request =  pool.request();

           
            logger.debug(`will execute stored procedure spAddMetadataAttrValue @MenuMetadataId = ${metadataId} @AttrNameId =  ${newAttrValueBody.attr_name_id} @Value = ${newAttrValueBody.value} `);
            request.input('MenuMetadataId', metadataId);

            request.input('AttrNameId', newAttrValueBody.attr_name_id);
            request.input('Value', newAttrValueBody.value);

            const attrValueDescription = new sql.Table('MenuMetadataAttrValueDescMap');
			attrValueDescription.columns.add('id', sql.Int);
			attrValueDescription.columns.add('descriptionValue', sql.VarChar(100));
            
            let valueDescriptionArray = newAttrValueBody.descriptionValue;
			for(var descriptionValue of valueDescriptionArray) {
											 
				attrValueDescription.rows.add("", descriptionValue.description);
            }
            
			request.input('MenuMetadataAttrValueDescMap', attrValueDescription);
            
            result = await request.execute('spAddMetadataAttrValue');
            
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
    }

};




