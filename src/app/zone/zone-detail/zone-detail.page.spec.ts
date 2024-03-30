import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZoneDetailPage } from './zone-detail.page';

describe('ZoneDetailPage', () => {
  let component: ZoneDetailPage;
  let fixture: ComponentFixture<ZoneDetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ZoneDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
