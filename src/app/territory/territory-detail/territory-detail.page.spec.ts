import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TerritoryDetailPage } from './territory-detail.page';

describe('TerritoryDetailPage', () => {
  let component: TerritoryDetailPage;
  let fixture: ComponentFixture<TerritoryDetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TerritoryDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
