import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShiptoformPage } from './shiptoform.page';

describe('ShiptoformPage', () => {
  let component: ShiptoformPage;
  let fixture: ComponentFixture<ShiptoformPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ShiptoformPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
