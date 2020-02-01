const express = require('express');

const router = require('express-promise-router')();

const productConfigsController = require('../controllers/productconfigs');
const {validateParam, validateBody, authorize, schemas} = require('../helpers/routes-helper');
const roles  = require('../helpers/roles');

router.route('/')
    .get(authorize([roles.SuperAdmin, roles.MapperAdmin]), productConfigsController.index)
    .post([authorize([roles.SuperAdmin, roles.MapperAdmin]), validateBody(schemas.productConfigSchema)] ,productConfigsController.newProductConfig);

router.route('/:productConfigId')
//     .get(validateParam(schemas.idSchema, 'productId') ,productsController.getProduct)
     .put([authorize([roles.SuperAdmin, roles.MapperAdmin]), validateParam(schemas.idSchema, 'productConfigId'), validateBody(schemas.productConfigSchema)],productConfigsController.updateProductConfig)
//     .patch([validateParam(schemas.idSchema, 'productId'), validateBody(schemas.productPatchSchema)],productsController.updateProduct)
    .delete([authorize([roles.SuperAdmin, roles.MapperAdmin]), validateParam(schemas.idSchema, 'productConfigId')], productConfigsController.removeProductConfig);
    
    
router.route('/:productConfigId/facets')
    .get([authorize([roles.SuperAdmin, roles.MapperAdmin]), validateParam(schemas.idSchema, 'productConfigId')], productConfigsController.getFacets);

router.route('/:productConfigId/chambers')
    .get([authorize([roles.SuperAdmin, roles.MapperAdmin]), validateParam(schemas.idSchema, 'productConfigId')], productConfigsController.getChambers);
module.exports = router;