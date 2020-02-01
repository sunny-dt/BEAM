const express = require('express');
const router = require('express-promise-router')();

const helperApiController = require('../controllers/helper-api');
const {validateParam, validateBody, authorize, schemas} = require('../helpers/routes-helper');
const roles  = require('../helpers/roles');

router.route('/SendMail')
     .post([authorize([roles.SuperAdmin, roles.BuilderUser]), validateBody(schemas.sendMailSchema)] ,helperApiController.sendNewMail);



module.exports = router;
    

