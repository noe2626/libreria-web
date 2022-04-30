import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingsListComponent } from './pendings-list.component';

describe('PendingsListComponent', () => {
  let component: PendingsListComponent;
  let fixture: ComponentFixture<PendingsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
