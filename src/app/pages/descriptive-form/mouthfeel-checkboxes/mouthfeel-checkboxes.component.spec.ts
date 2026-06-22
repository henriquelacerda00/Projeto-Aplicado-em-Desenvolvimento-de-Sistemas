import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MouthfeelCheckboxesComponent } from './mouthfeel-checkboxes.component';

describe('MouthfeelCheckboxesComponent', () => {
  let component: MouthfeelCheckboxesComponent;
  let fixture: ComponentFixture<MouthfeelCheckboxesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MouthfeelCheckboxesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MouthfeelCheckboxesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
