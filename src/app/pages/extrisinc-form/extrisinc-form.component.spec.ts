import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtrisincFormComponent } from './extrisinc-form.component';

describe('ExtrisincFormComponent', () => {
  let component: ExtrisincFormComponent;
  let fixture: ComponentFixture<ExtrisincFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtrisincFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtrisincFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
