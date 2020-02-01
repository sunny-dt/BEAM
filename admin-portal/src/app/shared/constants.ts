import { HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export class Constants {
    
    public static DEFAULT_PAGE_SIZE = 20;

    public static HTTP_HEADERS = new HttpHeaders({

        'Content-Type': 'application/json'
        /*,
        'Authorization': 'Basic ' + btoa(environment.apiBasicAuthUsername+':'+environment.apiBasicAuthPassword)*/
    });

    public static MULTIPART_FORM_DATA_HEADERS = new HttpHeaders({
        /*
        'Authorization': 'Basic ' + btoa(environment.apiBasicAuthUsername+':'+environment.apiBasicAuthPassword)*/
    }); 

    public static CHAMBER_ENDPOINT : string = "chambers";

    public static OPPORTUNITY_ENDPOINT : string = "opportunities";

    public static PLATFORM_ENDPOINT : string = "platforms";

    public static FACET_ENDPOINT : string = "facets";

    public static G2_PRODUCT_ENDPOINT : string = "g2products";

    public static G3_PRODUCT_ENDPOINT : string = "g3products";

    public static PRODUCT_CONFIG_ENDPOINT : string = "productconfigs";

    public static PRODUCT_CONFIG_MAPPING_ENDPOINT : string = "productconfigmappings";

    public static FILE_UPLOAD_ENDPOINT : string = "uploads";

    public static FEATURED_FILE_UPLOAD_ENDPOINT : string = "uploads/featured";
    public static LATEST_FILE_UPLOAD_ENDPOINT : string = "uploads/latest";
    public static RECOMMENDED_FILE_UPLOAD_ENDPOINT : string = "uploads/recommended";

    public static GET_LOGON_WINDOWS_USER_ENDPOINT : string = "me";

    public static METADATA_ENDPOINT : string = "menunodemetadata";
    public static MEDIA_ENDPOINT : string = "metadatamedia";
   
    public static ATTR_VALUE_ENDPOINT : string = "metadata_attr_values";

    public static FEATURED_ENDPOINT : string = "featured";

    public static LATEST_ENDPOINT : string = "latest";

    public static RECOMMENDED_ENDPOINT : string = "recommended";

    public static MENUNODE_ENDPOINT : string = "explorermenunode";
    public static MENUNODE_TYPE_ENDPOINT : string = "menunodetypes";
    public static METADATA_ATTR_TYPE_ENDPOINT : string = "metadata_table_attr_types";


    public static NODE_TYPE_ATTRIBUTE_NAME_ENDPOINT : string = "node_type_attribute_names";


    
    public static NEW_CHILD_NODE_ADDED : string = "newChildNodeAddedMessage"
    public static CHILD_NODE_DELETED : string = "childNodeDeletedMessage"
    public static CHILD_NODE_UPDATED : string = "childNodeUpdatedMessage"
    public static NODE_TREE_LOADED : string = "nodeTreeLoadedMessage"
    public static METADATA_LOADED : string = "metadataLoadedMessage"

    public static CUSETOMER_ENDPOINT : string = "customers";

    public static ANALYTICS_ENDPOINT : string = "SalesAnalytics";

    public static BUILDERS_ENDPOINT : string = "builders";
    public static MASTERS_ENDPOINT : string = "master";

    public static USER_ENDPOINT : string = "users";


    // public static COREDATA_PLATFORM_ENDPOINT : string = "master/addNewMasterPlatform";
 }