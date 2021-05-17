import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ResultDialogData {
  title: string;
  content: string;
}

@Component({
  selector: 'app-result-dialog',
  templateUrl: 'result-dialog.html',
})
export class ResultDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: ResultDialogData) {}
}
