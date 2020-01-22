import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderAComponent } from './order-a.component';

describe('orderAComponent', () => {
  let component: OrderAComponent;
  let fixture: ComponentFixture<OrderAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
