import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AnalyticsCustomersPageComponent } from './analytics-customers-page.component';

describe('AnalyticsCustomersPageComponent', () => {
  let component: AnalyticsCustomersPageComponent;
  let fixture: ComponentFixture<AnalyticsCustomersPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsCustomersPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsCustomersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
