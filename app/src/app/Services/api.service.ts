import { AddressClaim } from './../userinfo';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { String, StringBuilder } from 'typescript-string-operations';

import { environment } from '../../environments/environment';
import { EnvService } from '../env.service';

@Injectable()
export class ApiService {
   
    // public static BASE_URL: string = "ec2-18-209-103-144.compute-1.amazonaws.com:3000/";
    /* 13-12-2018*/
    // public static BASE_URL: string = "http://ec2-18-209-103-144.compute-1.amazonaws.com:3000/";
    /* 14-12-2018*/
    //public static BASE_URL: string = "http://ec2-34-229-95-172.compute-1.amazonaws.com/amatg3mapper/api/";   

    //'Authorization': 'Basic OWFlMGYzMmY2NjRkNWYxOGFiMjExZmE2NTlkYzIzNjc6ODZlNmVjYzA3NWNiNmZhYjc0NDE4NjhjZDhmZTllMmM='

    private headerVisibility: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    get isHeaderVisibility() {

      return this.headerVisibility.asObservable();
    }

    hideHeader() {
 
          this.headerVisibility.next(false);
      }

    showheader() {
 
          this.headerVisibility.next(true);
      }


    public httpHeaders = new HttpHeaders({

        'Content-Type': 'application/json',
        // 'Authorization': 'bearer' + ' ' + localStorage.getItem('accessToken')
        // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        // 'Authorization': 'Basic ' + btoa(environment.apiBasicAuthUsername+':'+environment.apiBasicAuthPassword)
    });


    //GET METHODS
    private GET_PLATFORMS: string = environment.apiUrl + "Platforms";

    private GET_USER_INFO: string = environment.apiUrl + "me";

    public GET_CHAMBERS_BY_PLATFORM_ID: string = environment.apiUrl + "Platforms/{0}/Chambers";

    private GET_FEATURED_LIST: string = environment.apiUrl + "{0}?ui_type={1}&page={2}&pagesize={3}&sortBy={4}&sortOrder={5}";

    private GET_PLATFORMS_DETAILS: string = environment.apiUrl + "platforms/details";

    private GET_EXPLORER_MENU_NODE: string = environment.apiUrl + "explorermenunode";

    private GET_RECOMMENDED_BY_MENU_NODE_ID: string = environment.apiUrl + "explorermenunode/{0}/{1}";

    private GET_METADATA_BY_MENU_NODE_ID: string = environment.apiUrl + "menunodemetadata/{0}/media?filter={1}&sortby={2}&page={3}&pagesize={4}&sortorder={5}";
    
    private GET_ATTRIBUTE_VALUES_BY_MENU_NODE_ID: string = environment.apiUrl + "menunodemetadata/{0}/attr_values?filter={1}&sortby={2}&page={3}&pagesize={4}&sortorder={5}";

    private GET_FACETSBY_PLATFORM_ID: string = environment.apiUrl + "facets?platformID={0}&filter={1}&sortBy={2}&sortOrder={3}&page={4}&pageSize={5}";

    // private GET_EXPLORER_CHAMBERS: string = environment.apiUrl + "explorermenunode/{0}/explorerchambers";
    // private GET_EXPLORER_CHAMBERS_FAMILIES: string = environment.apiUrl + "explorermenunode/ExplorerChamberFamilies";
    private GET_BUILDER_CHAMBERS_FAMILIES: string = environment.apiUrl + "builders/getBuilderChamberFamilies?platformId={0}&facetName={1}";
    // private GET_BUILDER_CHAMBERS_FAMILIES_FOR_PLATFORM: string = environment.apiUrl + "builders/getBuilderChamberFamiliesForPlatform?platformId={0}";

    private GET_CHAMBERS_NAMES_FOR_FACETS: string = environment.apiUrl + "builders/getChamberNamesForFacet?facet_name={0}";
    
    public SEARCH_EXPLORER_CHAMBERS = environment.apiUrl + "explorermenunode/search_explorer_chambers?filter={0}&page={1}&pagesize={2}&sortBy={3}&sortOrder={4}";

    public SEARCH_BUILDER_CHAMBERS = environment.apiUrl + "builders/search_chambers?filter={0}&page={1}&pagesize={2}&sortBy={3}&sortOrder={4}";

    public SEARCH_MASTER_CHAMBERS = environment.apiUrl + "master/search_masterchambers?filter={0}&page={1}&pagesize={2}&sortBy={3}&sortOrder={4}&platformfamilyid={5}";

    // public GET_CUSTOMERS = environment.apiUrl + "customers?page={0}&pagesize={1}&sortBy={2}&sortOrder={3}&filter={4}";
    public GET_MASTER_CUSTOMERS = environment.apiUrl + "master/getMasterCustomers?page={0}&pagesize={1}&sortBy={2}&sortOrder={3}&filter={4}";

    // public GET_PROJECT_NUMBERS = environment.apiUrl + "customers/ProjectNumbers?customerId={0}&search_term={1}";
    public GET_MASTER_PROJECT_NUMBERS_BY_CUSTOMER_ID = environment.apiUrl + "master/getMasterProjectNumbersByCustomerId?customerId={0}";

    // public GET_CHAMBERS_BY_CHAMBER_FAMILY_ID = environment.apiUrl + "explorermenunode/{0}/children";
    public GET_CHAMBERS_BY_CHAMBER_FAMILY_ID = environment.apiUrl + "builders/{0}/children";

    public GET_POSSIBLE_UPGRADE_CHAMBERS_BY_CHAMBER_FAMILY_ID = environment.apiUrl + "builders/getPossibleUpgradeChambers?chamberFamilyId={0}&chamberId={1}";

    public GET_CONFIGURATION  = environment.apiUrl + "builders/getConfiguration?customerId={0}&page={1}&pagesize={2}&sortBy={3}&sortOrder={4}";

    public GET_CONFIGURATION_DETAILS:string = environment.apiUrl + "builders/getConfigurationDetails?ConfigId={0}";

    public GET_MASTER_SYSTEM_ID_CONFIGURATION:string = environment.apiUrl + "master/getMasterSystemIdConfigurations?projectNo={0}&&CustomerID={1}&FabID={2}&ProjectNoID={3}";

    public COPY_CONFIGURATION:string = environment.apiUrl + "builders/CopyConfiguration?ConfigId={0}";

    public UPDATE_CONFIG_NSO_FLAG:string = environment.apiUrl + "builders/updateConfigNSOFlag?ConfigId={0}";
   
    public GET_ALL_PLATFORMS:string =  environment.apiUrl + "NSOConfigs/getAllPlatforms";

