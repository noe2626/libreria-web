import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingsEditComponent } from './pendings-edit.component';

describe('PendingsEditComponent', () => {
  let component: PendingsEditComponent;
  let fixture: ComponentFixture<PendingsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
