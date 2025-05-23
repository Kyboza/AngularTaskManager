import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  public show(message: string, type: 'success' | 'error'): void {
    const panelClassMap = {
      success: ['snackbar-success'],
      error: ['snackbar-error'],
    };

    this.snackBar.open(message, 'Close', {
      duration: 4000,
      panelClass: panelClassMap[type],
    });
  }
}
