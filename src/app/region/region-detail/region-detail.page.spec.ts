import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegionDetailPage } from './region-detail.page';

describe('RegionDetailPage', () => {
  let component: RegionDetailPage;
  let fixture: ComponentFixture<RegionDetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RegionDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
