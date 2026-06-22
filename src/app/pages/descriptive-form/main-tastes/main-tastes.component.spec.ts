import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainTastesComponent } from './main-tastes.component';

describe('MainTastesComponent', () => {
  let component: MainTastesComponent;
  let fixture: ComponentFixture<MainTastesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainTastesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainTastesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
