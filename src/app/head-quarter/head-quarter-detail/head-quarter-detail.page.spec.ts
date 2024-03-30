import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeadQuarterDetailPage } from './head-quarter-detail.page';

describe('HeadQuarterDetailPage', () => {
  let component: HeadQuarterDetailPage;
  let fixture: ComponentFixture<HeadQuarterDetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HeadQuarterDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
