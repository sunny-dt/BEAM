const express = require('express');
const router = require('express-promise-router')();

const salesAnalytics = require('../controllers/sales-analytics');
const {validateParam, validateBody, authorize, schemas} = require('../helpers/routes-helper');
const roles  = require('../helpers/roles');

router.route('/')
    .get(authorize([roles.SuperAdmin, roles.AnalyticsAdmin, roles.AnalyticsUser]), salesAnalytics.index);

router.route('/getSaleAnalyticsForAllChambers')
    .get(authorize([roles.SuperAdmin, roles.AnalyticsAdmin, roles.AnalyticsUser]), salesAnalytics.getSaleAnalyticsForAllChambers)
    .post([authorize([roles.SuperAdmin, roles.AnalyticsAdmin, roles.AnalyticsUser]), validateBody(schemas.validateInputSchemaOfOthersCount)], salesAnalytics.getSalesAnalyticsChamberFlowChamber);

router.route('/getAllCustomersByChamber')
    .get(authorize([roles.SuperAdmin, roles.AnalyticsAdmin, roles.AnalyticsUser]), salesAnalytics.getSaleAnalyticsForAllCustomersByChamber)
	.post([authorize([roles.SuperAdmin, roles.AnalyticsAdmin, roles.AnalyticsUser]), validateBody(schemas.validateInputSchemaOfCustomerByChambers)], salesAnalytics.getAllSalesAnalyticsCustomersByChamber);
	
router.route('/getAllFabsByChamber')
    .get(authorize([roles.SuperAdmin, roles.AnalyticsAdmin, roles.AnalyticsUser]), salesAnalytics.getSaleAnalyticsForAllFabsByChamber)
	.post([authorize([roles.SuperAdmin, roles.AnalyticsAdmin, roles.AnalyticsUser]), validateBody(schemas.validateInputSchemaFabByChambers)], salesAnalytics.getAllSalesAnalyticsFabByChamber);
	
router.route('/getSaleAnalyticsCustomersName')
    .get(authorize([roles.SuperAdmin, roles.AnalyticsAdmin, roles.AnalyticsUser]), salesAnalytics.getSaleAnalyticsCustomersName)
    .post([authorize([roles.SuperAdmin, roles.AnalyticsAdmin, roles.AnalyticsUser]), validateBody(schemas.validateInputSchemaOfOtherCustCount)], salesAnalytics.getSalesAnalyticsCustomerFlowCustomer);
	
router.route('/getAllFabsByCustomer')
    .get(authorize([roles.SuperAdmin, roles.AnalyticsAdmin, roles.AnalyticsUser]), salesAnalytics.getSaleAnalyticsFabDataForCustomers)
	.post([authorize([roles.SuperAdmin, roles.AnalyticsAdmin, roles.AnalyticsUser]), validateBody(schemas.validateInputSchemaFabByChambers)], salesAnalytics.getAllSalesAnalyticsFabByCustomers);
	
router.route('/getAllChambersByFabForCustomer')
    .get(authorize([roles.SuperAdmin, roles.AnalyticsAdmin, roles.AnalyticsUser]), salesAnalytics.getSaleAnalyticsChambersByFabForCustomer)
	.post([authorize([roles.SuperAdmin, roles.AnalyticsAdmin, roles.AnalyticsUser]), validateBody(schemas.validateInputSchemaChambersByFabForCustomer)], salesAnalytics.getAllSalesAnalyticsChambersByFabForCustomers);
	
router.route('/getUpgradeChamberName')
    .get(authorize([roles.SuperAdmin, roles.AnalyticsAdmin, roles.AnalyticsUser]), salesAnalytics.getSaleAnalyticsUpgradeChamberName);
	
router.route('/getAllSalesAnalyticsExcelData')
     .get(authorize([roles.SuperAdmin, roles.AnalyticsAdmin, roles.AnalyticsUser]), salesAnalytics.getAllSalesAnalyticsInExcel);	
	  
