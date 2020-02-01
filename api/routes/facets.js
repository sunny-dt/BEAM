const express = require('express');
const router = require('express-promise-router')();

const facetsController = require('../controllers/facets');
const {validateParam, validateBody, authorize, schemas} = require('../helpers/routes-helper');
const roles  = require('../helpers/roles');

router.route('/')
    .get(authorize([roles.SuperAdmin]), facetsController.index)
     .post([authorize([roles.SuperAdmin]), validateBody(schemas.facetSchema)] ,facetsController.newFacet);

router.route('/:facetId')
     .put([authorize([roles.SuperAdmin]), validateParam(schemas.idSchema, 'facetId'), validateBody(schemas.facetSchema)], facetsController.updateFacet)
     .delete([authorize([roles.SuperAdmin]), validateParam(schemas.idSchema, 'facetId')], facetsController.removeFacet);
	 
router.route('/getBuilderFacets')
    .get(authorize([roles.SuperAdmin, roles.BuilderAdmin, roles.MapperAdmin, roles.BuilderUser, roles.MapperUser]), facetsController.getBuilderFacets)
   


module.exports = router;
    

