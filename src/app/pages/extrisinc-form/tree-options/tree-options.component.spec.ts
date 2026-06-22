import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeOptionsComponent } from './tree-options.component';

describe('TreeOptionsComponent', () => {
  let component: TreeOptionsComponent;
  let fixture: ComponentFixture<TreeOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreeOptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreeOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
