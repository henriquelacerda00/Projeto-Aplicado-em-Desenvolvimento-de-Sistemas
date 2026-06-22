import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxesGroupDescriptiveComponent } from './checkboxes-group-descriptive.component';

describe('CheckboxesGroupDescriptiveComponent', () => {
  let component: CheckboxesGroupDescriptiveComponent;
  let fixture: ComponentFixture<CheckboxesGroupDescriptiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxesGroupDescriptiveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckboxesGroupDescriptiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
