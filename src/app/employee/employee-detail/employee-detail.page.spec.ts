import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeDetailPage } from './employee-detail.page';

describe('EmployeeDetailPage', () => {
  let component: EmployeeDetailPage;
  let fixture: ComponentFixture<EmployeeDetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EmployeeDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
