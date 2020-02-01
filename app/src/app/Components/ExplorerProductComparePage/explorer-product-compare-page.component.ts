import { AppComponent } from '../../app.component';
import { ApiService } from 'src/app/Services/api.service';
import { Component, OnInit, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-explorer-product-compare-page',
  templateUrl: './explorer-product-compare-page.component.html',
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateY(100%)'}),
        animate('500ms ease-in', style({transform: 'translateY(0%)'}))
      ]),
      transition(':leave', [
        animate('500ms ease-in', style({transform: 'translateY(100%)'}))
      ])
    ])
  ],
  styleUrls: ['./explorer-product-compare-page.component.css']
})

export class ExplorerProductComparePageComponent implements OnInit {

  @Input() closable = true;
  @Input() visible: boolean;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private apiService: ApiService) { }

  ngOnInit() { }
}