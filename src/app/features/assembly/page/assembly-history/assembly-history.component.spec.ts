import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssemblyHistoryComponent } from './assembly-history.component';

describe('AssemblyHistoryComponent', () => {
  let component: AssemblyHistoryComponent;
  let fixture: ComponentFixture<AssemblyHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssemblyHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssemblyHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
