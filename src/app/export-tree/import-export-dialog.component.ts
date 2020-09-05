import { Component, Inject } from '@angular/core';
import { FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AssetService } from '../asset.service';
import jsonFormat from 'json-format';
import { environment } from './../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-import-export-dialog',
  templateUrl: './import-export-dialog.html',
  styles: [
    `
      mat-form-field {
        width: 100%;
      }
      mat-form-field textarea {
        height: 150px;
      }
    `
  ]
})
export class ImportExportDialogComponent {
  public scenarios: any;
  formattedChangedScenarios: string;
  public encodedScenarios = new FormControl('', [Validators.required, this.validJSONValidator()]);
  public importError: string = null;

  constructor(public dialogRef: MatDialogRef<ImportExportDialogComponent>, 
              @Inject(MAT_DIALOG_DATA) public data: any,
              public assetService: AssetService,
              private http: HttpClient,
              private snackBar: MatSnackBar) {

    this.scenarios = data.scenarios;
    this.formattedChangedScenarios = jsonFormat(this.assetService.getEncodedScenarios(this.scenarios));
    this.encodedScenarios.setValue(this.formattedChangedScenarios);
  }

  public importScenarios(): void {
    this.importError = null;
    try {
      const decodedScenarioJSON = this.assetService.getDecodedScenarios(this.scenarios.nodes, this.encodedScenarios.value);
      this.dialogRef.close(decodedScenarioJSON);
    } catch (e) {
      this.importError = 'Not a valid scenario JSON.';
    }
    this.encodedScenarios.updateValueAndValidity();
  }

  public saveScenariosToGist(): void {
    const payload = {
        filename: 'gloomhaven.json',
        content: this.formattedChangedScenarios
    }
    this.http.patch(`https://githelper.davwil00.co.uk/${environment.gistId}`, payload, {responseType: 'text'})
      .pipe(catchError(this.handleError))
      .subscribe(() => {
        this.snackBar.open('Saved!', '', {
          duration: 1500
        });
      })
  }

  private validJSONValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      return this.importError != null ? { validJSON: { value: this.importError } } : null;
    };
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }
}
