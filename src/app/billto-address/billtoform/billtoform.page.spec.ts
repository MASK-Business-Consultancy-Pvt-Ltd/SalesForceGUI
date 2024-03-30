import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BilltoformPage } from './billtoform.page';

describe('BilltoformPage', () => {
  let component: BilltoformPage;
  let fixture: ComponentFixture<BilltoformPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BilltoformPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
