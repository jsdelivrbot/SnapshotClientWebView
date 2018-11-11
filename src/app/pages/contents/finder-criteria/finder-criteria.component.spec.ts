import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinderCriteriaComponent } from './finder-criteria.component';

describe('FinderCriteriaComponent', () => {
  let component: FinderCriteriaComponent;
  let fixture: ComponentFixture<FinderCriteriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinderCriteriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinderCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
