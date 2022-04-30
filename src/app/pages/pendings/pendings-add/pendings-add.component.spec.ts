import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingsAddComponent } from './pendings-add.component';

describe('PendingsAddComponent', () => {
  let component: PendingsAddComponent;
  let fixture: ComponentFixture<PendingsAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingsAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
