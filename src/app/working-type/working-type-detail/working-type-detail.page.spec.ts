import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkingTypeDetailPage } from './working-type-detail.page';

describe('WorkingTypeDetailPage', () => {
  let component: WorkingTypeDetailPage;
  let fixture: ComponentFixture<WorkingTypeDetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(WorkingTypeDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
