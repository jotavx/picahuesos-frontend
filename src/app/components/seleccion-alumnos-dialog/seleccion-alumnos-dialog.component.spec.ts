import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionAlumnosDialogComponent } from './seleccion-alumnos-dialog.component';

describe('SeleccionAlumnosDialogComponent', () => {
  let component: SeleccionAlumnosDialogComponent;
  let fixture: ComponentFixture<SeleccionAlumnosDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeleccionAlumnosDialogComponent]
    });
    fixture = TestBed.createComponent(SeleccionAlumnosDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
