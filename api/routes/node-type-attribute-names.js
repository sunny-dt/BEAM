const express = require('express');
const router = require('express-promise-router')();

const nodeTypeAttributeNamesController = require('../controllers/node-type-attribute-names');
const {validateParam, validateBody, authorize, schemas} = require('../helpers/routes-helper');
const roles  = require('../helpers/roles');

router.route('/')
    .get(authorize([roles.SuperAdmin, roles.ExplorerAdmin]), nodeTypeAttributeNamesController.index)
     .post([authorize([roles.SuperAdmin, roles.ExplorerAdmin]), validateBody(schemas.nodeTypeAttributeNameSchema)] ,nodeTypeAttributeNamesController.newNodeTypeAttributeName);

router.route('/:nodeTypeAttributeNameId')
     .put([authorize([roles.SuperAdmin, roles.ExplorerAdmin]), validateParam(schemas.idSchema, 'nodeTypeAttributeNameId'), validateBody(schemas.nodeTypeAttributeNameSchema)], nodeTypeAttributeNamesController.updateNodeTypeAttributeName)
     .delete([authorize([roles.SuperAdmin, roles.ExplorerAdmin]), validateParam(schemas.idSchema, 'nodeTypeAttributeNameId')], nodeTypeAttributeNamesController.removeNodeTypeAttributeName);

router.route('/:nodeTypeAttributeNameId/reorder/:newPosition')
     .put([authorize([roles.SuperAdmin, roles.ExplorerAdmin]), validateParam(schemas.idSchema, 'nodeTypeAttributeNameId'), validateParam(schemas.idSchema, 'newPosition')], nodeTypeAttributeNamesController.reorderAttributeName);

module.exports = router;
    

