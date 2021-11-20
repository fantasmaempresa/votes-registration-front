import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsLayoutComponent } from './results-layout.component';

describe('ResultsLayoutComponent', () => {
  let component: ResultsLayoutComponent;
  let fixture: ComponentFixture<ResultsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultsLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
