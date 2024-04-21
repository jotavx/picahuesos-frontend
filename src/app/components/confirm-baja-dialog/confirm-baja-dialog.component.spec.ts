import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmBajaDialogComponent } from './confirm-baja-dialog.component';

describe('ConfirmBajaDialogComponent', () => {
  let component: ConfirmBajaDialogComponent;
  let fixture: ComponentFixture<ConfirmBajaDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmBajaDialogComponent]
    });
    fixture = TestBed.createComponent(ConfirmBajaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
