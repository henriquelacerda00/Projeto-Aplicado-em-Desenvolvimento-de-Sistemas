import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpressionValueExtrisincComponent } from './impression-value-extrisinc.component';

describe('ImpressionValueExtrisincComponent', () => {
  let component: ImpressionValueExtrisincComponent;
  let fixture: ComponentFixture<ImpressionValueExtrisincComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImpressionValueExtrisincComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImpressionValueExtrisincComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
