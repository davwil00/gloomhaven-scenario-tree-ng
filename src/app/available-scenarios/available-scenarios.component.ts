import { Component, OnInit } from "@angular/core";
import { AssetService } from "../asset.service";
import { Node } from "../models/models"
import { MatDialog } from '@angular/material/dialog';
import { AvailableScenariosDialogComponent } from './available-scenarios-dialog.component';

@Component({
  templateUrl: "./available-scenarios.component.html",
  selector: "available-scenarios",
  styleUrls: ['./available-scenarios.component.css']
})
export class AvailableScenariosComponent implements OnInit {
  availableScenarios: Array<Node> = [];

  constructor(private assetService: AssetService,
              private dialog: MatDialog) {}

  ngOnInit() {
    this.assetService.getScenariosJSON().subscribe(allScenarios => {
        const incompleteScenarios = allScenarios.nodes.filter(node => 
            node.data.status === 'incomplete' )

        // For each incomplete scenario
        incompleteScenarios.forEach(incompleteScenario => {
            // find unlocks
            const unlockedBy = []
            const blockedBy = []
            allScenarios.edges.forEach(edge => {
                if (edge.data.target === incompleteScenario.data.id) {
                    if (edge.data.type === 'unlocks') {
                        unlockedBy.push(edge.data.source)
                    } else if (edge.data.type === 'blocks') {
                        blockedBy.push(edge.data.source)
                    }
                }
            })

            // check all unlockedBy scenarios are complete:
            let unlocked = true
            for (const id of unlockedBy) {
                const unlockedByScenario = allScenarios.nodes.find(node => node.data.id === id)
                if (unlockedByScenario.data.status !== 'complete') {
                    unlocked = false;
                    console.log(`Scenario ${incompleteScenario.data.id} requires scenario ${unlockedByScenario.data.id}`)
                    break;
                }
            }

            // check no blocked scenarios are complete
            let blocked = false
            for (const id of blockedBy) {
                const blockedByScenario = allScenarios.nodes.find(node => node.data.id === id)
                if (blockedByScenario.data.status === 'complete') {
                    console.log(`scenario ${incompleteScenario.data.id} is blocked by scenario ${blockedByScenario.data.id}`)
                    blocked = true;
                    break;
                }
            }

            if (unlocked && !blocked) {
                this.availableScenarios.push(incompleteScenario)
            }
        })
    })
  }

  showAvailableScenariosModal() {
      this.dialog.open(AvailableScenariosDialogComponent, {
          width: '100%',
          height: '100%',
          data: { availableScenarios: this.availableScenarios }
      });
  }
}
