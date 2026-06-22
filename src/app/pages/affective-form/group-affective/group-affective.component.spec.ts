import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupAffectiveComponent } from './group-affective.component';

describe('GroupAffectiveComponent', () => {
  let component: GroupAffectiveComponent;
  let fixture: ComponentFixture<GroupAffectiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupAffectiveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupAffectiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
