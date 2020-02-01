const express = require('express');
const router = require('express-promise-router')();

const featuredController = require('../controllers/featured');
const {validateParam, validateBody, authorize, schemas} = require('../helpers/routes-helper');
const roles  = require('../helpers/roles');

router.route('/')
    .get(authorize([roles.SuperAdmin, roles.ExplorerAdmin, roles.ExplorerUser]), featuredController.index)
    .post([authorize([roles.SuperAdmin, roles.ExplorerAdmin]), validateBody(schemas.featuredSchema)] ,featuredController.newFeatured);

router.route('/:featuredId')
     .put([authorize([roles.SuperAdmin, roles.ExplorerAdmin]), validateParam(schemas.idSchema, 'featuredId'), validateBody(schemas.featuredSchema)], featuredController.updateFeatured)
     .delete([authorize([roles.SuperAdmin, roles.ExplorerAdmin]), validateParam(schemas.idSchema, 'featuredId')], featuredController.removeFeatured);


module.exports = router;