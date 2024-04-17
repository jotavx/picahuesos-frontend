import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAlumnComponent } from './create-alumn.component';

describe('CreateAlumnComponent', () => {
  let component: CreateAlumnComponent;
  let fixture: ComponentFixture<CreateAlumnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateAlumnComponent]
    });
    fixture = TestBed.createComponent(CreateAlumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
