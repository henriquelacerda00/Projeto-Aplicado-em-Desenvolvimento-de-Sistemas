import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroRealizadoComponent } from './cadastro-realizado.component';

describe('CadastroRealizadoComponent', () => {
  let component: CadastroRealizadoComponent;
  let fixture: ComponentFixture<CadastroRealizadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroRealizadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroRealizadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
