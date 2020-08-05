import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImportExportDialogComponent } from './import-export-dialog.component';

@Component({
  selector: 'app-export-tree',
  templateUrl: './export-tree.component.html',
  styleUrls: ['./export-tree.component.css']
})
export class ExportTreeComponent implements OnInit {
  @Input() scenarios: any;
  @Output() importScenarios = new EventEmitter();
  constructor(public dialog: MatDialog) {}

  ngOnInit() {}
  public showImportExportModal() {
    const dialogRef = this.dialog.open(ImportExportDialogComponent, {
      width: '600px',
      height: '75vh',
      data: { scenarios: this.scenarios }
    });
    dialogRef.afterClosed().subscribe((scenarios) => {
      if (scenarios) {
        this.importScenarios.emit(scenarios);
      }
    });
  }
}
