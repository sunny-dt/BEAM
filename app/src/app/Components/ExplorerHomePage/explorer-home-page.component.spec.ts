import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplorerHomePageComponent } from './explorer-home-page.component';

describe('ExplorerHomePageComponent', () => {
  let component: ExplorerHomePageComponent;
  let fixture: ComponentFixture<ExplorerHomePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExplorerHomePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplorerHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
