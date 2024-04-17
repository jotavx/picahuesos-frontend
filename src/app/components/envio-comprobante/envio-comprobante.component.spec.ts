import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvioComprobanteComponent } from './envio-comprobante.component';

describe('EnvioComprobanteComponent', () => {
  let component: EnvioComprobanteComponent;
  let fixture: ComponentFixture<EnvioComprobanteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnvioComprobanteComponent]
    });
    fixture = TestBed.createComponent(EnvioComprobanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
