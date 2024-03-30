import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpenseHeadPage } from './expense-head.page';

describe('ExpenseHeadPage', () => {
  let component: ExpenseHeadPage;
  let fixture: ComponentFixture<ExpenseHeadPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ExpenseHeadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
