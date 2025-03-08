import { Component, Inject } from '@angular/core';
import { Campaign } from '../../../../models/campaign.interface';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-campaign-details',
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe],
  templateUrl: './campaign-details.component.html',
  styleUrl: './campaign-details.component.scss'
})
export class CampaignDetailsComponent {
  constructor(
    public dialogRef: MatDialogRef<CampaignDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Campaign,
    private readonly datePipe: DatePipe
  ) {}

  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
