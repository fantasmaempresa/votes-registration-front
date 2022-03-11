import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MemorandumComponent} from './memorandum.component';

describe('MemorandumComponent', () => {
  let component: MemorandumComponent;
  let fixture: ComponentFixture<MemorandumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemorandumComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemorandumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
