import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BuilderNSODeltaReviewPageComponent } from './builder-nso-delta-review-page.component';

describe('BuilderNSODeltaReviewPageComponent', () => {
  let component: BuilderNSODeltaReviewPageComponent;
  let fixture: ComponentFixture<BuilderNSODeltaReviewPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuilderNSODeltaReviewPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuilderNSODeltaReviewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
