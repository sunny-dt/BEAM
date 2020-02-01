const express = require('express');

const router = require('express-promise-router')();

const productConfigMappingsController = require('../controllers/productconfigmappings');
const {validateParam, validateBody, authorize, schemas} = require('../helpers/routes-helper');
const roles  = require('../helpers/roles');

router.route('/')
    .get(authorize([roles.SuperAdmin, roles.MapperAdmin]), productConfigMappingsController.index)
    .post([authorize([roles.SuperAdmin, roles.MapperAdmin]), validateBody(schemas.productConfigMappingSchema)] ,productConfigMappingsController.newProductConfigMapping);

router.route('/:facetGroupId')
     .put([authorize([roles.SuperAdmin, roles.MapperAdmin]), validateParam(schemas.idSchema, 'facetGroupId'), validateBody(schemas.productConfigMappingSchema)],productConfigMappingsController.updateProductConfigMapping)
    .delete([authorize([roles.SuperAdmin, roles.MapperAdmin]), validateParam(schemas.idSchema, 'facetGroupId')], productConfigMappingsController.removeProductConfigMapping);


module.exports = router;