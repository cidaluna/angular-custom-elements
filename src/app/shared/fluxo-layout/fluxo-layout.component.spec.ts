import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FluxoLayoutComponent } from './fluxo-layout.component';

describe('FluxoLayoutComponent', () => {
  let component: FluxoLayoutComponent;
  let fixture: ComponentFixture<FluxoLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FluxoLayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FluxoLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
