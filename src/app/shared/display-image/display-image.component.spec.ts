import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayImageComponent } from './display-image.component';

describe('DisplayImageComponent', () => {
  let component: DisplayImageComponent;
  let fixture: ComponentFixture<DisplayImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayImageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DisplayImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
