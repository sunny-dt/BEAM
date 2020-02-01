const express = require('express');

const router = require('express-promise-router')();

const productsController = require('../controllers/g3products');
const {validateParam, validateBody, authorize, schemas} = require('../helpers/routes-helper');
const roles  = require('../helpers/roles');

router.route('/')
    .get(authorize([roles.SuperAdmin, roles.MapperAdmin]), productsController.index)
    .post([authorize([roles.SuperAdmin, roles.MapperAdmin]), validateBody(schemas.productSchema)] ,productsController.newG3Product);
    
router.route('/:g3productId')
    .put([authorize([roles.SuperAdmin, roles.MapperAdmin]), validateParam(schemas.idSchema, 'g3productId'), validateBody(schemas.productPutSchema)], productsController.updateG3Product)
    .delete([authorize([roles.SuperAdmin, roles.MapperAdmin]), validateParam(schemas.idSchema, 'g3productId')], productsController.removeG3Product);


module.exports = router;