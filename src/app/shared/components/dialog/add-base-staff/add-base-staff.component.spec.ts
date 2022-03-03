import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AddBaseStaffComponent} from './add-base-staff.component';

describe('AddBaseStaffComponent', () => {
  let component: AddBaseStaffComponent;
  let fixture: ComponentFixture<AddBaseStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBaseStaffComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBaseStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
