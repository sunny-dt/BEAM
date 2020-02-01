import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AnalyticsHomePageComponent } from './analytics-home-page.component';

describe('AnalyticsHomePageComponent', () => {
  let component: AnalyticsHomePageComponent;
  let fixture: ComponentFixture<AnalyticsHomePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsHomePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
