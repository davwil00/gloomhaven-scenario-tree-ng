import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AssetService } from '../asset.service';
import { request } from '@octokit/request';
import jsonFormat from 'json-format'
import { environment } from './../../environments/environment';

@Component({
    selector: 'app-import-export-dialog',
    templateUrl: './import-export-dialog.html',
    styles: [`
    mat-form-field {
      width: 100%;
    }
    mat-form-field textarea {
      height: 150px;
    }
    `]
})
export class ImportExportDialogComponent {
    public scenarios: any;
    formattedChangedScenarios: string;
    public encodedScenarios = new FormControl('', [Validators.required, this.validJSONValidator()]);
    public importError: String = null;

    constructor(
        public dialogRef: MatDialogRef<ImportExportDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public assetService: AssetService
    ) {
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

    public saveScenariosToGist() {
        const requestWithAuth = request.defaults({
            headers: {
                authorization: `token ${environment.githubToken}`,
            },
        });

        const result = requestWithAuth(`PATCH /gists/${environment.gistId}`, {
            gist_id: environment.gistId,
            files: {
                'gloomhaven.json': {
                    content: this.formattedChangedScenarios
                }
            }
        }).then(response => {
            if (response.status === 200) {
                alert('Saved');
            } else {
                console.error(response.status);
                console.error(response.data)
            }
        }).catch(err => console.error(err));
    }

    private validJSONValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        return this.importError != null ? { 'validJSON': { value: this.importError } } : null;
    };
}
}