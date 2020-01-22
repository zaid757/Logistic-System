import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderBComponent } from './order-b.component';

describe('OrderBComponent', () => {
  let component: OrderBComponent;
  let fixture: ComponentFixture<OrderBComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderBComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
