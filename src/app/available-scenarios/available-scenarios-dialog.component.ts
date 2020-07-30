import { Component, Inject } from "@angular/core";
import { Node, NodeData } from "../models/models"
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

.mat-badge-medium.mat-badge-after .mat-badge-content {
  top: -5px;
  right: -25px;
}
`]
})
export class AvailableScenariosDialogComponent {

    availableScenarios: Array<NodeData> = [];
    completedScenarios: Array<NodeData> = [];
    blockedScenarios: Array<NodeData> = [];

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                private assetService: AssetService) {
        this.availableScenarios = data.availableScenarios;
        this.completedScenarios = data.completedScenarios;
        this.blockedScenarios = data.blockedScenarios;
    }

    getImageUrl(img: number) {
        return this.assetService.getImageUrl(img)
    }
}