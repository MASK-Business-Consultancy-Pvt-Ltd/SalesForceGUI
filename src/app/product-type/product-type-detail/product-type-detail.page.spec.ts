import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductTypeDetailPage } from './product-type-detail.page';

describe('ProductTypeDetailPage', () => {
  let component: ProductTypeDetailPage;
  let fixture: ComponentFixture<ProductTypeDetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ProductTypeDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
