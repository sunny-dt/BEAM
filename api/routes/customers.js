const express = require('express');
const router = require('express-promise-router')();

const customerController = require('../controllers/customers');
const {validateParam, validateBody, authorize, schemas} = require('../helpers/routes-helper');
const roles  = require('../helpers/roles');

router.route('/')
    .get(authorize([roles.SuperAdmin, roles.BuilderUser]), customerController.index);

router.route('/ProjectNumbers')
    .get(authorize([roles.SuperAdmin, roles.BuilderUser]), customerController.getProjectNumbers);

router.route('/AddCustomer')
    .get(authorize([roles.SuperAdmin]), customerController.addCustomer);
	
router.route('/UpdateCustomer')
    .put([authorize([roles.SuperAdmin]), validateBody(schemas.updateCustomerSchema)], customerController.updateCustomer);
	
router.route('/DeleteCustomer')
    .delete([authorize([roles.SuperAdmin])], customerController.removeCustomer);
	
module.exports = router;