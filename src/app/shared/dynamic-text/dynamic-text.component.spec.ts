import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicTextComponent } from './dynamic-text.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DynamicTextComponent', () => {
  let component: DynamicTextComponent;
  let fixture: ComponentFixture<DynamicTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicTextComponent, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
