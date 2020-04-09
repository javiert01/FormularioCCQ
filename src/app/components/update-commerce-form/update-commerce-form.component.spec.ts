import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCommerceFormComponent } from './update-commerce-form.component';

describe('UpdateCommerceFormComponent', () => {
  let component: UpdateCommerceFormComponent;
  let fixture: ComponentFixture<UpdateCommerceFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateCommerceFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCommerceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
