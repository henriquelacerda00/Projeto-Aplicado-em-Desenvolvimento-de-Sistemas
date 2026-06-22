import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinhasAnalisesComponent } from './minhas-analises.component';

describe('MinhasAnalisesComponent', () => {
  let component: MinhasAnalisesComponent;
  let fixture: ComponentFixture<MinhasAnalisesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinhasAnalisesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MinhasAnalisesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