router.route('/getAllSalesAnalyticsChamberFlowExcelOne')
     .post([authorize([roles.SuperAdmin, roles.AnalyticsAdmin, roles.AnalyticsUser]), validateBody(schemas.validateInputSchemaOfChambers)], salesAnalytics.getSalesAnalyticsChamberFlowInExcelOne);

router.route('/getAllSalesAnalyticsChamberFlowExcelTwo')
     .post([authorize([roles.SuperAdmin, roles.AnalyticsAdmin, roles.AnalyticsUser]), validateBody(schemas.validateInputSchemaOfChambers)], salesAnalytics.getSalesAnalyticsChamberFlowInExcelTwo);
	 
router.route('/getAllSalesAnalyticsChamberFlowCustomerExcel')
     .get(authorize([roles.SuperAdmin, roles.AnalyticsAdmin, roles.AnalyticsUser]), salesAnalytics.getAllSalesAnalyticsChamberFlowCustomerExcel);
	 
router.route('/getAllSalesAnalyticsChamberFlowFabAllExcel')
     .get(authorize([roles.SuperAdmin, roles.AnalyticsAdmin, roles.AnalyticsUser]), salesAnalytics.getAllSalesAnalyticsChamberFlowFabAllExcel);
	 
router.route('/getAllSalesAnalyticsChamberFlowFabFilterExcel')
     .post([authorize([roles.SuperAdmin, roles.AnalyticsAdmin, roles.AnalyticsUser]), validateBody(schemas.validateSchemaforFabFilter)],salesAnalytics.getAllSalesAnalyticsChamberFlowFabFilterExcel);
	 
router.route('/getAllSalesAnalyticsCustomerFlowFabAllExcel')
    .get(authorize([roles.SuperAdmin, roles.AnalyticsAdmin, roles.AnalyticsUser]), salesAnalytics.getAllSalesAnalyticsCustomerFlowFabAllExcel);
	
router.route('/getAllSalesAnalyticsCustomerFlowFabFilterExcel')
     .post([authorize([roles.SuperAdmin, roles.AnalyticsAdmin, roles.AnalyticsUser]), validateBody(schemas.validateSchemaforFabFilter)],salesAnalytics.getAllSalesAnalyticsCustomerFlowFabFilterExcel);
	 
router.route('/getAllSalesAnalyticsCustomerFlowChambersAllExcel')
    .get(authorize([roles.SuperAdmin, roles.AnalyticsAdmin, roles.AnalyticsUser]), salesAnalytics.getAllSalesAnalyticsCustomerFlowChambersAllExcel);
	
router.route('/getAllSalesAnalyticsCustomerFlowChambersFilterExcel')
     .post([authorize([roles.SuperAdmin, roles.AnalyticsAdmin, roles.AnalyticsUser]), validateBody(schemas.validateSchemaforCustomerFlowChamberFilter)],salesAnalytics.getAllSalesAnalyticsCustomerFlowChambersFilterExcel);
	 
router.route('/getAllSalesAnalyticsOtherChambersCount')
  .get(authorize([roles.SuperAdmin, roles.AnalyticsAdmin, roles.AnalyticsUser]), salesAnalytics.getAllSalesAnalyticsOtherChambersCount)
  .post([authorize([roles.SuperAdmin, roles.AnalyticsAdmin, roles.AnalyticsUser]), validateBody(schemas.validateSchemaforOtherChambersCount)],salesAnalytics.updateAllSalesAnalyticsOtherChambersCount);

router.route('/getAllSalesAnalyticsOtherCustomersCount')
     .get(authorize([roles.SuperAdmin, roles.AnalyticsAdmin, roles.AnalyticsUser]), salesAnalytics.getAllSalesAnalyticsOtherCustomersCount)
	 .post([authorize([roles.SuperAdmin, roles.AnalyticsAdmin, roles.AnalyticsUser]), validateBody(schemas.validateSchemaforOtherCustomersCount)],salesAnalytics.updateAllSalesAnalyticsOtherCustomersCount);
   

module.exports = router;