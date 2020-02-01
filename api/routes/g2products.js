const express = require('express');
const router = require('express-promise-router')();

const g2productsController = require('../controllers/g2products');
const {validateParam, validateBody, authorize, schemas} = require('../helpers/routes-helper');
const roles  = require('../helpers/roles');

router.route('/')
    .get(authorize([roles.SuperAdmin, roles.MapperAdmin]), g2productsController.index)
    .post([authorize([roles.SuperAdmin, roles.MapperAdmin]), validateBody(schemas.g2productSchema)] ,g2productsController.newG2Product);

router.route('/:g2productId')
     .put([authorize([roles.SuperAdmin, roles.MapperAdmin]), validateParam(schemas.idSchema, 'g2productId'), validateBody(schemas.g2productSchema)], g2productsController.updateG2Product)
     .delete([authorize([roles.SuperAdmin, roles.MapperAdmin]), validateParam(schemas.idSchema, 'g2productId')], g2productsController.removeG2Product);

// router.route('/:g2productId/chambers')
//      .get(validateParam(schemas.idSchema, 'g2productId'),g2productsController.getG2ProductChambers)

module.exports = router;
    

