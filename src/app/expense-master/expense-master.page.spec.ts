import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpenseMasterPage } from './expense-master.page';

describe('ExpenseMasterPage', () => {
  let component: ExpenseMasterPage;
  let fixture: ComponentFixture<ExpenseMasterPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ExpenseMasterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
