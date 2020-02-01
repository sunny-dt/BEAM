import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { MenuNodeService } from 'src/app/shared/menu-node.service';
import { MessageService } from 'src/app/shared/global-message.service';
import { Constants } from 'src/app/shared/constants';

@Component({
  selector: 'app-manage-platform',
  templateUrl: './manage-platform.component.html',
  styleUrls: ['./manage-platform.component.css']
})
export class ManagePlatformComponent implements OnInit {


  currentSelectedTab = "subnodes"

  constructor(private menuNodeService : MenuNodeService,
    private messageService : MessageService,
    private route : ActivatedRoute,
    private router : Router) {     }
    private sub: any;
    private globalMsgSubscription;

  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {
      console.log('parent route params: ', params);

      this.menuNodeService.currentSelectedNodeId = +params["node-id"];
      
      if(this.menuNodeService.tree_data.length > 0)
      {
        this.handleRoutingToChildren();
      }
      
    });



    this.globalMsgSubscription = this.messageService.getMessage().subscribe(message => { 

      console.log('global message received ', message);
       if(message.text == Constants.NODE_TREE_LOADED)
       {
            this.handleRoutingToChildren();
       }
    });
    
  }

  handleRoutingToChildren()
  {
    this.menuNodeService.currentSelectedNode = this.menuNodeService.findByIdInTreeData(this.menuNodeService.currentSelectedNodeId)

            if(this.menuNodeService.currentSelectedNode != undefined)
            {
              if(this.currentSelectedTab == 'subnodes' || this.currentSelectedTab == undefined)
              {
                this.navigateToSubNodePage();
              }
              else if(this.currentSelectedTab == 'metadata')
              {
                this.navigateToMetadataPage();
              }
              else if(this.currentSelectedTab == 'recommended')
              {
                this.navigateToRecommendedPage();
              }
            }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();

    this.globalMsgSubscription.unsubscribe();
  }

  navigateToSubNodePage() {

    console.log('navigateTo SubNodePage with current node', this.menuNodeService.currentSelectedNode);

    const node = this.menuNodeService.currentSelectedNode;
    this.router.navigate([ 'list', node.id, `[${node.name}] - Subnodes`], { relativeTo: this.route });

    
    this.currentSelectedTab = 'subnodes';
  }

  navigateToMetadataPage() {
    console.log('navigateTo MetadataPage with current node', this.menuNodeService.currentSelectedNode);

    const node = this.menuNodeService.currentSelectedNode;

    this.router.navigate([ 'metadata', node.id, `[${node.name}] - Metadata`], { relativeTo: this.route });
    this.currentSelectedTab = 'metadata';
  }

  navigateToRecommendedPage() {
    console.log('navigateTo RecommendedPage with current node', this.menuNodeService.currentSelectedNode);

    const node = this.menuNodeService.currentSelectedNode;

    this.router.navigate([ 'recommended', node.id, `[${node.name}] - Recommended`], { relativeTo: this.route });
    this.currentSelectedTab = 'recommended';

  }

}
