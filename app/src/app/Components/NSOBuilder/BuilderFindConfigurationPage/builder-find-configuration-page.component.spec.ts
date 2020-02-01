import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BuilderFindConfigurationPageComponent } from './builder-find-configuration-page.component';

describe('BuilderFindConfigurationPageComponent', () => {
  let component: BuilderFindConfigurationPageComponent;
  let fixture: ComponentFixture<BuilderFindConfigurationPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuilderFindConfigurationPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuilderFindConfigurationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
