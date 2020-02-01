import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplorerPlatformDetailsPageComponent } from './explorer-platform-details-page.component';

describe('ExplorerPlatformDetailsPageComponent', () => {
  let component: ExplorerPlatformDetailsPageComponent;
  let fixture: ComponentFixture<ExplorerPlatformDetailsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExplorerPlatformDetailsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplorerPlatformDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
