import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeadQuarterPage } from './head-quarter.page';

describe('HeadQuarterPage', () => {
  let component: HeadQuarterPage;
  let fixture: ComponentFixture<HeadQuarterPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HeadQuarterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