    public GET_SALE_ANALYTICS_FOR_CHAMBERS:string = environment.apiUrl + "SalesAnalytics/getSaleAnalyticsForAllChambers";

    public GET_ALL_CUSTOMERS_BY_CHAMBER:string = environment.apiUrl + "SalesAnalytics/getAllCustomersByChamber?ChamberName={0}";

    public GET_ALL_FABS_BY_CHAMBER:string = environment.apiUrl + "SalesAnalytics/getAllFabsByChamber?ChamberName={0}&CustomerName={1}";

    public GET_SALE_ANALYTICS_CUSTOMERS_NAME:string = environment.apiUrl + "SalesAnalytics/getSaleAnalyticsCustomersName";

    public GET_ALL_FABS_BY_CUSTOMER:string = environment.apiUrl + "SalesAnalytics/getAllFabsByCustomer?CustomerName={0}";

    public GET_ALL_CHAMBERS_BY_FAB_FOR_CUSTOMER:string = environment.apiUrl + "SalesAnalytics/getAllChambersByFabForCustomer?CustomerName={0}&FabName={1}";

    public GET_ANALYTICS_UPGRADE_CHAMBE_NAME: string = environment.apiUrl + "SalesAnalytics/getUpgradeChamberName?ChamberName={0}";
   
    public GET_ALL_SALES_ANALYTICS_EXCEL_DATA: string = environment.apiUrl + "SalesAnalytics/getAllSalesAnalyticsExcelData";

    public GET_ALL_SALES_ANALYTICS_CHAMBER_FLOW_CUSTOMER_EXCEL: string = environment.apiUrl + "SalesAnalytics/getAllSalesAnalyticsChamberFlowCustomerExcel?ChamberName={0}";
    
    public GET_ALL_SALES_ANALYTICS_CHAMBER_FLOW_FAB_ALL_EXCEL: string = environment.apiUrl + "SalesAnalytics/getAllSalesAnalyticsChamberFlowFabAllExcel?ChamberName={0}&CustomerName={1}";
    
    public GET_ALL_SALES_ANALYTICS_CUSTOMER_FLOW_FAB_ALL_EXCEL: string = environment.apiUrl + "SalesAnalytics/getAllSalesAnalyticsCustomerFlowFabAllExcel?CustomerName={0}";

    public GET_ALL_SALES_ANALYTICS_CUSTOMER_FLOW_CHAMBERS_ALL_EXCEL: string = environment.apiUrl + "SalesAnalytics/getAllSalesAnalyticsCustomerFlowChambersAllExcel?CustomerName={0}&FabName={1}";

    public GET_SYSTEM_IDS_WITH_EMPTY_FACETS: string = environment.apiUrl + "builders/getSystemIdsWithEmptyFacets?customerId={0}";

    public GET_MASTER_SYSTEM_IDS_WITH_EMPTY_FACETS: string = environment.apiUrl + "master/getMasterEmptySystemIdConfigurations?customerId={0}";

    public GET_SYSTEM_IDS_WITH_ALL_FACETS: string = environment.apiUrl + "builders/getSystemIdsWithAllFacets?customerId={0}";

    public GET_MASTER_SYSTEM_IDS_WITH_ALL_FACETS: string = environment.apiUrl + "master/getMasterAllSystemIdConfigurations?customerId={0}";

    public GET_BUILDER_PLATFORMS: string = environment.apiUrl + "builders/getBuilderPlatforms";

    private GET_BUILDER_FACETSBY_PLATFORM_ID: string = environment.apiUrl + "facets/getBuilderFacets?platformID={0}&filter={1}&sortBy={2}&sortOrder={3}&page={4}&pageSize={5}";

    
    //POST METHODS
    public FIND_PRODUCTS_FOR_CHAMBERS: string = environment.apiUrl + "Chambers/FindProductsForChambers";

    public FIND_COMPATABILITY_INFO_FOR_CHAMBERS: string = environment.apiUrl + "Chambers/FindCompatibilityInfoForChambers";

    public ADD_OPPORTUNITIES: string = environment.apiUrl + "Opportunities";

    public FIND_SUGGESTIONS: string = environment.apiUrl + "explorersearch/FindSuggestions";

    public FIND_SEARCH_RESULTS: string = environment.apiUrl + "explorersearch/FindSearchResults?sortby={0}&page={1}&pagesize={2}&sortorder={3}";

    public NODES_COMPARISION_RESULT: string = environment.apiUrl + "explorermenunode/nodes_comparision_result";

    public FIND_OTHER_COMPARABLE_NODES: string = environment.apiUrl + "explorermenunode/find_other_comparable_nodes";

    public FIND_OTHER_COMPARABLE_NODES_FOR_FORMAT: string = environment.apiUrl + "explorermenunode/nodes_comparision_result?format={0}";

    public ADD_CONFIGURATION:string = environment.apiUrl + "builders/AddConfiguration";

    public UPDATE_CONFIGURATION:string =  environment.apiUrl + "builders/UpdateConfiguration";

    public ADD_NSO_CONFIGURATION:string = environment.apiUrl + "NSOConfigs/AddNSOConfiguration";

    public VALIDATE_CHAMBER_COMPATIBILITY_BY_POSITION: string = environment.apiUrl + "chambers/validateChamberCompatibiltyByPosition";

    public GET_ALL_SALES_ANALYTICS_CHAMBER_FLOW_EXCEL_ONE: string = environment.apiUrl + "SalesAnalytics/getAllSalesAnalyticsChamberFlowExcelOne";

    public GET_ALL_SALES_ANALYTICS_CHAMBER_FLOW_EXCEL_TWO: string = environment.apiUrl + "SalesAnalytics/getAllSalesAnalyticsChamberFlowExcelTwo";

    public GET_ALL_SALES_ANALYTICS_CHAMBER_FLOW_FAB_FILTER_EXCEL: string = environment.apiUrl + "SalesAnalytics/getAllSalesAnalyticsChamberFlowFabFilterExcel?ChamberName={0}&CustomerName={1}";

    public GET_ALL_SALES_ANALYTICS_CUSTOMER_FLOW_FAB_FILTER_EXCEL: string = environment.apiUrl + "SalesAnalytics/getAllSalesAnalyticsCustomerFlowFabFilterExcel?CustomerName={0}";

    public GET_ALL_SALES_ANALYTICS_CUSTOMER_FLOW_CHAMBER_FILTER_EXCEL: string = environment.apiUrl + "SalesAnalytics/getAllSalesAnalyticsCustomerFlowChambersFilterExcel?CustomerName={0}&FabName={1}";

    public GET_USER_ROLES: string = environment.apiUrl + "users/getUserRoles";

