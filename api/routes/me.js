const express = require('express');
const router = require('express-promise-router')();

const meController = require('../controllers/me');
const {validateParam, validateBody, authorize, schemas} = require('../helpers/routes-helper');
const roles  = require('../helpers/roles');

router.route('/')
    .get(authorize([roles.SuperAdmin]), meController.index);

module.exports = router;