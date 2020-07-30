import { Component, Inject } from "@angular/core";
import { Node } from "../models/models"
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AssetService } from 'app/asset.service';

@Component({
    selector: 'available-scenarios-dialog',
    templateUrl: './available-scenarios-dialog.component.html',
    styles: [`
img.available-scenario {
    width: 250px;
    height: auto;
}

.mat-dialog-content {
    max-height: none;
}
`]
})
export class AvailableScenariosDialogComponent {

    availableScenarios: Array<Node> = []

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                private assetService: AssetService) {
        this.availableScenarios = data.availableScenarios;
    }

    getImageUrl(img: number) {
        return this.assetService.getImageUrl(img)
    }
}