    public SEND_MAIL: string = environment.apiUrl + "helperapi/SendMail";

    
    // DELETE METHODS
    public DELETE_CONFIGURATION:string =  environment.apiUrl + "builders/DeleteConfiguration?ConfigId={0}";

    constructor(private httpClient: HttpClient, private env : EnvService) { 


        // this.GET_PLATFORMS = this.env.apiUrl + "Platforms";
        // this.GET_CHAMBERS_BY_PLATFORM_ID = this.env.apiUrl + "Platforms/{0}/Chambers";
        // this.FIND_PRODUCTS_FOR_CHAMBERS = this.env.apiUrl + "Chambers/FindProductsForChambers";
        // this.FIND_COMPATABILITY_INFO_FOR_CHAMBERS = this.env.apiUrl + "Chambers/FindCompatibilityInfoForChambers";
        // this.ADD_OPPORTUNITIES = this.env.apiUrl + "Opportunities";

        // this.GET_USER_INFO = this.env.apiUrl +  + "me";
    }

    getPlatforms() {

        console.log("ApiService getPlatforms");
        return this.httpClient.get(this.GET_PLATFORMS, { headers: this.httpHeaders });
    }

    getUserInfo(){

        return this.httpClient.get(this.GET_USER_INFO, { headers: this.httpHeaders });
    }

    getChambersByPlatformID(platformID: string) {

        console.log("ApiService getChambersByPlatformID platformID: " + platformID);

        var getChambersByPlatformIDURL = String.Format(this.GET_CHAMBERS_BY_PLATFORM_ID, platformID);
        console.log("ApiService getChambersByPlatformID getChambersByPlatformIDURL: " + getChambersByPlatformIDURL);

        return this.httpClient.get(getChambersByPlatformIDURL, { headers: this.httpHeaders });
    }

    findCompatibilityInfoForChamberIds(chamberIDs: any[], platFormID) {

        console.log("ApiService findCompatibilityInfoForChamberIds messages: ", chamberIDs);

        const bodyParams = {

            "platformId": platFormID,
            "chamberIds": chamberIDs
            // "includeRndTypeMatches": isRnDSelected
        }

        console.log("ApiService findCompatibilityInfoForChamberIds bodyParams: ", JSON.stringify(bodyParams));

        return this.httpClient.post(this.FIND_COMPATABILITY_INFO_FOR_CHAMBERS, JSON.stringify(bodyParams), { headers: this.httpHeaders });
    }

    findProductsForChambers(platFormID, chamberIDs: any[]) {

        console.log("ApiService getChambersByPlatformID");
        console.log("ApiService getChambersByPlatformID messages: ", chamberIDs);

        const bodyParams = {

            'platformId' : platFormID, 
            'chamberIds': chamberIDs,
        }

        console.log("ApiService getChambersByPlatformID bodyParams: ", JSON.stringify(bodyParams));

        return this.httpClient.post(this.FIND_PRODUCTS_FOR_CHAMBERS, JSON.stringify(bodyParams), { headers: this.httpHeaders });
    }

    addOpportunities(opID: string, opportunityProduct: any) {

        console.log("ApiService addOpportunities");
        
        console.log("ApiService addOpportunities opID: " + opID);
        console.log("ApiService addOpportunities opportunityProduct: " + JSON.stringify(opportunityProduct));

        const bodyParams = {

            'op_id' : opID, 
            'product_name': opportunityProduct.product_name,
            'product_code' : opportunityProduct.product_code, 
            'nearest_product_config_name': opportunityProduct.nearest_product_config_name,
            'platform_name' : opportunityProduct.platform_name, 
            'configuration': opportunityProduct.configuration,
        };

        console.log("ApiService addOpportunities bodyParams: " + JSON.stringify(bodyParams));

        return this.httpClient.post(this.ADD_OPPORTUNITIES, bodyParams, { headers: this.httpHeaders });
    }

    getFeaturedList(endPoint: string, UIType: string, page: any, pageSize: any, sortBy: any, sortOrder: any) {

        var getFeaturedListURL = String.Format(this.GET_FEATURED_LIST, endPoint, UIType, page, pageSize, sortBy, sortOrder);
        console.log("ApiService getChambersByPlatformID getFeaturedListURL: " + getFeaturedListURL);

        return this.httpClient.get(getFeaturedListURL, { headers: this.httpHeaders });
    }

    getPlatformsDetails() {

        console.log("ApiService getPlatformsDetails");
        return this.httpClient.get(this.GET_PLATFORMS_DETAILS, { headers: this.httpHeaders });
    }

    getExplorerMenuNodes() {

        console.log("ApiService getExplorerMenuNodes");
        return this.httpClient.get(this.GET_EXPLORER_MENU_NODE, { headers: this.httpHeaders });
    }

    getRecommendedByMenuNodeID(menuNodeID: string, endPoint: string) {

        var getRecommendedByMenuNodeIDURL = String.Format(this.GET_RECOMMENDED_BY_MENU_NODE_ID, menuNodeID, endPoint);
        console.log("ApiService getRecommendedByMenuNodeID getRecommendedByMenuNodeIDURL: " + getRecommendedByMenuNodeIDURL);

        return this.httpClient.get(getRecommendedByMenuNodeIDURL, { headers: this.httpHeaders });
    }

    getMetaDataMediaByMenuNodeID(menuNodeID: string, filter: string, sortBy: string, page: string, pageSize: string, sortOrder: string) {

        var getMetaDataByMenuNodeIDURL = String.Format(this.GET_METADATA_BY_MENU_NODE_ID, menuNodeID, filter, sortBy, page, pageSize, sortOrder);
        console.log("ApiService getMetaDataMediaByMenuNodeID getMetaDataByMenuNodeIDURL: " + getMetaDataByMenuNodeIDURL);

        return this.httpClient.get(getMetaDataByMenuNodeIDURL, { headers: this.httpHeaders });
    }

    getAttributeValuesByMenuNodeID(menuNodeID: string, filter: string, sortBy: string, page: string, pageSize: string, sortOrder: string) {

        var getAttributeValuesByMenuNodeIDURL = String.Format(this.GET_ATTRIBUTE_VALUES_BY_MENU_NODE_ID, menuNodeID, filter, sortBy, page, pageSize, sortOrder);
        console.log("ApiService getMetaDataMediaByMenuNodeID getAttributeValuesByMenuNodeIDURL: " + getAttributeValuesByMenuNodeIDURL);

        return this.httpClient.get(getAttributeValuesByMenuNodeIDURL, { headers: this.httpHeaders });
    }

