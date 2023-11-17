import { Component, signal, effect} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHammer, faScrewdriverWrench, faStop } from '@fortawesome/free-solid-svg-icons';
import { DashboardService } from '../../services/dashboard.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { ServerDownMsgComponent } from '../server-down-msg/server-down-msg.component';
import { StompService } from '../../services/stomp.service';
import { PilacoinService } from '../../services/pilacoin.service';
import { PilacoinsPerDifficulty } from '../../models/pilacoins_per_difficulty.model';
import { BlockService } from '../../services/block.service';

declare var google: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, SpinnerComponent, ServerDownMsgComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  faHammer = faHammer;
  faScrewdriverWrench = faScrewdriverWrench;
  faStop = faStop;
  mining: boolean;
  pilacoins_total = signal<number>(0);
  barChartDataRecord: Record<string, number> = {};
  barChartDataArray = signal<any[][]>(null);
  columnChartDataRecord: Record<string, number> = {};
  columnChartDataArray = signal<any[][]>(null);
  totalPilacoinsHeader = { id: "total_pilacoins_cli" }
  pilacoinsFoundPerThreadHeader = { id: "pilacoins_found_per_thread_cli" }
  pilacoinsFoundPerDifficultyHeader = { id: "pilacoins_found_per_difficulty_cli" }
  running;
  wsSubscriptions: any[] = [];
  wsConnection: any;
  miningBlocks: boolean = false;

  isServerHealth: boolean;
  loading: boolean = true;
  constructor(private blockService: BlockService, private pilacoinService: PilacoinService, private dashboardService: DashboardService, private stompService: StompService) {
    this.dashboardService.healthCheck().subscribe((success) => {
      this.isServerHealth = true;
      this.loading = false;
    },
    (error) => {
      this.isServerHealth = false;
      this.loading = false;
      this.mining = false;
      localStorage.setItem("mining", JSON.stringify(this.mining));
    }
    );
  }

  ngOnDestroy() {
    this.wsSubscriptions.forEach(s => {
      s.unsubscribe();
    });
  }

  ngOnInit() {
    this.mining = localStorage.getItem("mining") == "true";
    this.miningBlocks = localStorage.getItem("miningBlocks") == "true";
    this.getPilacoinsFoundPerThread();
    google.charts.load('current', {packages: ['corechart']});
    google.charts.setOnLoadCallback(this.drawColumnChart);
    google.charts.setOnLoadCallback(this.drawBarChart);
  }

  getPilacoinsFoundPerDifficulty() {
    this.wsSubscriptions.push(this.stompService.subscribe("/topic/pilacoins_found_per_difficulty", (data: any) => {
      let entries = Object.entries(data);

      entries.forEach(([key, value]: [string, number]) => {
        let numValue = value as number;
        this.barChartDataRecord[key] = numValue;
      });

      this.barChartDataArray.update(() => {
          return Object.entries(this.barChartDataRecord).map(([key, value]) => [key, value]);
      });
      this.drawBarChart();
    }, this.pilacoinsFoundPerDifficultyHeader)
                             );
  }

  getPilacoinsFoundPerThread() {
    this.wsSubscriptions.push(this.stompService.subscribe("/topic/pilacoins_found_per_thread", (data: any) => {
        this.getTotalPilacoins();
        let entries = Object.entries(data);

      entries.forEach(([key, value]: [string, number]) => {
        let numValue = value as number;
        this.columnChartDataRecord[key] = numValue;
      });

      this.columnChartDataArray.update(() => {
        return Object.entries(this.columnChartDataRecord).map(([key, value]) => [key, value]);
      });
      this.drawColumnChart();
    }, this.pilacoinsFoundPerThreadHeader)
                             );
  }

  drawColumnChart() {
      let columnChartData = google.visualization.arrayToDataTable([["Thread", "Pilacoins"]].concat(this.columnChartDataArray()));
      let columnChart = new google.visualization.ColumnChart(document.getElementById("columnChart"));
      columnChart.draw(columnChartData, {title: "Pilacoins por Thread"});
  }

  drawBarChart() {
      let barChartData = google.visualization.arrayToDataTable([["Dificuldade", "Pilacoins"]].concat(this.barChartDataArray()));
      let barChart = new google.visualization.BarChart(document.getElementById("barChart"));
      barChart.draw(barChartData, {title: "Pilacoins por Dificuldade"});
  }

  startMiningPilacoins() {
    this.pilacoinService.startMining().subscribe(data => {
      this.mining = true;
      localStorage.setItem("mining", JSON.stringify(this.mining));
    });
  }

  startMiningBlocks() {
    this.blockService.startMining().subscribe(data => {
      this.miningBlocks = true;
      localStorage.setItem("miningBlocks", JSON.stringify(this.mining));
    });
  }

  stopMiningBlocks() {
    this.blockService.stopMining().subscribe();
    this.miningBlocks = false;
    localStorage.setItem("miningBlocks", JSON.stringify(this.mining));
  }

  stop(): void {
    this.mining = false;
    localStorage.setItem("mining", JSON.stringify(this.mining));
    this.pilacoinService.stopMining().subscribe();
    this.clearChartData();
  }

  clearChartData() {
    this.barChartDataRecord = {};
    this.barChartDataArray.set(null);
    this.columnChartDataRecord = {};
    this.columnChartDataArray.set(null);
    this.pilacoins_total.set(0);
  }

  getTotalPilacoins() {
    this.wsSubscriptions.push(this.stompService.subscribe("/topic/total_pilacoins", (data: number) => {
      this.getPilacoinsFoundPerDifficulty();
      this.pilacoins_total.set(data);
    }, this.totalPilacoinsHeader)
                             );
  }
}
