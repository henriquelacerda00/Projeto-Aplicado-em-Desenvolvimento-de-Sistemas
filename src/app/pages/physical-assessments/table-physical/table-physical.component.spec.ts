import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablePhysicalComponent } from './table-physical.component';

describe('TablePhysicalComponent', () => {
  let component: TablePhysicalComponent;
  let fixture: ComponentFixture<TablePhysicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablePhysicalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablePhysicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