    findSuggestions(partialSearchTerm, otherSearchTerms: any[], filters: any[], includeLinks) {

        console.log("ApiService findSuggestions");
        console.log("ApiService findSuggestions partialSearchTerm: ", partialSearchTerm);
        console.log("ApiService findSuggestions otherSearchTerms: ", otherSearchTerms);
        console.log("ApiService findSuggestions filters: ", filters);
        console.log("ApiService findSuggestions includeLinks: ", includeLinks);

        const bodyParams = {

            'partial_search_term' : partialSearchTerm, 
            'other_search_terms': otherSearchTerms,
            'filters': filters,
            'include_links': includeLinks,
        }

        console.log("ApiService findSuggestions bodyParams: ", JSON.stringify(bodyParams));

        return this.httpClient.post(this.FIND_SUGGESTIONS, JSON.stringify(bodyParams), { headers: this.httpHeaders });
    }

    findSearchResults(searchTerms: any[], filters: any[], sortBy, page, pageSize, sortOrder) {

        console.log("ApiService findSearchResults");
        console.log("ApiService findSearchResults searchTerms: ", searchTerms);
        console.log("ApiService findSearchResults filters: ", filters);

        const bodyParams = {

            'search_terms': searchTerms,
            'filters': filters,
        }

        console.log("ApiService findSuggestions bodyParams: ", JSON.stringify(bodyParams));

        var findSearchResultsURL = String.Format(this.FIND_SEARCH_RESULTS, sortBy, page, pageSize, sortOrder);
        console.log("ApiService findSearchResults findSearchResultsURL: " + findSearchResultsURL);

        return this.httpClient.post(findSearchResultsURL, JSON.stringify(bodyParams), { headers: this.httpHeaders });
    }

    nodesComparisionResult(nodeIDs: any[]) {

        console.log("ApiService nodesComparisionResult");
        console.log("ApiService nodesComparisionResult nodeIDs: ", nodeIDs);

        const bodyParams = {

            'nodeIds': nodeIDs
        }

        console.log("ApiService nodesComparisionResult bodyParams: ", JSON.stringify(bodyParams));

        return this.httpClient.post(this.NODES_COMPARISION_RESULT, JSON.stringify(bodyParams), { headers: this.httpHeaders });
    }
    
    findOtherComparableNodes(nodeIDs: any[]) {

        console.log("ApiService findOtherComparableNodes");
        console.log("ApiService findOtherComparableNodes nodeIDs: ", nodeIDs);

        const bodyParams = {

            'nodeIds': nodeIDs
        }

        console.log("ApiService findOtherComparableNodes bodyParams: ", JSON.stringify(bodyParams));

        return this.httpClient.post(this.FIND_OTHER_COMPARABLE_NODES, JSON.stringify(bodyParams), { headers: this.httpHeaders });
    }

    findOtherComparableNodesForFormate(nodeIDs: any[], formate) {

        console.log("ApiService findOtherComparableNodesForFormate");
        console.log("ApiService findOtherComparableNodesForFormate nodeIDs: ", nodeIDs);
        console.log("ApiService findOtherComparableNodesForFormate formate: ", formate);

        const bodyParams = {

            'nodeIds': nodeIDs
        }

        console.log("ApiService findOtherComparableNodesForFormate bodyParams: ", JSON.stringify(bodyParams));

        var findOtherComparableNodesForFormateURL = String.Format(this.FIND_OTHER_COMPARABLE_NODES_FOR_FORMAT, formate);
        console.log("ApiService findSearchResults findOtherComparableNodesForFormateURL: " + findOtherComparableNodesForFormateURL);

        return this.httpClient.post(findOtherComparableNodesForFormateURL, JSON.stringify(bodyParams), { headers: this.httpHeaders });
    }

    getFacets(platformID) {

        var getFacetsByPlatformId = String.Format(this.GET_FACETSBY_PLATFORM_ID, platformID,"", "id","asc","1","100");
        console.log("ApiService getFacets getFacetsByPlatformId: " + getFacetsByPlatformId);

        return this.httpClient.get(getFacetsByPlatformId, { headers: this.httpHeaders });
    }

    getExplorerChamberFamilies(platformID, facetName) {

        var getBuilderChamberFamiliesURL = String.Format(this.GET_BUILDER_CHAMBERS_FAMILIES, platformID, facetName);
        // var getBuilderChamberFamiliesURL = String.Format(this.GET_BUILDER_CHAMBERS_FAMILIES_FOR_PLATFORM, platformID);

        console.log("ApiService getExplorerChamberFamilies getBuilderChamberFamiliesURL: " + getBuilderChamberFamiliesURL);
        return this.httpClient.get(getBuilderChamberFamiliesURL, { headers: this.httpHeaders });
    }

    getChamberNamesForFacet(facetName) {

        var getChamberNamesForFacetURL = String.Format(this.GET_CHAMBERS_NAMES_FOR_FACETS, facetName);
        console.log("ApiService getChamberNamesForFacet getChamberNamesForFacetURL: " + getChamberNamesForFacetURL);

        return this.httpClient.get(getChamberNamesForFacetURL, { headers: this.httpHeaders });
    }

    getSearchExplorerChambers(filter, page, pageSize, sortBy ,sortOrder) {

        var findConfigSearchResultsURL = String.Format(this.SEARCH_EXPLORER_CHAMBERS, filter, page, pageSize, sortBy ,sortOrder);
        console.log("ApiService getSearchExplorerChambers findConfigSearchResultsURL: " + findConfigSearchResultsURL);

        return this.httpClient.get(findConfigSearchResultsURL, { headers: this.httpHeaders });
    }

    getSearchBuilderChambers(filter, page, pageSize, sortBy ,sortOrder, platFormID) {

        var findConfigSearchResultsURL = String.Format(this.SEARCH_MASTER_CHAMBERS, filter, page, pageSize, sortBy ,sortOrder, platFormID);
        console.log("ApiService getSearchBuilderChambers findConfigSearchResultsURL: " + findConfigSearchResultsURL);

        return this.httpClient.get(findConfigSearchResultsURL, { headers: this.httpHeaders });
    }

    getMasterCustomers(page, pageSize, sortBy, sortOrder, filter) {

        var getMasterCustomersURL = String.Format(this.GET_MASTER_CUSTOMERS, page, pageSize, sortBy, sortOrder, filter);
        console.log("ApiService getMasterCustomers getMasterCustomersURL: " + getMasterCustomersURL);

        return this.httpClient.get(getMasterCustomersURL, { headers: this.httpHeaders });
    }

