import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmEnviadosDialogComponent } from './confirm-enviados-dialog.component';

describe('ConfirmEnviadosDialogComponent', () => {
  let component: ConfirmEnviadosDialogComponent;
  let fixture: ComponentFixture<ConfirmEnviadosDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmEnviadosDialogComponent]
    });
    fixture = TestBed.createComponent(ConfirmEnviadosDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
