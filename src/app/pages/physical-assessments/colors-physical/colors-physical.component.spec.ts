import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorsPhysicalComponent } from './colors-physical.component';

describe('ColorsPhysicalComponent', () => {
  let component: ColorsPhysicalComponent;
  let fixture: ComponentFixture<ColorsPhysicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorsPhysicalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColorsPhysicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
