import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistWithNotesComponent } from './checklist-with-notes.component';

describe('ChecklistWithNotesComponent', () => {
  let component: ChecklistWithNotesComponent;
  let fixture: ComponentFixture<ChecklistWithNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChecklistWithNotesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChecklistWithNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
