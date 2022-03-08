import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAssemblyComponent } from './create-assembly.component';

describe('CreateAssemblyComponent', () => {
  let component: CreateAssemblyComponent;
  let fixture: ComponentFixture<CreateAssemblyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAssemblyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAssemblyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
