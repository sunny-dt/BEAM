export interface MenunodeRecommended {
    id:number;

    name:string;
    menu_node_id : number;
    recommended_node_id : number;
    tile_fg_color : string;
    tile_bg_color : string;
    tile_image_link : string;
    tile_image_filename : string;
    serial_order : number;

    created_by_id : string;
    created_by_name : string;
    modified_by_id : string;
    modified_by_name : string;
    c_date: string;
    m_date: string;

}

