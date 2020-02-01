const express = require('express');
const router = require('express-promise-router')();

const recommendedController = require('../controllers/recommended');
const {validateParam, validateBody, authorize, schemas} = require('../helpers/routes-helper');
const roles  = require('../helpers/roles');

router.route('/')
    .post([authorize([roles.SuperAdmin, roles.ExplorerAdmin]), validateBody(schemas.recommendedSchema)] ,recommendedController.newRecommended);

router.route('/:recommendedId')
     .put([authorize([roles.SuperAdmin, roles.ExplorerAdmin]), validateParam(schemas.idSchema, 'recommendedId'), validateBody(schemas.recommendedSchema)], recommendedController.updateRecommended)
     .delete([authorize([roles.SuperAdmin, roles.ExplorerAdmin]), validateParam(schemas.idSchema, 'recommendedId')], recommendedController.removeRecommended);


module.exports = router;