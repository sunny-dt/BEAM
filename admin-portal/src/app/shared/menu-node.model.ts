export interface MenuNode {
    id:number;
    name:string;
    lvl:number;
    parent_node_id:number;
    seq : number;
    created_by_id : string;
    created_by_name : string;
    modified_by_id: string;
    modified_by_name: string;
    c_date: string;
    m_date: string;
    node_type_name: string;
    node_type_id: number;
    tile_fg_color: string;
    tile_bg_color: string;
    tile_image_filename: string;
    tile_image_link: string;
    metadata_count: number;
    recommended_count: string;
    featured_count: string;
    children : MenuNode[];
}
