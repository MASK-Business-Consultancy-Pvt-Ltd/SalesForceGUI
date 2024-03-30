import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerTypeDetailPage } from './customer-type-detail.page';

describe('CustomerTypeDetailPage', () => {
  let component: CustomerTypeDetailPage;
  let fixture: ComponentFixture<CustomerTypeDetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CustomerTypeDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
