import { Component, OnInit, AfterViewInit } from '@angular/core';

import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuNodesDataSource } from '../shared/menu-node.datasource';
import { MenuNodeService } from '../shared/menu-node.service';
import { MenuNode } from '../shared/menu-node.model';
import { MatDialog } from '@angular/material';
import { NotificationService } from '../shared/notification.service';
import { DialogService } from '../shared/dialog.service';
import { AuthorizationService } from '../shared/authServices/authorization.service';
import { MessageService } from '../shared/global-message.service';
import { Constants } from '../shared/constants';



// let tree_data: MenuNode[] = [];
// function findByIdInList(list, id) {
//   let node;
//   list.some(function(currentItem) {
//     return node = currentItem.id == id ? currentItem : findByIdInList(currentItem.children, id);
//   });
//   return node;
// }

/** Flat node with expandable and level information */
interface ExplorerFlatNode {
  expandable: boolean;
  name: string;
  id : number;
  level: number;
}

@Component({
  selector: 'app-manage-explorer',
  templateUrl: './manage-explorer.component.html',
  styleUrls: ['./manage-explorer.component.css']
})
export class ManageExplorerComponent implements OnInit, AfterViewInit {
  

  private sub: any;
  private globalMsgSubscription;
  menudataSource: MenuNodesDataSource;


  constructor(public menunodeService : MenuNodeService,private dialog : MatDialog,
    private notificationService : NotificationService,
    private dialogService : DialogService,
    private messageService : MessageService,
    private authorizationService : AuthorizationService,    private route : ActivatedRoute,
    private router : Router) {
    this.dataSource.data = [];

  }

  navigateToPage(node: any) {
    console.log('navigateToPage ', node);

    this.menunodeService.currentSelectedNode = node;

    this.router.navigate([ 'manage-nodes', node.id, `[${node.name}]`], { relativeTo: this.route });
    
  }

  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {
      console.log('parent route params: ', params);
    });

   


    this.globalMsgSubscription = this.messageService.getMessage().subscribe(message => { 

       console.log('global message received ', message);
        if(message.text == Constants.NEW_CHILD_NODE_ADDED ||
          message.text == Constants.CHILD_NODE_DELETED ||
          message.text == Constants.CHILD_NODE_UPDATED)
        {
          console.log('came inside');
          this.menudataSource.loadMenuNodes();
        }
     });


    this.menudataSource = new MenuNodesDataSource(this.menunodeService, this.dialogService, this.authorizationService);

    this.menudataSource.menunodesSubject.subscribe(menunodes => {
      this.dataSource.data = menunodes;

      this.setMenuTreeExpandState();
    })


    this.menudataSource.loadMenuNodes();
  }

  ngAfterViewInit(): void {
    
    this.setMenuTreeExpandState();
  }

  setMenuTreeExpandState(): void{

    if(this.menunodeService.currentSelectedNodeId == undefined)
    return;

    if(this.menunodeService.tree_data.length == 0)
    return;

    

    let nodesToExpand = [];

    let currentNodeId = this.menunodeService.currentSelectedNodeId;
    let currentNode =  this.menunodeService.findByIdInTreeData(currentNodeId);
    console.log('tree data ', this.menunodeService.tree_data);
    console.log('current node ', currentNode);

    if(currentNode == undefined)
    return;

    nodesToExpand.push(currentNode);

    while(currentNode.parent_node_id != 1)
    {
      currentNodeId = currentNode.parent_node_id;
      currentNode = this.menunodeService.findByIdInTreeData(currentNodeId);

      console.log('current node ', currentNode);

      if(currentNode != undefined)
      {
        nodesToExpand.push(currentNode);
      }

    }

    const nodeIdsToExpand =  nodesToExpand.map(n => {
      return n.id;
    })

    var filteredNodes = this.treeControl.dataNodes.filter(
      function(dn) {
        return this.indexOf(dn.id) >= 0;
      },
      nodeIdsToExpand
  );

    for(let treeNode of filteredNodes)
    {
      this.treeControl.expand(treeNode);
    }

  }

   
  




  ngOnDestroy() {
    this.sub.unsubscribe();
    this.globalMsgSubscription.unsubscribe();
  }

  loadMenuNodes() {
    this.menudataSource.loadMenuNodes();
  }


  private _transformer = (node: MenuNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      id : node.id,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<ExplorerFlatNode>(
      node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
      this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);


  hasChild = (_: number, node: ExplorerFlatNode) => node.expandable;
}