    getMasterProjectNumbersByCustomerID(customerID) {

        var getProjectNumbersURL = String.Format(this.GET_MASTER_PROJECT_NUMBERS_BY_CUSTOMER_ID, customerID);
        console.log("ApiService getProjectNumbers getProjectNumbersURL: " + getProjectNumbersURL);

        return this.httpClient.get(getProjectNumbersURL, { headers: this.httpHeaders });
    }

    getChambersByFamilyID(chamberFamilyID) {

        var getChambersByFamilyIDURL = String.Format(this.GET_CHAMBERS_BY_CHAMBER_FAMILY_ID, chamberFamilyID);
        console.log("ApiService getChambersByFamilyIDURL : " + getChambersByFamilyIDURL);
        return this.httpClient.get(getChambersByFamilyIDURL, { headers: this.httpHeaders });
    }

    getPossibleUpgradeChambers(chamberFamilyID, chamberId) {

        var getPossibleUpgradeChambersURL = String.Format(this.GET_POSSIBLE_UPGRADE_CHAMBERS_BY_CHAMBER_FAMILY_ID, chamberFamilyID, chamberId);
        console.log("ApiService getPossibleUpgradeChambers : " + getPossibleUpgradeChambersURL);
        return this.httpClient.get(getPossibleUpgradeChambersURL, { headers: this.httpHeaders });
    }

    addConfiguration(configName,customerId,platformID,configuration: any[]) {

        console.log("ApiService addConfiguration configuration: ", configuration);

        const bodyParams = {

                'config_name' : configName,
                'created_by_id' : "",
                'created_by_name' : "",
                'modified_by_id' : "",
                'modified_by_name' : "",
                'c_date' : "",
                'm_date' : "",
                'platform_family_id' : platformID,
                'customer_id' : customerId,
                'customer_project_no' : "",
                'configuration' : configuration
        }

        console.log("ApiService addConfiguration bodyParams: ", JSON.stringify(bodyParams));

        return this.httpClient.post(this.ADD_CONFIGURATION, JSON.stringify(bodyParams), { headers: this.httpHeaders });
    }
    
    getConfiguration(customerID, page, pageSize, sortBy, sortOrder) {

        var getConfigurationURL = String.Format(this.GET_CONFIGURATION, customerID, page, pageSize, sortBy, sortOrder);
        console.log("ApiService getConfiguration getConfigurationURL: " + getConfigurationURL);

        return this.httpClient.get(getConfigurationURL, { headers: this.httpHeaders });
    }

    updateConfiguration(configName, configID, customerid, configuration: any[]) {

        console.log("ApiService updateConfiguration: ", configuration);

        const bodyParams = {

                "config_id" : configID,
	            "config_name" : configName,
                "modified_by_id" : "",
                "modified_by_name" : "",
                "m_date" : "",
                "customer_id" : customerid,
                'configuration' : configuration
        }

        console.log("ApiService updateConfiguration bodyParams: ", JSON.stringify(bodyParams));

        return this.httpClient.post(this.UPDATE_CONFIGURATION, JSON.stringify(bodyParams), { headers: this.httpHeaders });
    }

    deleteConfiguration(ConfigId) {

        var deleteConfigurationURL = String.Format(this.DELETE_CONFIGURATION, ConfigId);
        console.log("ApiService deleteConfiguration deleteConfigurationURL: " + deleteConfigurationURL);

        return this.httpClient.delete(deleteConfigurationURL, { headers: this.httpHeaders });
    }

    getConfigurationDetails(ConfigId) {

        var getConfigurationDetailsURL = String.Format(this.GET_CONFIGURATION_DETAILS, ConfigId);
        console.log("ApiService getConfigurationDetailsURL: " + getConfigurationDetailsURL);

        return this.httpClient.get(getConfigurationDetailsURL, { headers: this.httpHeaders });
    }

    getMasterSystemIdConfigurations(ProjectNumber, customerID, fabID, selectedProjectNoID) {

        var getMasterSystemIdConfigurationsURL = String.Format(this.GET_MASTER_SYSTEM_ID_CONFIGURATION, ProjectNumber, customerID, fabID, selectedProjectNoID);
        console.log("ApiService getConfigurationDetailsURL: " + getMasterSystemIdConfigurationsURL);

        return this.httpClient.get(getMasterSystemIdConfigurationsURL, { headers: this.httpHeaders });
    }

    copyConfiguration(ConfigId) {

        var copyConfigurationURL = String.Format(this.COPY_CONFIGURATION, ConfigId);
        console.log("ApiService getConfigurationDetailsURL: " + copyConfigurationURL);

        return this.httpClient.get(copyConfigurationURL, { headers: this.httpHeaders });
    }

    updateConfigNSOFlag(ConfigId) {

        var updateConfigNSOFlagURL = String.Format(this.UPDATE_CONFIG_NSO_FLAG, ConfigId);
        console.log("ApiService updateConfigNSOFlagURL: " + updateConfigNSOFlagURL);

        return this.httpClient.get(updateConfigNSOFlagURL, { headers: this.httpHeaders });
    }

    addNSOConfiguration(configName, customerID, platformID, configuration) {

        console.log("ApiService addNSOConfiguration configName: ", configName);
        console.log("ApiService addNSOConfiguration customerID: ", customerID);
        console.log("ApiService addNSOConfiguration platformID: ", platformID);
        console.log("ApiService addNSOConfiguration configuration: ", configuration);

        const bodyParams = {

                'config_name' : configName,
                'created_by_id' : "",
                'created_by_name' : "",
                'modified_by_id' : "",
                'modified_by_name' : "",
                'g3_platform_id' : platformID,
                'customer_id' : customerID,
                'customer_project_no' : "",
                'configuration' : configuration
        }

        console.log("ApiService addNSOConfiguration bodyParams: ", JSON.stringify(bodyParams));

        return this.httpClient.post(this.ADD_NSO_CONFIGURATION, JSON.stringify(bodyParams), { headers: this.httpHeaders });
    }

    getAllPlatforms() {

        console.log("ApiService getAllPlatforms");
        return this.httpClient.get(this.GET_ALL_PLATFORMS, { headers: this.httpHeaders });
    }


