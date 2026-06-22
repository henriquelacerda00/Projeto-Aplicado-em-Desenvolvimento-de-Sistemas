import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffectiveFormComponent } from './affective-form.component';

describe('AffectiveFormComponent', () => {
  let component: AffectiveFormComponent;
  let fixture: ComponentFixture<AffectiveFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AffectiveFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AffectiveFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
