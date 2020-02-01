const express = require('express');
const router = require('express-promise-router')();

const users = require('../controllers/users');
const {validateParam, validateBody, authorize, schemas} = require('../helpers/routes-helper');
const roles  = require('../helpers/roles');


router.route('/')
    .get(authorize([roles.SuperAdmin]), users.index);
	
router.route('/getUserRoles')
     .post([authorize([roles.SuperAdmin]), validateBody(schemas.validateSchemaforUserRoles)],users.getUserRoles);
  



module.exports = router;