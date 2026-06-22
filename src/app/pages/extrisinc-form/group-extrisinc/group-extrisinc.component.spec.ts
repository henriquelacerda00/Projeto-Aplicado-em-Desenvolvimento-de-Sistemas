import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupExtrisincComponent } from './group-extrisinc.component';

describe('GroupExtrisincComponent', () => {
  let component: GroupExtrisincComponent;
  let fixture: ComponentFixture<GroupExtrisincComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupExtrisincComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupExtrisincComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
