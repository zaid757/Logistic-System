import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {  DriverCreateComponent } from './driver-create.component';

describe('PostCreateComponent', () => {
  let component: DriverCreateComponent;
  let fixture: ComponentFixture<DriverCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
