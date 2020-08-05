import { Component, OnInit } from '@angular/core';
import { AssetService } from './asset.service';
import { TreeLogicService } from './tree-logic.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NodeData } from './models/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public allScenarios: any;
  public selectedScenario: any = null;

  availableScenarios: Array<NodeData> = [];
  completedScenarios: Array<NodeData> = [];
  blockedScenarios: Array<NodeData> = [];
  scenarioMap: { [key: string]: NodeData };

  constructor(private assetService: AssetService, private treeLogicService: TreeLogicService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.assetService.getScenariosJSON().subscribe((allScenarios) => {
      this.allScenarios = allScenarios;

      this.scenarioMap = allScenarios.nodes.reduce((prev, curr) => {
        prev[curr.data.id] = curr.data;
        return prev;
      }, {});

      allScenarios.nodes.forEach((node) => {
        switch (node.data.status) {
          case 'complete':
            this.completedScenarios.push(node.data);
            break;

          case 'incomplete':
            this.processIncompleteScenario(node.data);
            break;
        }
      });
    });
  }

  public handleScenarioSelect(scenario) {
    if (scenario) {
      const rawScenario = typeof scenario.data === 'function' ? scenario.data() : scenario.data;
      rawScenario.activePage = rawScenario.pages[0];
      rawScenario.imageUrl = this.getImageUrl(rawScenario.activePage);
      this.selectedScenario = rawScenario;
      /* Call this in case user drags the scenario. This will save it even if they make no other changes */
      this.allScenarios = this.treeLogicService.updateScenario(this.allScenarios, this.selectedScenario);
      this.assetService.setScenariosJSON(this.allScenarios);
    } else {
      this.selectedScenario = null;
    }
  }

  public getNextScenarioPage() {
    const pages = this.selectedScenario.pages;
    let activeIndex = pages.indexOf(this.selectedScenario.activePage);
    activeIndex++;

    if (activeIndex === pages.length) {
      activeIndex = 0;
    }

    this.selectedScenario.activePage = pages[activeIndex];
    this.selectedScenario.imageUrl = this.getImageUrl(this.selectedScenario.activePage);
  }

  public handleScenarioUpdate(changedScenario) {
    this.allScenarios = this.treeLogicService.updateScenario(this.allScenarios, changedScenario);
    this.assetService.setScenariosJSON(this.allScenarios);
    this.handleScenarioSelect(this.allScenarios.nodes.find((scenario) => scenario.data.id === changedScenario.id));
  }

  public handleScenariosImport(scenarios) {
    scenarios.edges = this.allScenarios.edges;
    this.allScenarios = scenarios;
    this.assetService.setScenariosJSON(this.allScenarios);
    this.snackBar.open('Scenarios Imported!', '', {
      duration: 1500
    });
  }

  private processIncompleteScenario(nodeData: NodeData) {
    let unlocked = false;
    let blocked = false;
    let requirementsSatified = true;

    this.allScenarios.edges
      .map((edge) => edge.data)
      .forEach((edge) => {
        if (edge.target === nodeData.id) {
          const status = this.scenarioMap[edge.source].status;

          switch (edge.type) {
            case 'unlocks':
              if (!unlocked && status === 'complete') {
                console.log(`%c Scenario ${edge.target} unlocked by scenario ${edge.source}`, 'color: green');
                unlocked = true;
              }
              break;

            case 'blocks':
              if (!blocked && status === 'complete' && edge.target !== '33' && edge.source !== '34') {
                console.log(`%c Scenario ${edge.target} is blocked by scenario ${edge.source}`, 'color: red');
                this.blockedScenarios.push(nodeData);
                blocked = true;
              }
              break;

            case 'requiredby':
              if (requirementsSatified && status !== 'complete') {
                console.log(`%c Scenario ${edge.target} requires scenario ${edge.source}`, 'color: yellow');
                requirementsSatified = false;
              }
              break;
          }
        }
      });

    if (unlocked && !blocked && requirementsSatified) {
      // check special requirements
      switch (nodeData.id) {
        case '33':
          // 42 blocks 33 if 25 not done
          // 34 blocks 33 if 24 not done or 42 done
          if (this.scenarioMap['34'].status === 'complete' && (this.scenarioMap['24'].status !== 'complete' || this.scenarioMap['42'].status === 'complete')) {
            console.log('Scenario 33 is blocked because scenario 34 is complete and either scenario 24 is complete or scenario 42 is not complete');
            this.blockedScenarios.push(nodeData);
            return;
          }
          break;

        case '34':
          // 25 blocks 34 if 33 done
          break;
        case '31':
        case '27':
          // if 35 is complete and 21 not done
          if (this.scenarioMap['35'].status === 'complete' && this.scenarioMap['21'].status !== 'complete') {
            console.log(`Scenario ${nodeData.id} is blocked because scenarios 35 is complete and scenario 21 is not`);
            this.blockedScenarios.push(nodeData);
            return;
          }
          break;
      }

      this.availableScenarios.push(nodeData);
    }
  }

  getImageUrl(activePage: number) {
    return `assets/scenarios/${activePage}.jpg`;
  }
}
