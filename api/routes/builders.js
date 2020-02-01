const express = require('express');
const router = require('express-promise-router')();

const builderController = require('../controllers/builders');
const {validateParam, validateBody, authorize, schemas} = require('../helpers/routes-helper');
const roles  = require('../helpers/roles');

router.route('/')
    .get(authorize([roles.SuperAdmin, roles.BuilderAdmin, roles.BuilderUser]), builderController.index);

router.route('/AddConfiguration')
    .post([authorize([roles.SuperAdmin, roles.BuilderAdmin, roles.BuilderUser]), validateBody(schemas.addBuilderConfigurationSchema)], builderController.addConfiguration);

router.route('/getConfiguration')
    .get(authorize([roles.SuperAdmin, roles.BuilderAdmin, roles.BuilderUser]), builderController.getConfigurationByCustomerID);

router.route('/getConfigurationDetails')
    .get(authorize([roles.SuperAdmin, roles.BuilderAdmin, roles.BuilderUser]), builderController.getConfigurationDetails);

router.route('/UpdateConfiguration')
    .post([authorize([roles.SuperAdmin, roles.BuilderAdmin, roles.BuilderUser]), validateBody(schemas.updateBuilderConfigurationSchema)], builderController.updateConfiguration);

router.route('/DeleteConfiguration')
    .delete(authorize([roles.SuperAdmin, roles.BuilderAdmin, roles.BuilderUser]), builderController.deleteConfiguration);

router.route('/CopyConfiguration')
    .get(authorize([roles.SuperAdmin, roles.BuilderAdmin, roles.BuilderUser]), builderController.copyConfiguration);
	
router.route('/updateConfigNSOFlag')
    .get(authorize([roles.SuperAdmin, roles.BuilderAdmin, roles.BuilderUser]), builderController.updateConfigNSOFlag);
	
router.route('/builderConfigSearch')
    .get(authorize([roles.SuperAdmin, roles.BuilderAdmin, roles.BuilderUser]), builderController.builderConfigSearch);
	
router.route('/getNewTitle')
    .get(authorize([roles.SuperAdmin, roles.BuilderAdmin, roles.BuilderUser]), builderController.getNewConfigurationTitle);
	
router.route('/search_chambers')
    .get(authorize([roles.SuperAdmin, roles.BuilderAdmin, roles.BuilderUser]), builderController.chambersSearch);	
	
     
router.route('/insertAllPlatformConfigurationForSystemIds')
    .get(authorize([roles.SuperAdmin]), builderController.insertAllPlatformConfigurations);	
	

router.route('/getSystemIdsWithAllFacets')
    .get(authorize([roles.SuperAdmin, roles.BuilderAdmin, roles.BuilderUser]), builderController.getAllSystemIdsAllFacets);	

router.route('/getChamberNamesForFacet')
    .get(authorize([roles.SuperAdmin, roles.BuilderAdmin, roles.BuilderUser]), builderController.getChamberFacetsAandB);	
	
router.route('/getBuilderPlatforms')
    .get(authorize([roles.SuperAdmin, roles.BuilderAdmin, roles.BuilderUser]), builderController.getBuilderPlatforms);


router.route('/getBuilderChamberFamilies')
    .get([authorize([roles.SuperAdmin, roles.BuilderAdmin, roles.BuilderUser])], builderController.getBuilderChamberFamilies);
	
   
router.route('/getPossibleUpgradeChambers')
     .get([authorize([roles.SuperAdmin, roles.BuilderAdmin, roles.BuilderUser])], builderController.getPossibleUpgradeChambers);

	   
router.route('/getBuilderChamberFamiliesForPlatform')
    .get([authorize([roles.SuperAdmin, roles.BuilderAdmin, roles.BuilderUser])], builderController.getBuilderChamberFamiliesForPlatform);

	
router.route('/addUpgradeChamberRules')
    .post([authorize([roles.SuperAdmin, roles.BuilderAdmin, roles.BuilderUser]), validateBody(schemas.validateUpgradeChamberRules)], builderController.addUpgradeChamberRules);
	

router.route('/addConfigChangeChamberRules')
    .post([authorize([roles.SuperAdmin, roles.BuilderAdmin, roles.BuilderUser]), validateBody(schemas.validateConfigChangeChamberRules)], builderController.addConfigChangeChamberRules);

	
router.route('/updateUpgradeChamberRules')
    .post([authorize([roles.SuperAdmin, roles.BuilderAdmin, roles.BuilderUser]), validateBody(schemas.validateUpdateUpgradeChamberRules)], builderController.updateUpgradeChamberRules);
	
	
router.route('/getUpgradeChamberRules')
     .get([authorize([roles.SuperAdmin, roles.BuilderAdmin, roles.BuilderUser])], builderController.getUpgradeChamberRules);
	 

router.route('/getAllUpgradeChamberRules')
     .get([authorize([roles.SuperAdmin, roles.BuilderAdmin, roles.BuilderUser])], builderController.getAllUpgradeChamberRules);
	
router.route('/deleteUpgradeChamberRules')
     .get([authorize([roles.SuperAdmin, roles.BuilderAdmin, roles.BuilderUser])], builderController.deleteUpgradeChamberRules);

router.route('/:builderNodeId/children')
    .get([authorize([roles.SuperAdmin, roles.BuilderAdmin, roles.BuilderUser]), validateParam(schemas.idSchema, 'builderNodeId')], builderController.getBuilderNodeChildren);
	
router.route('/getAllConfigChangeChambersRules')
     .get([authorize([roles.SuperAdmin, roles.BuilderAdmin, roles.BuilderUser])], builderController.getAllConfigChangeChambersRules);

    
router.route('/insertMasterConfigurationForSystemIds')
    .get(authorize([roles.SuperAdmin]), builderController.insertMasterConfigurations);	
	
router.route('/getSystemIdsWithEmptyFacets')
    .get(authorize([roles.SuperAdmin, roles.BuilderAdmin, roles.BuilderUser]), builderController.getAllSystemIdsAllFacets);	
	
module.exports = router;