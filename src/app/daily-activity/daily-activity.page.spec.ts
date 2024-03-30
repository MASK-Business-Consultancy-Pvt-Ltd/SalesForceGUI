import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DailyActivityPage } from './daily-activity.page';

describe('DailyActivityPage', () => {
  let component: DailyActivityPage;
  let fixture: ComponentFixture<DailyActivityPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DailyActivityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
