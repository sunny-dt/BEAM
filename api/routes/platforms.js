const express = require('express');
//const router = express.Router();
const router = require('express-promise-router')();

const platformsController = require('../controllers/platforms');
const {validateParam, validateBody, authorize, schemas} = require('../helpers/routes-helper');
const roles  = require('../helpers/roles');


router.route('/')
    .get(authorize([roles.SuperAdmin, roles.MapperAdmin, roles.MapperUser]), platformsController.index)
    .post([authorize([roles.SuperAdmin, roles.MapperAdmin]), validateBody(schemas.platformSchema)] ,platformsController.newPlatform);

router.route('/:platformId')
//     .get(validateParam(schemas.idSchema, 'platformId'),platformsController.getPlatform)
     .put([authorize([roles.SuperAdmin, roles.MapperAdmin]), validateParam(schemas.idSchema, 'platformId'), validateBody(schemas.platformSchema)], platformsController.updatePlatform)
//     .patch([validateParam(schemas.idSchema, 'platformId'), validateBody(schemas.platformOptionalSchema)], platformsController.updatePlatform)
     .delete([authorize([roles.SuperAdmin, roles.MapperAdmin]), validateParam(schemas.idSchema, 'platformId')],platformsController.removePlatform);

// router.route('/:platformId/products')
//      .get(validateParam(schemas.idSchema, 'platformId'),platformsController.getPlatformProducts)
//      .post([validateParam(schemas.idSchema, 'platformId'), validateBody(schemas.platformProductSchema)], platformsController.platformNewProduct);
     
router.route('/:platformId/chambers')
     .get([authorize([roles.SuperAdmin, roles.MapperAdmin, roles.MapperUser]), validateParam(schemas.idSchema, 'platformId')],platformsController.getPlatformChambers);


//router.route('/:platformId/details')
    //.post([authorize([roles.Admin]), validateBody(schemas.platformDetailsSchema)] ,platformsController.newPlatformDetail);

router.route('/details')
    .get(authorize([roles.SuperAdmin, roles.MapperAdmin, roles.MapperUser]), platformsController.platformsDetailed);

module.exports = router;
    

