import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodicElementListComponent } from './periodic-element-list.component';

describe('PeriodicElementListComponent', () => {
  let component: PeriodicElementListComponent;
  let fixture: ComponentFixture<PeriodicElementListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeriodicElementListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PeriodicElementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
