import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarSessionComponent } from './editar-session.component';

describe('EditarSessionComponent', () => {
  let component: EditarSessionComponent;
  let fixture: ComponentFixture<EditarSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarSessionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
