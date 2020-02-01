const express = require('express');
const router = require('express-promise-router')();

const searchController = require('../controllers/explorersearch');
const {validateParam, validateBody, authorize, schemas} = require('../helpers/routes-helper');
const roles  = require('../helpers/roles');

router.route('/FindSuggestions')
    .post([authorize([roles.SuperAdmin, roles.ExplorerAdmin, roles.ExplorerUser]), validateBody(schemas.getSuggestionsSchema)], searchController.getKeywordSuggestions);

router.route('/FindSearchResults')
    .post([authorize([roles.SuperAdmin, roles.ExplorerAdmin, roles.ExplorerUser]), validateBody(schemas.getSearchResultsSchema)], searchController.getSearchResults);

module.exports = router;
    