    validateChamberCompatibiltyByPosition(selectedChamberID, selectedFacetName, platFormID, configuration) {

        console.log("ApiService validateChamberCompatibiltyByPosition");
        console.log("ApiService validateChamberCompatibiltyByPosition-configuration messages: ");

        console.log("ApiService validateChamberCompatibiltyByPosition selectedChamberID: ", selectedChamberID);
        console.log("ApiService validateChamberCompatibiltyByPosition selectedFacetName: ", selectedFacetName);
        console.log("ApiService validateChamberCompatibiltyByPosition platFormID: ", platFormID);
        console.log("ApiService validateChamberCompatibiltyByPosition configuration: ", configuration);

        const bodyParams = {

            "selected_chamberId": selectedChamberID,
            "selected_facet_name": selectedFacetName,
            "platformId": platFormID,
            "configuration": configuration
            // [
			// 	{                
            //     "chamberIds" : 20,
			// 	"facet_name" : "D"
			//     },
			//     {
			// 	"chamberIds" : 20,
			// 	"facet_name" : "1"
			//     },
			//     {
			// 	"chamberIds" : 16,
			// 	"facet_name" : "2"
			//     },
			//     {
			// 	"chamberIds" : 18,
			// 	"facet_name" : "3"
			//     },
			//     {
			// 	"chamberIds" : 16,
			// 	"facet_name" : "C"
			//     }
			//    ]
        }

        console.log("ApiService validateChamberCompatibiltyByPosition bodyParams: ", JSON.stringify(bodyParams));

        return this.httpClient.post(this.VALIDATE_CHAMBER_COMPATIBILITY_BY_POSITION, JSON.stringify(bodyParams), { headers: this.httpHeaders });
    }

    getSaleAnalyticsForAllChambers() {

        console.log("ApiService getSaleAnalyticsForAllChambers");
        return this.httpClient.get(this.GET_SALE_ANALYTICS_FOR_CHAMBERS, { headers: this.httpHeaders });
    }

    getSaleAnalyticsForAllChambersFilter(filterChambers: any[], filterCustomers: any[], sliderValue) {

        console.log("ApiService getSaleAnalyticsForAllChambers filterChambers: ", filterChambers);
        console.log("ApiService getSaleAnalyticsForAllChambers filterCustomers: ", filterCustomers);

        const bodyParams = {

            'chamberName': filterChambers,
            'customerName': filterCustomers,
            'value': sliderValue
        }

        console.log("ApiService getSaleAnalyticsForAllChambers bodyParams: ", JSON.stringify(bodyParams));
        return this.httpClient.post(this.GET_SALE_ANALYTICS_FOR_CHAMBERS, JSON.stringify(bodyParams), { headers: this.httpHeaders });
    }

    getAllCustomersByChamber(chamberName) {

        var getAllCustomersByChamberURL = String.Format(this.GET_ALL_CUSTOMERS_BY_CHAMBER, chamberName);
        console.log("ApiService getAllCustomersByChamberURL",getAllCustomersByChamberURL);
        return this.httpClient.get(getAllCustomersByChamberURL, { headers: this.httpHeaders });
    }

    getAllCustomersByChamberFilter(chamberName, filterCustomers, sliderValue) {

        console.log("ApiService getAllCustomersByChamberFilter filterCustomers: ", filterCustomers);

        const bodyParams = {

            'customerName': filterCustomers,
            'value': sliderValue
        }

        var getAllCustomersByChamberURL = String.Format(this.GET_ALL_CUSTOMERS_BY_CHAMBER, chamberName);
        console.log("ApiService getAllCustomersByChamberFilter getAllCustomersByChamberURL",getAllCustomersByChamberURL);

        console.log("ApiService getAllCustomersByChamberFilter getSaleAnalyticsCustomersNameFilter bodyParams: ", JSON.stringify(bodyParams));
        return this.httpClient.post(getAllCustomersByChamberURL, JSON.stringify(bodyParams), { headers: this.httpHeaders });
    }

    getAllFabsByCustomerFilter(customerName, filterFabs) {

        console.log("ApiService getAllFabsByCustomerFilter filterFabs: ", filterFabs);

        const bodyParams = {

            'fabName': filterFabs
        }

        var getAllFabsByCustomerurl = String.Format(this.GET_ALL_FABS_BY_CUSTOMER, customerName);
        console.log("ApiService getAllFabsByCustomerurl: ", getAllFabsByCustomerurl);

        console.log("ApiService getAllFabsByCustomerFilter getSaleAnalyticsCustomersNameFilter bodyParams: ", JSON.stringify(bodyParams));
        return this.httpClient.post(getAllFabsByCustomerurl, JSON.stringify(bodyParams), { headers: this.httpHeaders });
    }

    getAllFabsByChamber(chamberName,customerName) {

        var getAllFabsByChamberURL = String.Format(this.GET_ALL_FABS_BY_CHAMBER, chamberName, customerName);
        console.log("ApiService getAllFabsByChamberURL",getAllFabsByChamberURL);
        return this.httpClient.get(getAllFabsByChamberURL, { headers: this.httpHeaders });
    }

    getAllFabsByChamberFilter(chamberName,customerName, filterFabs) {

        // var getAllFabsByChamberURL = String.Format(this.GET_ALL_FABS_BY_CHAMBER, chamberName,customerName);
        // console.log("ApiService getAllFabsByChamberURL",getAllFabsByChamberURL);
        // return this.httpClient.get(getAllFabsByChamberURL, { headers: this.httpHeaders });

        console.log("ApiService getAllFabsByChamberFilter filterFabs: ", filterFabs);

        const bodyParams = {

            'fabName': filterFabs
        }

        var getAllFabsByChamberURL = String.Format(this.GET_ALL_FABS_BY_CHAMBER, chamberName,customerName);
        console.log("ApiService getAllFabsByChamberURL",getAllFabsByChamberURL);

        console.log("ApiService getAllCustomersByChamberFilter getSaleAnalyticsCustomersNameFilter bodyParams: ", JSON.stringify(bodyParams));
        return this.httpClient.post(getAllFabsByChamberURL, JSON.stringify(bodyParams), { headers: this.httpHeaders });
    }

    getSaleAnalyticsCustomersName() {

        console.log("ApiService getSaleAnalyticsCustomersName");
        return this.httpClient.get(this.GET_SALE_ANALYTICS_CUSTOMERS_NAME, { headers: this.httpHeaders });
    }

    getSaleAnalyticsCustomersNameFilter(filterChambers: any[], filterCustomers: any[], sliderValue) {

        console.log("ApiService getSaleAnalyticsCustomersNameFilter filterChambers: ", filterChambers);
        console.log("ApiService getSaleAnalyticsCustomersNameFilter filterCustomers: ", filterCustomers);

        const bodyParams = {

            'chamberName': filterChambers,
            'customerName': filterCustomers,
            'value': sliderValue
        }

        console.log("ApiService getSaleAnalyticsCustomersNameFilter bodyParams: ", JSON.stringify(bodyParams));
        return this.httpClient.post(this.GET_SALE_ANALYTICS_CUSTOMERS_NAME, JSON.stringify(bodyParams), { headers: this.httpHeaders });
    }

