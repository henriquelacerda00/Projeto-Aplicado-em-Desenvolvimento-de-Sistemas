import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalAssessmentsComponent } from './physical-assessments.component';

describe('PhysicalAssessmentsComponent', () => {
  let component: PhysicalAssessmentsComponent;
  let fixture: ComponentFixture<PhysicalAssessmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhysicalAssessmentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhysicalAssessmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
