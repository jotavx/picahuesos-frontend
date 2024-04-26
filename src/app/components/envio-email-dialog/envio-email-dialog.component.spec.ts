import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvioEmailDialogComponent } from './envio-email-dialog.component';

describe('EnvioEmailDialogComponent', () => {
  let component: EnvioEmailDialogComponent;
  let fixture: ComponentFixture<EnvioEmailDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnvioEmailDialogComponent]
    });
    fixture = TestBed.createComponent(EnvioEmailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
