import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarSessoesComponent } from './gerenciar-sessoes.component';

describe('GerenciarSessoesComponent', () => {
  let component: GerenciarSessoesComponent;
  let fixture: ComponentFixture<GerenciarSessoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarSessoesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GerenciarSessoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