    getAllFabsByCustomer(customerName) {

        var getAllFabsByCustomerurl = String.Format(this.GET_ALL_FABS_BY_CUSTOMER, customerName);
        console.log("ApiService getAllFabsByCustomerurl: ", getAllFabsByCustomerurl);

        return this.httpClient.get(getAllFabsByCustomerurl, { headers: this.httpHeaders });
    }

    getAllChambersByFabForCustomer(customerName, fabName) {

        var getAllChambersByFabForCustomerURL = String.Format(this.GET_ALL_CHAMBERS_BY_FAB_FOR_CUSTOMER, customerName, fabName);
        console.log("ApiService getAllChambersByFabForCustomerURL: ", getAllChambersByFabForCustomerURL);

        return this.httpClient.get(getAllChambersByFabForCustomerURL, { headers: this.httpHeaders });
    }

    getAllChambersByFabForCustomerFilter(customerName, fabName, filterFabs, sliderValue) {

        // var getAllChambersByFabForCustomerURL = String.Format(this.GET_ALL_CHAMBERS_BY_FAB_FOR_CUSTOMER, customerName, fabName);
        // console.log("ApiService getAllChambersByFabForCustomerURL: ", getAllChambersByFabForCustomerURL);

        // return this.httpClient.get(getAllChambersByFabForCustomerURL, { headers: this.httpHeaders });

        console.log("ApiService getAllFabsByChamberFilter filterFabs: ", filterFabs);

        const bodyParams = {

            'chamberName': filterFabs,
            'value': sliderValue
        }

        var getAllChambersByFabForCustomerURL = String.Format(this.GET_ALL_CHAMBERS_BY_FAB_FOR_CUSTOMER, customerName, fabName);
        console.log("ApiService getAllChambersByFabForCustomerURL: ", getAllChambersByFabForCustomerURL);

        console.log("ApiService getAllCustomersByChamberFilter getSaleAnalyticsCustomersNameFilter bodyParams: ", JSON.stringify(bodyParams));
        return this.httpClient.post(getAllChambersByFabForCustomerURL, JSON.stringify(bodyParams), { headers: this.httpHeaders });
    }

    getAnalyticsUpgradeChamberName(customerName) {

        var getAnalyticsUpgradeChamberNameURL = String.Format(this.GET_ANALYTICS_UPGRADE_CHAMBE_NAME, customerName);
        console.log("ApiService getAnalyticsUpgradeChamberName getAnalyticsUpgradeChamberNameURL: ", getAnalyticsUpgradeChamberNameURL);

        return this.httpClient.get(getAnalyticsUpgradeChamberNameURL, { headers: this.httpHeaders });
    }

    getAllSalesAnalyticsExcelData() {

        return this.httpClient.get(this.GET_ALL_SALES_ANALYTICS_EXCEL_DATA, { headers: this.httpHeaders });
    }

    getAllSalesAnalyticsChamberFlowExcelOne(chamberName, customerName) {

        console.log("ApiService getAllSalesAnalyticsChamberFlowExcelOne chamberName: ", chamberName);
        console.log("ApiService getAllSalesAnalyticsChamberFlowExcelOne customerName: ", customerName);

        const bodyParams = {

            'chamberName': chamberName,
            'customerName': customerName,
        }

        console.log("ApiService getAllSalesAnalyticsChamberFlowExcelOne bodyParams: ", JSON.stringify(bodyParams));
        return this.httpClient.post(this.GET_ALL_SALES_ANALYTICS_CHAMBER_FLOW_EXCEL_ONE, JSON.stringify(bodyParams), { headers: this.httpHeaders });
    }

    getAllSalesAnalyticsChamberFlowExcelTwo(chamberName, customerName) {

        console.log("ApiService getAllSalesAnalyticsChamberFlowExcelTwo chamberName: ", chamberName);
        console.log("ApiService getAllSalesAnalyticsChamberFlowExcelTwo customerName: ", customerName);

        const bodyParams = {

            'chamberName': chamberName,
            'customerName': customerName,
        }

        console.log("ApiService getAllSalesAnalyticsChamberFlowExcelTwo bodyParams: ", JSON.stringify(bodyParams));
        return this.httpClient.post(this.GET_ALL_SALES_ANALYTICS_CHAMBER_FLOW_EXCEL_TWO, JSON.stringify(bodyParams), { headers: this.httpHeaders });
    }

    getAllSalesAnalyticsChamberFlowCustomerExcel(chamberName) {

        var getAllSalesAnalyticsChamberFlowCustomerExcelURL = String.Format(this.GET_ALL_SALES_ANALYTICS_CHAMBER_FLOW_CUSTOMER_EXCEL, chamberName);
        console.log("ApiService getAllSalesAnalyticsChamberFlowCustomerExcel getAllSalesAnalyticsChamberFlowCustomerExcelURL: ", getAllSalesAnalyticsChamberFlowCustomerExcelURL);

        return this.httpClient.get(getAllSalesAnalyticsChamberFlowCustomerExcelURL, { headers: this.httpHeaders });
    }

    getAllSalesAnalyticsChamberFlowFabAllExcel(chamberName, customerName) {

        var getAllSalesAnalyticsChamberFlowFabAllExcelURL = String.Format(this.GET_ALL_SALES_ANALYTICS_CHAMBER_FLOW_FAB_ALL_EXCEL, chamberName, customerName);
        console.log("ApiService getAllSalesAnalyticsChamberFlowFabAllExcel getAllSalesAnalyticsChamberFlowFabAllExcelURL: ", getAllSalesAnalyticsChamberFlowFabAllExcelURL);

        return this.httpClient.get(getAllSalesAnalyticsChamberFlowFabAllExcelURL, { headers: this.httpHeaders });
    }

    getAllSalesAnalyticsChamberFlowFabFilterExcel(chamberName, customerName, fabNames) {

        console.log("ApiService getAllSalesAnalyticsChamberFlowFabFilterExcel chamberName: ", chamberName);
        console.log("ApiService getAllSalesAnalyticsChamberFlowFabFilterExcel customerName: ", customerName);

        const bodyParams = {

            'fabNames': fabNames
        }

        var getAllSalesAnalyticsChamberFlowFabFilterExcelURL = String.Format(this.GET_ALL_SALES_ANALYTICS_CHAMBER_FLOW_FAB_FILTER_EXCEL, chamberName, customerName);
        console.log("ApiService getAllSalesAnalyticsChamberFlowFabAllExcel getAllSalesAnalyticsChamberFlowFabFilterExcelURL: ", getAllSalesAnalyticsChamberFlowFabFilterExcelURL);

        console.log("ApiService getAllSalesAnalyticsChamberFlowFabFilterExcel bodyParams: ", JSON.stringify(bodyParams));
        return this.httpClient.post(getAllSalesAnalyticsChamberFlowFabFilterExcelURL, JSON.stringify(bodyParams), { headers: this.httpHeaders });
    }

