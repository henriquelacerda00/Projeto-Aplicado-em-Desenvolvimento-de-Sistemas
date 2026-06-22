import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtrisincSessionPageComponent } from './extrisinc-session-page.component';

describe('ExtrisincSessionPageComponent', () => {
  let component: ExtrisincSessionPageComponent;
  let fixture: ComponentFixture<ExtrisincSessionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtrisincSessionPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtrisincSessionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
