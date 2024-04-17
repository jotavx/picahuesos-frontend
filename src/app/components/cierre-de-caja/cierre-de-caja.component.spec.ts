import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CierreDeCajaComponent } from './cierre-de-caja.component';

describe('CierreDeCajaComponent', () => {
  let component: CierreDeCajaComponent;
  let fixture: ComponentFixture<CierreDeCajaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CierreDeCajaComponent]
    });
    fixture = TestBed.createComponent(CierreDeCajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
