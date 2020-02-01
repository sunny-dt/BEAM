const express = require('express');
const router = require('express-promise-router')();

const latestController = require('../controllers/latest');
const {validateParam, validateBody, authorize, schemas} = require('../helpers/routes-helper');
const roles  = require('../helpers/roles');

router.route('/')
    .get(authorize([roles.SuperAdmin, roles.ExplorerAdmin, roles.ExplorerUser]), latestController.index)
    .post([authorize([roles.SuperAdmin, roles.ExplorerAdmin]), validateBody(schemas.latestSchema)] ,latestController.newLatest);

router.route('/:latestId')
     .put([authorize([roles.SuperAdmin, roles.ExplorerAdmin]), validateParam(schemas.idSchema, 'latestId'), validateBody(schemas.latestSchema)], latestController.updateLatest)
     .delete([authorize([roles.SuperAdmin, roles.ExplorerAdmin]), validateParam(schemas.idSchema, 'latestId')], latestController.removeLatest);


module.exports = router;