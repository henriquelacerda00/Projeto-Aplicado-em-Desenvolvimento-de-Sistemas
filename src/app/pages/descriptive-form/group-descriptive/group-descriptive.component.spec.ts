import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupDescriptiveComponent } from './group-descriptive.component';

describe('GroupDescriptiveComponent', () => {
  let component: GroupDescriptiveComponent;
  let fixture: ComponentFixture<GroupDescriptiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupDescriptiveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupDescriptiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
