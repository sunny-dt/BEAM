import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BuilderHomePageComponent } from './builder-home-page.component';

describe('BuilderHomePageComponent', () => {
  let component: BuilderHomePageComponent;
  let fixture: ComponentFixture<BuilderHomePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuilderHomePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuilderHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
