import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BuilderNSOConfigurationPageComponent } from './builder-nso-configuration-page.component';

describe('BuilderNSOConfigurationPageComponent', () => {
  let component: BuilderNSOConfigurationPageComponent;
  let fixture: ComponentFixture<BuilderNSOConfigurationPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuilderNSOConfigurationPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuilderNSOConfigurationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
