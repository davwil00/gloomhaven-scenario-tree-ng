import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ExportTreeComponent } from './export-tree/export-tree.component';
import { ImportExportDialogComponent } from './export-tree/import-export-dialog.component';
import { MaterialModule } from './material.module';
import { AppComponent } from './app.component';
import { TreeComponent } from './tree/tree.component';
import { AssetService } from './asset.service';
import { ScenarioInfoComponent, ScenarioInfoDialogComponent } from './scenario-info/scenario-info.component';
import { TreeLogicService } from './tree-logic.service';
import { KeyComponent } from './key/key.component';
import { MessagesComponent } from "./messages/messages.component";
import { MatCardModule } from "@angular/material/card";
import { MatTooltipModule } from "@angular/material/tooltip";
import { FHMessagesComponent } from './messages/fh-messages.component';

@NgModule({
  declarations: [
    AppComponent,
    TreeComponent,
    ScenarioInfoComponent,
    ScenarioInfoDialogComponent,
    ExportTreeComponent,
    ImportExportDialogComponent,
    KeyComponent,
    MessagesComponent,
    FHMessagesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTooltipModule
  ],
  providers: [AssetService, TreeLogicService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
