import { BuilderConfigurationHomePageComponent } from './builder-configuration-home-page.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

describe('BuilderConfigurationHomePageComponent', () => {
  let component: BuilderConfigurationHomePageComponent;
  let fixture: ComponentFixture<BuilderConfigurationHomePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuilderConfigurationHomePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuilderConfigurationHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
