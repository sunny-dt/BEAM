import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AnalyticsFabPageComponent } from './analytics-fab-page.component';

describe('AnalyticsFabPageComponent', () => {
  let component: AnalyticsFabPageComponent;
  let fixture: ComponentFixture<AnalyticsFabPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsFabPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsFabPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
