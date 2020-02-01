const express = require('express');

const router = require('express-promise-router')();

const opportunitiesController = require('../controllers/opportunity');
const {validateParam, validateBody, authorize, schemas} = require('../helpers/routes-helper');
const roles  = require('../helpers/roles');

router.route('/')
    .get(authorize([roles.SuperAdmin, roles.MapperAdmin]), opportunitiesController.index)
    .post([authorize([roles.SuperAdmin, roles.MapperAdmin, roles.MapperUser]), validateBody(schemas.opportunitySchema)] ,opportunitiesController.newOpportunity);

// router.route('/:opportunityId')
//     .get(validateParam(schemas.idSchema, 'opportunityId'),opportunitiesController.getOpportunity);


module.exports = router;