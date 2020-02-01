const express = require('express');

const router = require('express-promise-router')();

const chambersController = require('../controllers/chambers');
const {validateParam, validateBody, authorize, schemas} = require('../helpers/routes-helper');
const roles  = require('../helpers/roles');

 router.route('/')
     .get(authorize([roles.SuperAdmin, roles.MapperAdmin, roles.MapperUser]), chambersController.index)
     .post([authorize([roles.SuperAdmin, roles.MapperAdmin]), validateBody(schemas.chamberSchema)] ,chambersController.newChamber);
	
router.route('/CoreDataToG3MapperPlatformLink')
    .put([authorize([roles.SuperAdmin, roles.MapperAdmin, roles.MapperUser]), validateBody(schemas.validateAddPlatformCoreDataLinkSchema)], chambersController.addCoreDataToG3MapperPlatformLink)
    .get(authorize([roles.SuperAdmin, roles.MapperAdmin]), chambersController.getCoreDataToMapperPlatformDetails)
	
	
 router.route('/:chamberId')
//   .get(validateParam(schemas.idSchema, 'chamberId'),chambersController.getChamber)
     .put([authorize([roles.SuperAdmin, roles.MapperAdmin]), validateParam(schemas.idSchema, 'chamberId'), validateBody(schemas.chamberSchema)], chambersController.updateChamber)
//   .patch([validateParam(schemas.idSchema, 'chamberId'), validateBody(schemas.chamberOptionalSchema)], chambersController.updateChamber)
     .delete([authorize([roles.SuperAdmin, roles.MapperAdmin]), validateParam(schemas.idSchema, 'chamberId')], chambersController.removeChamber);

router.route('/FindProductsForChambers')
    .post([authorize([roles.SuperAdmin, roles.MapperAdmin, roles.MapperUser]), validateBody(schemas.productSearchChamberListSchema)], chambersController.findProductsBySelectedChambersV2);


router.route('/FindCompatibilityInfoForChambers')
    .post([authorize([roles.SuperAdmin, roles.MapperAdmin, roles.MapperUser]), validateBody(schemas.compatiblitySearchChamberListSchema)], chambersController.findCompatibilityDataForSelectedChambersV2);
	
router.route('/validateChamberCompatibiltyByPosition')
    .post([authorize([roles.SuperAdmin, roles.MapperAdmin, roles.MapperUser]), validateBody(schemas.validateSearchChamberListSchema)], chambersController.validateChamberPosition);

	 


// router.route('/:chamberId/products')
//      .get(validateParam(schemas.idSchema, 'chamberId'),chambersController.getChamberProducts)
//      .post([validateParam(schemas.idSchema, 'chamberId'), validateBody(schemas.chamberProductSchema)], chambersController.chamberNewProduct);



module.exports = router;
    

