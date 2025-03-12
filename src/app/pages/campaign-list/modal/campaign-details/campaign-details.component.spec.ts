import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignDetailsComponent } from './campaign-details.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('CampaignDetailsComponent', () => {
  let component: CampaignDetailsComponent;
  let fixture: ComponentFixture<CampaignDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampaignDetailsComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampaignDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
