import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShiptoAddressPage } from './shipto-address.page';

describe('ShiptoAddressPage', () => {
  let component: ShiptoAddressPage;
  let fixture: ComponentFixture<ShiptoAddressPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ShiptoAddressPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
