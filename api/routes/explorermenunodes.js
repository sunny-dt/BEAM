const express = require('express');
const router = require('express-promise-router')();

const explorermenunodesController = require('../controllers/explorermenunodes');
const {validateParam, validateBody, authorize, schemas} = require('../helpers/routes-helper');
const roles  = require('../helpers/roles');


router.route('/')
    .get(authorize([roles.SuperAdmin, roles.ExplorerAdmin, roles.ExplorerUser]), explorermenunodesController.index);


router.route('/nodes_comparision_result')
    .post([authorize([roles.SuperAdmin, roles.ExplorerAdmin, roles.ExplorerUser]), validateBody(schemas.compareNodesSchema)] ,explorermenunodesController.getNodesComparisionResult);

router.route('/find_other_comparable_nodes')
    .post([authorize([roles.SuperAdmin, roles.ExplorerAdmin, roles.ExplorerUser]), validateBody(schemas.findComparableNodesSchema)] ,explorermenunodesController.getOtherComparableNodes);
	
router.route('/explorerChamberFamilies')
    .get(authorize([roles.SuperAdmin, roles.ExplorerAdmin, roles.ExplorerUser]), explorermenunodesController.getExplorerChamberFamilies);
	

router.route('/search_explorer_chambers')
    .get(authorize([roles.SuperAdmin, roles.ExplorerAdmin, roles.ExplorerUser]), explorermenunodesController.explorerChambersSearch);

router.route('/:explorermenunodeId')
//      .get(validateParam(schemas.idSchema, 'explorermenunodesId'),explorermenunodesController.getExplorerMenuNode)
     .put([authorize([roles.SuperAdmin, roles.ExplorerAdmin]), validateParam(schemas.idSchema, 'explorermenunodeId'), validateBody(schemas.explorermenunodeSchema)], explorermenunodesController.updateExplorerMenuNode)
     .delete([authorize([roles.SuperAdmin, roles.ExplorerAdmin]), validateParam(schemas.idSchema, 'explorermenunodeId')],explorermenunodesController.removeExplorerMenuNode)
     .get([authorize([roles.SuperAdmin, roles.ExplorerAdmin, roles.ExplorerUser]), validateParam(schemas.idSchema, 'explorermenunodeId')], explorermenunodesController.getExplorerToMapperDetails);
     

 router.route('/:explorermenunodeId/children')
 .get([authorize([roles.SuperAdmin, roles.ExplorerAdmin, roles.ExplorerUser]), validateParam(schemas.idSchema, 'explorermenunodeId')], explorermenunodesController.getNodeChildren)
 .post([authorize([roles.SuperAdmin, roles.ExplorerAdmin]), validateParam(schemas.idSchema, 'explorermenunodeId'), validateBody(schemas.explorermenunodeSchema)] ,explorermenunodesController.newExplorerMenuNode);

 router.route('/:explorermenunodeId/metadata')
     .get([authorize([roles.SuperAdmin, roles.ExplorerAdmin, roles.ExplorerUser]), validateParam(schemas.idSchema, 'explorermenunodeId')], explorermenunodesController.getMetadataForMenuNode)
     .post([authorize([roles.SuperAdmin, roles.ExplorerAdmin]), validateParam(schemas.idSchema, 'explorermenunodeId'), validateBody(schemas.explorerNodeMetadataSchema)] ,explorermenunodesController.newMetadataForMenuNode);

 router.route('/:explorermenunodeId/recommended')
    .get([authorize([roles.SuperAdmin, roles.ExplorerAdmin, roles.ExplorerUser]), validateParam(schemas.idSchema, 'explorermenunodeId')], explorermenunodesController.getRecommendedForMenuNode)
    .post([authorize([roles.SuperAdmin, roles.ExplorerAdmin]), validateParam(schemas.idSchema, 'explorermenunodeId'), validateBody(schemas.explorerNodeRecommendedSchema)],explorermenunodesController.newRecommendedForMenuNode);

router.route('/:explorermenunodeId/descendent_data_nodes')
.get([authorize([roles.SuperAdmin, roles.ExplorerAdmin]), validateParam(schemas.idSchema, 'explorermenunodeId')], explorermenunodesController.getDescendentDataNodesForMenuNode);



    
module.exports = router;
    

