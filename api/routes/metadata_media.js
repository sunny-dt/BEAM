const express = require('express');
const router = require('express-promise-router')();

const mediaController = require('../controllers/metadata_media');
const {validateParam, validateBody, authorize, schemas} = require('../helpers/routes-helper');
const roles  = require('../helpers/roles');

    

router.route('/:mediaId')
     .put([authorize([roles.SuperAdmin, roles.ExplorerAdmin]), validateParam(schemas.idSchema, 'mediaId'), validateBody(schemas.metadataMediaSchema)], mediaController.updateMedia)
     .delete([authorize([roles.SuperAdmin, roles.ExplorerAdmin]), validateParam(schemas.idSchema, 'mediaId')], mediaController.removeMedia);

module.exports = router;