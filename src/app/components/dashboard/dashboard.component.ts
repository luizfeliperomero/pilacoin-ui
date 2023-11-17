import { Component, signal, effect} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHammer, faScrewdriverWrench, faStop } from '@fortawesome/free-solid-svg-icons';
import { DashboardService } from '../../services/dashboard.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { ServerDownMsgComponent } from '../server-down-msg/server-down-msg.component';
import { StompService } from '../../services/stomp.service';
import { PilacoinsPerDifficulty } from '../../models/pilacoins_per_difficulty.model';

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

  isServerHealth: boolean;
  loading: boolean = true;
  constructor(private dashboardService: DashboardService, private stompService: StompService) {
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

  ngOnInit() {
    //this.getPilacoinsFoundPerDifficulty();
    this.mining = localStorage.getItem("mining") == "true";
    this.getPilacoinsFoundPerThread();
    google.charts.load('current', {packages: ['corechart']});
    google.charts.setOnLoadCallback(this.drawCharts);
  }

  getPilacoinsFoundPerDifficulty() {
    this.stompService.subscribe("/topic/pilacoins_found_per_difficulty", (data: any) => {
      let entries = Object.entries(data);
      let [key, value] = entries[0];
      let numValue = value as number;
      this.barChartDataRecord[key] = numValue;
      this.barChartDataArray.update((currentValue: any[][]) => {
          return Object.entries(this.barChartDataRecord).map(([key, value]) => [key, value]);
      });
      this.drawCharts();
    }, this.pilacoinsFoundPerDifficultyHeader);
  }

  getPilacoinsFoundPerThread() {
    this.stompService.subscribe("/topic/pilacoins_found_per_thread", (data: any) => {
        this.getTotalPilacoins();
        let entries = Object.entries(data);

      entries.forEach(([key, value]: [string, number]) => {
        let numValue = value as number;
        this.columnChartDataRecord[key] = numValue;
      });

      this.columnChartDataArray.update(() => {
        return Object.entries(this.columnChartDataRecord).map(([key, value]) => [key, value]);
      });
      this.drawCharts();
    }, this.pilacoinsFoundPerThreadHeader);
  }


  drawCharts() {
      //let barChartData = google.visualization.arrayToDataTable([["Dificuldade", "Pilacoins"]].concat(this.barChartDataArray()));
      let columnChartData = google.visualization.arrayToDataTable([["Thread", "Pilacoins"]].concat(this.columnChartDataArray()));

     // let barChart = new google.visualization.BarChart(document.getElementById("barChart"));
      let columnChart = new google.visualization.ColumnChart(document.getElementById("columnChart"));

      // barChart.draw(barChartData, null);
      columnChart.draw(columnChartData, null);
  }

  startMining() {
    this.dashboardService.startMining().subscribe(data => {
      this.mining = true;
      localStorage.setItem("mining", JSON.stringify(this.mining));
    });
  }

    stop(): void {
      this.running = false;
      this.mining = false;
      this.isServerHealth = false;
      localStorage.setItem("mining", JSON.stringify(this.mining));
      this.dashboardService.stopMining().subscribe();
    }

    getTotalPilacoins() {
      this.stompService.subscribe("/topic/total_pilacoins", (data: number) => {
        this.pilacoins_total.set(data);
      }, this.totalPilacoinsHeader);
    }
}
