const express = require('express');
const router = require('express-promise-router')();

const menuNodeTypesController = require('../controllers/menunodetypes');
const {validateParam, validateBody, authorize, schemas} = require('../helpers/routes-helper');
const roles  = require('../helpers/roles');


router.route('/')
    .get(authorize([roles.SuperAdmin, roles.ExplorerAdmin, roles.ExplorerUser]), menuNodeTypesController.index)
    .post([authorize([roles.SuperAdmin, roles.ExplorerAdmin]), validateBody(schemas.menuNodeTypeSchema)] ,menuNodeTypesController.newMenuNodeType);

router.route('/:menuNodeTypeId')
     .delete([authorize([roles.SuperAdmin, roles.ExplorerAdmin]), validateParam(schemas.idSchema, 'menuNodeTypeId')],menuNodeTypesController.removeMenuNodeType);



module.exports = router;
    

