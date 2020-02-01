const express = require('express');
const router = require('express-promise-router')();

const attrValuesController = require('../controllers/metadata-attr-values');
const {validateParam, validateBody, authorize, schemas} = require('../helpers/routes-helper');
const roles  = require('../helpers/roles');

    

router.route('/:attrValueMapId')
     .put([authorize([roles.SuperAdmin, roles.ExplorerAdmin]), validateParam(schemas.idSchema, 'attrValueMapId'), validateBody(schemas.metadataAttrValuesSchema)], attrValuesController.updateAttrValue)
     .delete([authorize([roles.SuperAdmin, roles.ExplorerAdmin]), validateParam(schemas.idSchema, 'attrValueMapId')], attrValuesController.removeAttrValue);

module.exports = router;