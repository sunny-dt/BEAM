const express = require('express');
const router = require('express-promise-router')();

const attrTypesController = require('../controllers/metadata_table_attr_types');
const {validateParam, validateBody, authorize, schemas} = require('../helpers/routes-helper');
const roles  = require('../helpers/roles');


router.route('/')
    .get(authorize([roles.SuperAdmin, roles.ExplorerAdmin, roles.ExplorerUser]), attrTypesController.index);



module.exports = router;