import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpenseMasterDetailsPage } from './expense-master-details.page';

describe('ExpenseMasterDetailsPage', () => {
  let component: ExpenseMasterDetailsPage;
  let fixture: ComponentFixture<ExpenseMasterDetailsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ExpenseMasterDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