    getAllSalesAnalyticsCustomerFlowFabAllExcel(customerName) {

        var getAllSalesAnalyticsCustomerFlowFabAllExcelURL = String.Format(this.GET_ALL_SALES_ANALYTICS_CUSTOMER_FLOW_FAB_ALL_EXCEL, customerName);
        console.log("ApiService getAllSalesAnalyticsCustomerFlowFabAllExcel getAllSalesAnalyticsCustomerFlowFabAllExcelURL: ", getAllSalesAnalyticsCustomerFlowFabAllExcelURL);

        return this.httpClient.get(getAllSalesAnalyticsCustomerFlowFabAllExcelURL, { headers: this.httpHeaders });
    }

    getAllSalesAnalyticsCustomerFlowFabFilterExcel(customerName, fabNames) {

        console.log("ApiService getAllSalesAnalyticsCustomerFlowFabFilterExcel customerName: ", customerName);

        const bodyParams = {

            'fabNames': fabNames
        }

        var getAllSalesAnalyticsCustomerFlowFabFilterExcelURL = String.Format(this.GET_ALL_SALES_ANALYTICS_CUSTOMER_FLOW_FAB_FILTER_EXCEL, customerName);
        console.log("ApiService getAllSalesAnalyticsCustomerFlowFabFilterExcel getAllSalesAnalyticsCustomerFlowFabFilterExcelURL: ", getAllSalesAnalyticsCustomerFlowFabFilterExcelURL);

        console.log("ApiService getAllSalesAnalyticsCustomerFlowFabFilterExcel bodyParams: ", JSON.stringify(bodyParams));
        return this.httpClient.post(getAllSalesAnalyticsCustomerFlowFabFilterExcelURL, JSON.stringify(bodyParams), { headers: this.httpHeaders });
    }

    getAllSalesAnalyticsCustomerFlowChambersAllExcel(customerName, fabName) {

        var getAllSalesAnalyticsCustomerFlowChambersAllExcelURL = String.Format(this.GET_ALL_SALES_ANALYTICS_CUSTOMER_FLOW_CHAMBERS_ALL_EXCEL, customerName, fabName);
        console.log("ApiService getAllSalesAnalyticsCustomerFlowChambersAllExcel getAllSalesAnalyticsCustomerFlowChambersAllExcelURL: ", getAllSalesAnalyticsCustomerFlowChambersAllExcelURL);

        return this.httpClient.get(getAllSalesAnalyticsCustomerFlowChambersAllExcelURL, { headers: this.httpHeaders });
    }

    getAllSalesAnalyticsCustomerFlowChambersFilterExcel(customerName, fabName, chamberNames) {

        console.log("ApiService getAllSalesAnalyticsCustomerFlowChambersFilterExcel customerName: ", customerName);
        console.log("ApiService getAllSalesAnalyticsCustomerFlowChambersFilterExcel fabName: ", fabName);

        const bodyParams = {

            'chamberName': chamberNames
        }

        var getAllSalesAnalyticsCustomerFlowChambersFilterExcelURL = String.Format(this.GET_ALL_SALES_ANALYTICS_CUSTOMER_FLOW_CHAMBER_FILTER_EXCEL, customerName, fabName);
        console.log("ApiService getAllSalesAnalyticsCustomerFlowChambersFilterExcel getAllSalesAnalyticsCustomerFlowChambersFilterExcelURL: ", getAllSalesAnalyticsCustomerFlowChambersFilterExcelURL);

        console.log("ApiService getAllSalesAnalyticsCustomerFlowChambersFilterExcel bodyParams: ", JSON.stringify(bodyParams));
        return this.httpClient.post(getAllSalesAnalyticsCustomerFlowChambersFilterExcelURL, JSON.stringify(bodyParams), { headers: this.httpHeaders });
    }

    getUserRoles(username, password) {

        console.log("ApiService getUserRoles username: ", username);
        console.log("ApiService getUserRoles password: ", password);

        const bodyParams = {

            'username': username,
            'password': password
        }

        console.log("ApiService getUserRoles bodyParams: ", JSON.stringify(bodyParams));
        return this.httpClient.post(this.GET_USER_ROLES, JSON.stringify(bodyParams), { headers: this.httpHeaders });
    }

    sendMail(emailBody) {

        console.log("ApiService sendMail emailBody: ", emailBody);

        console.log("ApiService sendMail bodyParams: ", JSON.stringify(emailBody));
        return this.httpClient.post(this.SEND_MAIL, JSON.stringify(emailBody), { headers: this.httpHeaders });
    }

    getMasterEmptySystemIdConfigurations(customerID) {
        
        var getMasterEmptySystemIdConfigurationsURL = String.Format(this.GET_MASTER_SYSTEM_IDS_WITH_EMPTY_FACETS, customerID);
        console.log("ApiService getSystemIDsWithEmptyFacetsByCustomerID getMasterEmptySystemIdConfigurationsURL: ", getMasterEmptySystemIdConfigurationsURL);

        return this.httpClient.get(getMasterEmptySystemIdConfigurationsURL, { headers: this.httpHeaders });
    }

    getMasterSystemIDsWithAllFacetsByCustomerID(customerID) {
        
        var getMasterAllSystemIdConfigurationsURL = String.Format(this.GET_MASTER_SYSTEM_IDS_WITH_ALL_FACETS, customerID);
        console.log("ApiService getSystemIDsWithAllFacetsByCustomerID getMasterAllSystemIdConfigurationsURL: ", getMasterAllSystemIdConfigurationsURL);

        return this.httpClient.get(getMasterAllSystemIdConfigurationsURL, { headers: this.httpHeaders });
    }

    getBuilderPlatforms() {

        console.log("ApiService getBuilderPlatforms getBuilderPlatforms: " + this.GET_BUILDER_PLATFORMS);
        return this.httpClient.get(this.GET_BUILDER_PLATFORMS, { headers: this.httpHeaders });
    }

    getBuilderFacets(platformID) {

        var getBuilderFacetsByPlatformId = String.Format(this.GET_BUILDER_FACETSBY_PLATFORM_ID, platformID,"", "id","asc","1","100");
        console.log("ApiService getBuilderFacets getBuilderFacetsByPlatformId: " + getBuilderFacetsByPlatformId);

        return this.httpClient.get(getBuilderFacetsByPlatformId, { headers: this.httpHeaders });
    }
}