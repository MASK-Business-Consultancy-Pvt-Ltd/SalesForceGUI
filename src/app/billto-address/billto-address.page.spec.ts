import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BilltoAddressPage } from './billto-address.page';

describe('BilltoAddressPage', () => {
  let component: BilltoAddressPage;
  let fixture: ComponentFixture<BilltoAddressPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BilltoAddressPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
