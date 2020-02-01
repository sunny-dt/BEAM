import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplorerProductComparePageComponent } from './explorer-product-compare-page.component';

describe('ExplorerProductComparePageComponent', () => {
  let component: ExplorerProductComparePageComponent;
  let fixture: ComponentFixture<ExplorerProductComparePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExplorerProductComparePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplorerProductComparePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
