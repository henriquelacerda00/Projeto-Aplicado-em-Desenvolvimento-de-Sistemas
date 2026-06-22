import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefectsAffectiveComponent } from './defects-affective.component';

describe('DefectsAffectiveComponent', () => {
  let component: DefectsAffectiveComponent;
  let fixture: ComponentFixture<DefectsAffectiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefectsAffectiveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefectsAffectiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
