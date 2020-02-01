const Joi = require('joi');
const {logger} = require('../helpers/logging-helper');


module.exports = {
    validateParam: (schema, name) =>{
        return (req, res, next) => {
            
            const result = Joi.validate({param: req['params'][name]}, schema);
            if(result.error)
            {
                logger.error(result.error);
                return res.status(400).json(result.error);
            }else{

                logger.debug(`request paramaters validated`);
                if(!req.value)
                    req.value = {};

                if(!req.value['params'])
                    req.value['params'] = {};

                req.value['params'][name] = result.value.param;
                next();
            }
        };
    },

    validateBody: (schema) =>{

        return (req, res, next) => {
            const result = Joi.validate(req.body, schema);
            if(result.error)
            {
                logger.error(result.error);
                return res.status(400).json(result.error);
            } else
            {
                logger.debug(`request body validated`);

                if(!req.value)
                    req.value = {};
                
                if(!req.value['body'])
                    req.value['body'] = {};

                req.value['body'] = result.value;
                next();
            }
        };
    },

    authorize: (roles = []) =>{

        if (typeof roles === 'string') {
			
			logger.debug(`authorize roles string`);
            roles = [roles];
        }
    
        return [
            
            // authorize based on user role
            (req, res, next) => {
				
				if (req.user.roles) {
					if (typeof req.user.roles === 'string') {
				
						logger.debug(`authorize roles string`);
						req.user.roles = [req.user.roles];
					}
				}
				
				logger.debug(`authorize req role user ${req.user.roles}`);
				logger.debug(`authorize req role user length ${req.user.roles.length}`);
				logger.debug(`authorize roles ${roles}`);
				logger.debug(`authorize roles length ${roles.length}`);
				
                if (roles.length && req.user.roles) {
					
					let isValidate = false;
					
					for (var apiRole of roles) {
						
						for (var userRole of req.user.roles) {
							
							if(apiRole == userRole) {
								isValidate = true;
							}
						}
					}
					
					logger.debug(`authorize isValidate ${isValidate}`);
					
					if(isValidate) {
						
						logger.debug(`role for user ${req.user.roles} sending allowing access`);
					} else {
					
						// user's role is not authorized
						logger.debug(`role for user ${req.user.roles || 'no role'} sending 403 status`);
						return res.status(403).json({ message: 'Forbidden for the user' });
					}
                } else {
					
					logger.debug(`role for user ${req.user.roles || 'no role'} sending 403 status`);
					return res.status(403).json({ message: 'Forbidden for the user' });
                }
    
                // authentication and authorization successful
                next();
            }
        ];
       
    },

    schemas: {

        //Generic params
        idSchema: Joi.object().keys({
            param: Joi.number().required()
        }),

        //Platform Routes related
        platformSchema : Joi.object().keys({
           id: Joi.number().required()
        }),
		
		masterPlatformSchema : Joi.object().keys({
            name : Joi.string().required(),
			facet_count :  Joi.number().required(),
            model_svg_filename : Joi.string()
        }),
		
		masterChamberFamilySchema : Joi.object().keys({
            name : Joi.string().required(),
			platform_id :  Joi.number().required()
        }),
		
		updatemasterChamberFamilySchema : Joi.object().keys({
            id : Joi.number().required(),
			name :  Joi.string().required(),
			platform_id : Joi.number().required(),
			got_code : Joi.string().allow('').required()
        }),
		
		addmasterChamberSchema : Joi.object().keys({
            name :  Joi.string().required(),
			platform_id : Joi.number().required(),
			chamber_family_id : Joi.number().required(),
			got_code : Joi.string().allow('').required()
        }),
		
		updateMasterChamberSchema : Joi.object().keys({
            name :  Joi.string().required(),
			chamber_family_id : Joi.number().required(),
			got_code : Joi.string().allow('').required()
        }),
		
		
		 
		
		
        //Facet Routes related
        facetSchema : Joi.object().keys({
            name : Joi.string().required()
        }),

        //G2 Product Routes related
        g2productSchema : Joi.object().keys({
            name : Joi.string().required(),
            rnd_product_name : Joi.string().required(),
            rnd_product_code : Joi.string().required()
        }),



        platformProductSchema : Joi.object().keys({
            name : Joi.string().required(),
            code : Joi.string().required(),
            isRndType:Joi.boolean().required()
        }),


        //Product Routes related
        productSchema : Joi.object().keys({
            name : Joi.string().required(),
            code : Joi.string().required()
        }),

        productPutSchema : Joi.object().keys({
            name : Joi.string().required(),
            code : Joi.string().required()
        }),

        productConfigSchema : Joi.object().keys({
            product_name : Joi.string().required()
        }),

        
        productConfigMappingSchema : Joi.object().keys({
            facetIds: Joi.array().items(Joi.number()).required(),
            chamberIds: Joi.array().items(Joi.number()).required()
        }),


       

        productChamberSchema : Joi.object().keys({
            name : Joi.string().required(),
            positions:Joi.array().items(Joi.number()).required()
        }),


        //Chamber Routes related
        chamberSchema : Joi.object().keys({
            name : Joi.string().required(),
            got_code: Joi.string().required()
        }),



        productSearchChamberListSchema : Joi.object().keys({
            platformId : Joi.number().required(),
            chamberIds: Joi.array().items(Joi.number()).required()
        }),

        compatiblitySearchChamberListSchema : Joi.object().keys({
            platformId : Joi.number().required(),
            chamberIds: Joi.array().items(Joi.number()).required()
        }),

        
		validateSearchChamberListSchema : Joi.object().keys({
            selected_chamberId: Joi.number().required(),
            selected_facet_name : Joi.string().required(),
			platformId : Joi.number().required(),
			configuration : Joi.array().items(Joi.object().keys({                
                chamberIds : Joi.number().allow('').required(),
				facet_name : Joi.string().required()
            })).required()			
        }),
		
		validateInputSchemaOfChambers: Joi.object().keys({
            chamberName: Joi.array().items(Joi.string()).required(),
            customerName : Joi.array().items(Joi.string()).required()
            
        }),
		
		validateInputSchemaOfOtherCustCount: Joi.object().keys({
            chamberName: Joi.array().items(Joi.string()).required(),
            customerName : Joi.array().items(Joi.string()).required(),
			value:Joi.number()
            
        }),
		
		validateInputSchemaOfOthersCount: Joi.object().keys({
            chamberName: Joi.array().items(Joi.string()).required(),
            customerName : Joi.array().items(Joi.string()).required(),	
            value:Joi.number()
           		
        }),
		
		
		
		validateInputSchemaOfCustomerByChambers: Joi.object().keys({
            customerName : Joi.array().items(Joi.string()).required(),
			value: Joi.number()
        		
           		
        }),
		
		validateInputSchemaFabByChambers: Joi.object().keys({
            fabName : Joi.array().items(Joi.string()).required()	
           		
        }),
		
		validateInputSchemaChambersByFabForCustomer: Joi.object().keys({
            chamberName: Joi.array().items(Joi.string()).required(),
			value : Joi.number()
		}),
		
		validateSchemaforFabFilter: Joi.object().keys({
            fabNames: Joi.array().items(Joi.string()).required()
		}),
		
		validateSchemaforCustomerFlowChamberFilter: Joi.object().keys({
            chamberName: Joi.array().items(Joi.string()).required()
		}),
		
		validateSchemaforOtherChambersCount: Joi.object().keys({
            value: Joi.number().required()
		}),
		
		validateSchemaforOtherCustomersCount: Joi.object().keys({
            value: Joi.number().required()
		}),
		
		


        //Opportunity Routes related
        opportunitySchema : Joi.object().keys({
            op_id : Joi.string().required(),
            product_name : Joi.string().required(),
            product_code : Joi.string().required(),
            nearest_product_config_name : Joi.string(),
            platform_name : Joi.string().required(),
            configuration : Joi.array().items(Joi.object().keys({
                facet_name : Joi.string().required(),
                chamber_name:Joi.string().allow('').required()
            })).required()
        }),


        featuredSchema : Joi.object().keys({
            ui_type : Joi.string().required(),
            linked_element_type : Joi.string().required(),
            linked_element_id : Joi.number().required(),
            type_title : Joi.string().required(),
            title : Joi.string().required(),
            sub_title : Joi.string().required(),
            image_link : Joi.string().required(),
            image_filename : Joi.string().required(),
            serial_order : Joi.number().required(),
            tile_fg_color : Joi.string(),
            tile_bg_color : Joi.string(),
			url: Joi.string()
        }),


        latestSchema : Joi.object().keys({
            ui_type : Joi.string().required(),
            linked_element_type : Joi.string().required(),
            linked_element_id : Joi.number().required(),
            type_title : Joi.string().required(),
            title : Joi.string().required(),
            sub_title : Joi.string().required(),
            image_link : Joi.string().required(),
            image_filename : Joi.string().required(),
            serial_order : Joi.number().required()
        }),


        recommendedSchema : Joi.object().keys({
            ui_type : Joi.string().required(),
            linked_element_type : Joi.string().required(),
            linked_element_id : Joi.number().required(),
            type_title : Joi.string().required(),
            title : Joi.string().required(),
            sub_title : Joi.string().required(),
            image_link : Joi.string().required(),
            image_filename : Joi.string().required(),
            serial_order : Joi.number().required()
        }),

        platformDetailsSchema : Joi.object().keys({
            platform_id : Joi.number().required(),
            short_description_text : Joi.string().required(),
            image_link : Joi.string().required(),
            image_filename : Joi.string().required(),
            serial_order : Joi.number().required()
        }),

        explorermenunodeSchema : Joi.object().keys({
            name : Joi.string().required(),
            node_type_id : Joi.number().required(),
            g3mapper_id: Joi.number()
        }),

        compareNodesSchema : Joi.object().keys({

            nodeIds: Joi.array().items(Joi.number()).required()
        }),

        findComparableNodesSchema: Joi.object().keys({

            nodeIds: Joi.array().items(Joi.number()).required()
        }),

        explorerNodeMetadataSchema: Joi.object().keys({
            description : Joi.string().required().allow('').allow(null),
            search_keywords : Joi.string().required().allow('').allow(null),
            url : Joi.string().required().allow('').allow(null),
            tile_bg_color : Joi.string().required(),
            tile_fg_color : Joi.string().required(),
            tile_image_filename : Joi.string().required().allow('').allow(null),
            tile_image_link : Joi.string().required().allow('').allow(null)   
        }),

        explorerNodeRecommendedSchema : Joi.object().keys({
            recommended_nodes_list : Joi.array().items(Joi.number()).required()
           
        }),

        metadataMediaSchema : Joi.object().keys({

            media_filename : Joi.string().required(),
            media_file_url : Joi.string().required(),
            media_type : Joi.string().required(),
            serial_order : Joi.number().required()
        }),

        menuNodeTypeSchema : Joi.object().keys({
            name : Joi.string().required()
        }),
        
        
        //Node Type Attribute Names Routes related
        nodeTypeAttributeNameSchema : Joi.object().keys({
            name : Joi.string().required(),
            attr_type_id : Joi.number().required()
        }),

		metadataAttrValuesSchema : Joi.object().keys({
            value : Joi.string().required(),
            attr_name_id : Joi.number().required(),
            descriptionValue: Joi.array().items(Joi.object().keys({
                description : Joi.string().allow(''),
            })).required()
        }),

        getSuggestionsSchema : Joi.object().keys({
            partial_search_term : Joi.string().required(),
            other_search_terms: Joi.array().items(Joi.string()).required(),
            include_links : Joi.bool().required(),
            filters: Joi.array().items(Joi.object().keys({
                    category : Joi.string().allow('').required(),
                    items : Joi.array().items(Joi.object().keys({
                            name : Joi.string().allow('').required(),
                            is_active : Joi.bool().required()
                    })).required()
            })).required()
        }),


        getSearchResultsSchema : Joi.object().keys({
            search_terms: Joi.array().items(Joi.string()).required(),
            filters: Joi.array().items(Joi.object().keys({
                category : Joi.string().allow('').required(),
                items : Joi.array().items(Joi.object().keys({
                        name : Joi.string().allow('').required(),
                        is_active : Joi.bool().required()
                })).required()
            })).required()
        }),

        addBuilderConfigurationSchema : Joi.object().keys({

            config_name : Joi.string().required(),
            created_by_id : Joi.string().allow(''),
            created_by_name : Joi.string().allow(''),
            modified_by_id : Joi.string().allow(''),
            modified_by_name : Joi.string().allow(''),
            c_date : Joi.string().allow(''),
            m_date : Joi.string().allow(''),
            platform_family_id : Joi.string().required(),
            customer_id : Joi.string().required(),
            customer_project_no : Joi.string().allow(''),

            configuration : Joi.array().items(Joi.object().keys({
                facet_name : Joi.string().allow('').required(),
                chamber_name:Joi.string().allow('').required(),
                chamber_family_name:Joi.string().allow('').required(),
				chamber_id: Joi.string().allow(''),
				chamber_family_id: Joi.string().allow('')
            })).required()
        }),
      
         updateBuilderConfigurationSchema : Joi.object().keys({

            config_id : Joi.number().required(),
			customer_id: Joi.number().required(),
            config_name : Joi.string().required(),
            modified_by_id : Joi.string().allow(''),
            modified_by_name : Joi.string().allow(''),
            m_date : Joi.string().allow(''),

            configuration : Joi.array().items(Joi.object().keys({
				id : Joi.string().required(),
				config_id : Joi.string().required(),
                facet_name : Joi.string().allow('').required(),
                chamber_name:Joi.string().allow('').required(),
                chamber_family_name:Joi.string().allow('').required(),
				chamber_id: Joi.string().allow(''),
				chamber_family_id: Joi.string().allow('')
            })).required()
        }),

		addNSOConfigurationSchema : Joi.object().keys({

            config_name : Joi.string().required(),
            created_by_id : Joi.string().allow(''),
            created_by_name : Joi.string().allow(''),
            modified_by_id : Joi.string().allow(''),
            modified_by_name : Joi.string().allow(''),
            g3_platform_id : Joi.string().required(),
            customer_id : Joi.string().required(),
            customer_project_no : Joi.string().allow(''),

            configuration : Joi.array().items(Joi.object().keys({
                facet_name : Joi.string().allow('').required(),
                explorer_chamber_name:Joi.string().allow('').required(),
                explorer_chamber_family_name:Joi.string().allow('').required(),
				explorer_chamber_id: Joi.string().allow(''),
                explorer_chamber_family_id: Joi.string().allow(''),
				facet_id: Joi.string().allow('').required()
            })).required()
        }),
		
		updateCustomerSchema : Joi.object().keys({
            name : Joi.string().required()
        }),
		
		validateSchemaforUserRoles : Joi.object().keys({
            username : Joi.string().required(),
            password : Joi.string().required()

        }),
		
		validateUpgradeChamberRules : Joi.object().keys({
            
            chamber_family_id : Joi.number().required(),
            chamber_ids : Joi.array().items(Joi.number()).required(),
			platform_family_id : Joi.number().required()
           
        }),
		
		validateUpdateUpgradeChamberRules : Joi.object().keys({
            rule_id :Joi.number().required(),
            chamber_family_id : Joi.number().required(),
            chamber_ids : Joi.array().items(Joi.number()).required(),
           
        }),
		
		validateConfigChangeChamberRules : Joi.object().keys({
    	    platformId : Joi.number().required(),
			chamberfamilies : Joi.array().items(Joi.object().keys({
                chamberfamilyId : Joi.number().required(),
				chamberIds: Joi.array().items(Joi.number()).required() 
            })).required()
        }),
		
		validateAddPlatformCoreDataLinkSchema : Joi.object().keys({
            platform_name : Joi.string().required(),  
            core_platform_id : Joi.number().required(),			
            core_platform_name : Joi.string().required()
        }),
		
		
		sendMailSchema : Joi.array().items(
			Joi.object().keys({
				from : Joi.string().required(),
				to: Joi.array().items(Joi.string()).required(),
				cc: Joi.array().items(Joi.string()).required(),
				bcc: Joi.array().items(Joi.string()).required(),
				subject : Joi.string().required(),
				body : Joi.string().required(),
				attachments : Joi.array().items(
					Joi.object().keys({
						filename: Joi.string().required(),
						base64_encoded:Joi.string().required()
					})
				).required()

			})
		).required()

    }
}