import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkingTypePage } from './working-type.page';

describe('WorkingTypePage', () => {
  let component: WorkingTypePage;
  let fixture: ComponentFixture<WorkingTypePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(WorkingTypePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
