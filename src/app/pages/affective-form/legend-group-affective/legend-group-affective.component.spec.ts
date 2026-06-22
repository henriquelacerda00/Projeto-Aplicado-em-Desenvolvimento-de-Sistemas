import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegendGroupAffectiveComponent } from './legend-group-affective.component';

describe('LegendGroupAffectiveComponent', () => {
  let component: LegendGroupAffectiveComponent;
  let fixture: ComponentFixture<LegendGroupAffectiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegendGroupAffectiveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LegendGroupAffectiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
