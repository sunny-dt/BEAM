const express = require('express');
const router = require('express-promise-router')();

const nsoConfigController = require('../controllers/NSOConfigs');
const {validateParam, validateBody, authorize, schemas} = require('../helpers/routes-helper');
const roles  = require('../helpers/roles');

router.route('/')
    .get(authorize([roles.SuperAdmin, roles.BuilderAdmin, roles.BuilderUser]), nsoConfigController.index);

router.route('/AddNSOConfiguration')
    .post([authorize([roles.SuperAdmin, roles.BuilderAdmin, roles.BuilderUser]), validateBody(schemas.addNSOConfigurationSchema)], nsoConfigController.addNSOConfiguration);

router.route('/getNSOConfiguration')
    .get(authorize([roles.SuperAdmin, roles.BuilderAdmin, roles.BuilderUser]), nsoConfigController.getNSOConfigurationByCustomerID);

router.route('/getNSOConfigurationDetails')
    .get(authorize([roles.SuperAdmin, roles.BuilderAdmin, roles.BuilderUser]), nsoConfigController.getNSOConfigurationDetails);
	
	
router.route('/getAllPlatforms')
    .get(authorize([roles.SuperAdmin, roles.BuilderAdmin, roles.BuilderUser]), nsoConfigController.getAllPlatforms);   


// router.route('/UpdateNSOConfiguration')
//     .post([authorize([roles.Admin, roles.User]), validateBody(schemas.updateBuilderConfigurationSchema)], nsoConfigController.updateNSOConfiguration);

//router.route('/DeleteNSOConfiguration')
//    .delete(authorize([roles.Admin, roles.User]), nsoConfigController.deleteNSOConfiguration);
	
module.exports = router;