import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpenseHeadDetailsPagePage } from './expense-head-details.page.page';

describe('ExpenseHeadDetailsPagePage', () => {
  let component: ExpenseHeadDetailsPagePage;
  let fixture: ComponentFixture<ExpenseHeadDetailsPagePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ExpenseHeadDetailsPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
