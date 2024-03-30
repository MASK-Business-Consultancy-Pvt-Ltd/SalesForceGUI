import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DailyActivityDetailPage } from './daily-activity-detail.page';

describe('DailyActivityDetailPage', () => {
  let component: DailyActivityDetailPage;
  let fixture: ComponentFixture<DailyActivityDetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DailyActivityDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
