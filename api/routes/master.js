const express = require('express');
const router = require('express-promise-router')();

const masterController = require('../controllers/master');
const {validateParam, validateBody, authorize, schemas} = require('../helpers/routes-helper');
const roles  = require('../helpers/roles');

router.route('/')
    .get(authorize([roles.SuperAdmin, roles.BuilderAdmin, roles.BuilderUser]), masterController.index);

router.route('/getMasterCustomers')
    .get(authorize([roles.SuperAdmin, roles.BuilderAdmin, roles.BuilderUser]), masterController.getMasterCustomers);
	
router.route('/getMasterFabs')
    .get(authorize([roles.SuperAdmin, roles.BuilderAdmin, roles.BuilderUser]), masterController.getMasterFabs);
	
router.route('/getMasterProjectNoByFabId')
    .get(authorize([roles.SuperAdmin, roles.BuilderAdmin, roles.BuilderUser]), masterController.getMasterProjectNoByFabId);
	
	
router.route('/getMasterProjectNumbersByCustomerId')
    .get(authorize([roles.SuperAdmin, roles.BuilderAdmin, roles.BuilderUser]), masterController.getMasterProjectNumbersByCustomerId);
	
router.route('/getMasterSystemIdConfigurations')
    .get(authorize([roles.SuperAdmin, roles.BuilderAdmin, roles.BuilderUser]), masterController.getMasterSystemIdConfigurations);
	
	
router.route('/getMasterAllSystemIdConfigurations')
    .get(authorize([roles.SuperAdmin, roles.BuilderAdmin, roles.BuilderUser]), masterController.getMasterAllSystemIdConfigurations);
	
router.route('/search_masterchambers')
    .get(authorize([roles.SuperAdmin, roles.BuilderAdmin, roles.BuilderUser]), masterController.masterchambersSearch);	
	
	
router.route('/getMasterEmptySystemIdConfigurations')
    .get(authorize([roles.SuperAdmin, roles.BuilderAdmin, roles.BuilderUser]), masterController.getMasterEmptySystemIdConfigurations);
	
	
router.route('/addNewMasterPlatform')
    .post([authorize([roles.SuperAdmin, roles.BuilderAdmin]), validateBody(schemas.masterPlatformSchema)] ,masterController.addNewMasterPlatform);


router.route('/:platform_id')
     .put([authorize([roles.SuperAdmin, roles.BuilderAdmin]), validateParam(schemas.idSchema, 'platform_id'), validateBody(schemas.masterPlatformSchema)], masterController.updateMasterPlatform)
	 .delete([authorize([roles.SuperAdmin, roles.BuilderAdmin]), validateParam(schemas.idSchema, 'platform_id')],masterController.removeMasterPlatform);
    
    
	
router.route('/addNewMasterChamberFamily')
    .post([authorize([roles.SuperAdmin, roles.BuilderAdmin]), validateBody(schemas.masterChamberFamilySchema)] ,masterController.addMasterChamberFamilies);

router.route('/updateMasterChamberFamilies')
    .post([authorize([roles.SuperAdmin, roles.BuilderAdmin]), validateBody(schemas.updatemasterChamberFamilySchema)] ,masterController.updateMasterChamberFamilies);
  
	
router.route('/addNewMasterChamber')
    .post([authorize([roles.SuperAdmin, roles.BuilderAdmin]), validateBody(schemas.addmasterChamberSchema)] ,masterController.addMasterChambers);

router.route('/getMasterPlatformsNotInMapper')
    .get([authorize([roles.SuperAdmin, roles.BuilderAdmin])] ,masterController.getMasterPlatformsNotInMapper);
	

router.route('/getMasterPlatforms')
    .get([authorize([roles.SuperAdmin, roles.BuilderAdmin])] ,masterController.getMasterPlatforms);
	

router.route('/chamber/:chamberId')
     .put([authorize([roles.SuperAdmin, roles.BuilderAdmin]), validateParam(schemas.idSchema, 'chamberId'), validateBody(schemas.updateMasterChamberSchema)], masterController.updateMasterChamber)
	 .delete([authorize([roles.SuperAdmin, roles.BuilderAdmin]), validateParam(schemas.idSchema, 'chamberId')],masterController.removeMasterChamber);
	
router.route('/chamberFamily/:chamberFamilyId')
     .delete([authorize([roles.SuperAdmin, roles.BuilderAdmin]), validateParam(schemas.idSchema, 'chamberFamilyId')],masterController.removeMasterChamberFamily);
	

	

    

module.exports = router;