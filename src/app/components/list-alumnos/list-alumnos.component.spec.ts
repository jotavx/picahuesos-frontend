import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAlumnosComponent } from './list-alumnos.component';

describe('ListAlumnosComponent', () => {
  let component: ListAlumnosComponent;
  let fixture: ComponentFixture<ListAlumnosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListAlumnosComponent]
    });
    fixture = TestBed.createComponent(ListAlumnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
