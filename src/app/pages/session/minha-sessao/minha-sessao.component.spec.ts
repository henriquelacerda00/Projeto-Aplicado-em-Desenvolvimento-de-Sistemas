import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinhaSessaoComponent } from './minha-sessao.component';

describe('MinhaSessaoComponent', () => {
  let component: MinhaSessaoComponent;
  let fixture: ComponentFixture<MinhaSessaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinhaSessaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MinhaSessaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
