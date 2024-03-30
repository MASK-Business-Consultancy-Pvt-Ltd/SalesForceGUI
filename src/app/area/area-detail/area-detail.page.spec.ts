import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AreaDetailPage } from './area-detail.page';

describe('AreaDetailPage', () => {
  let component: AreaDetailPage;
  let fixture: ComponentFixture<AreaDetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AreaDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
