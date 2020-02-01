export interface Opportunity {
    id:number;
    op_id:string;
    product_name: string;
    product_code: string;
    platform_name: string;
    nearest_product_config_name: string;

    c_date: string;
    m_date: string;
    created_by_id : string;
    created_by_name : string;
}