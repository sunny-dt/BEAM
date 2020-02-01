import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplorerPlatformComparePageComponent } from './explorer-platform-compare-page.component';

describe('ExplorerProductComparePageComponent', () => {
  let component: ExplorerPlatformComparePageComponent;
  let fixture: ComponentFixture<ExplorerPlatformComparePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExplorerPlatformComparePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplorerPlatformComparePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
