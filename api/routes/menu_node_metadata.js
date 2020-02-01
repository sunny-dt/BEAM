const express = require('express');
const router = require('express-promise-router')();

const metadataController = require('../controllers/menu_node_metadata');
const {validateParam, validateBody, authorize, schemas} = require('../helpers/routes-helper');
const roles  = require('../helpers/roles');

    

router.route('/:metadataId')
     .put([authorize([roles.SuperAdmin, roles.ExplorerAdmin]), validateParam(schemas.idSchema, 'metadataId'), validateBody(schemas.explorerNodeMetadataSchema)], metadataController.updateMetadata)
     .delete([authorize([roles.SuperAdmin, roles.ExplorerAdmin]), validateParam(schemas.idSchema, 'metadataId')], metadataController.removeMetadata);

router.route('/:metadataId/media')
     .get([authorize([roles.SuperAdmin, roles.ExplorerAdmin, roles.ExplorerUser]), validateParam(schemas.idSchema, 'metadataId')], metadataController.getMediaForNodeMetadata)
     .post([authorize([roles.SuperAdmin, roles.ExplorerAdmin]), validateParam(schemas.idSchema, 'metadataId'), validateBody(schemas.metadataMediaSchema)] ,metadataController.newMediaForNodeMetadata)


router.route('/:metadataId/attr_values')
     .get([authorize([roles.SuperAdmin, roles.ExplorerAdmin, roles.ExplorerUser]), validateParam(schemas.idSchema, 'metadataId')], metadataController.getAttrValuesForNodeMetadata)
     .post([authorize([roles.SuperAdmin, roles.ExplorerAdmin]), validateParam(schemas.idSchema, 'metadataId'), validateBody(schemas.metadataAttrValuesSchema)] ,metadataController.newAttrValueForNodeMetadata)

module.exports = router;