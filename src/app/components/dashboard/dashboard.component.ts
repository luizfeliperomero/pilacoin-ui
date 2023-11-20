import { Component, signal, effect} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHammer, faScrewdriverWrench, faStop, faCircleCheck, faLinkSlash} from '@fortawesome/free-solid-svg-icons';
import { DashboardService } from '../../services/dashboard.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { ServerDownMsgComponent } from '../server-down-msg/server-down-msg.component';
import { StompService } from '../../services/stomp.service';
import { PilacoinService } from '../../services/pilacoin.service';
import { PilacoinsPerDifficulty } from '../../models/pilacoins_per_difficulty.model';
import { BlockService } from '../../services/block.service';
import {Observable, of, forkJoin} from 'rxjs';

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
  faCircleCheck = faCircleCheck;
  faLinkSlash = faLinkSlash;
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
  miningBlocks: boolean = false;
  isServerHealth: boolean;
  loading: boolean = true;
  columnChart = null;
  barChart = null;
  connected = signal<boolean>(true);
  forceDisconnect: boolean = false;

  constructor(private blockService: BlockService, private pilacoinService: PilacoinService, private dashboardService: DashboardService, private stompService: StompService) {
    this.setConnectedSignal();
    effect(() => {this.drawColumnChart(this.columnChartDataArray());});
    effect(() => {this.drawBarChart(this.barChartDataArray());});
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

  setConnectedSignal() {
    this.connected.set(this.stompService.stompClient.connected);
  }

  ngOnDestroy() {
      localStorage.setItem("mining", JSON.stringify(this.mining));
      localStorage.setItem("forceDisconnect", JSON.stringify(this.forceDisconnect));
      localStorage.setItem("connected", JSON.stringify(this.connected()));
  }


  ngOnInit() {
    this.mining = localStorage.getItem("mining") == "true";
    this.connected.set(localStorage.getItem("connected") == "true");
    this.forceDisconnect = localStorage.getItem("forceDisconnect") == "true";
    if(!this.stompService.stompClient.connected && !this.forceDisconnect) {
      this.stompService.stompClient.connect({}, () => {
        if(this.mining) {
          this.getPilacoinsFoundPerThread();
        }
      });
    } else if(this.mining && !this.forceDisconnect) {
      this.getPilacoinsFoundPerThread();
    }
    this.miningBlocks = localStorage.getItem("miningBlocks") == "true";
    google.charts.load('current', {packages: ['corechart', 'bar']});
  }

  getPilacoinsFoundPerDifficulty() {
    this.stompService.subscribe("/topic/pilacoins_found_per_difficulty", (data: any) => {
      let entries = Object.entries(data);

      entries.forEach(([key, value]: [string, number]) => {
        let numValue = value as number;
        this.barChartDataRecord[key] = numValue;
      });

      this.barChartDataArray.update(() => {
          return Object.entries(this.barChartDataRecord).map(([key, value]) => [key, value]);
      });
    }, this.pilacoinsFoundPerDifficultyHeader)
    this.getTotalPilacoins();
  }

  getPilacoinsFoundPerThread() {
   this.stompService.subscribe("/topic/pilacoins_found_per_thread", (data: any) => {
        let entries = Object.entries(data);

      entries.forEach(([key, value]: [string, number]) => {
        let numValue = value as number;
        this.columnChartDataRecord[key] = numValue;
      });

      this.columnChartDataArray.update(() => {
        return Object.entries(this.columnChartDataRecord).map(([key, value]) => [key, value]);
      });
    }, this.pilacoinsFoundPerThreadHeader)
    this.getPilacoinsFoundPerDifficulty();
  }

  manualConnect() {
    this.stompService.openNewConnection(() => {
      this.connected.set(this.stompService.stompClient.connected);
      localStorage.setItem("connected", JSON.stringify(this.connected()));
      this.forceDisconnect = false;
      localStorage.setItem("forceDisconnect", JSON.stringify(this.forceDisconnect));
    });
  }

  drawColumnChart(data) {
      if(data != null) {
        let columnChartData = google.visualization.arrayToDataTable([["Thread", "Pilacoins"]].concat(data));
          console.log("1");
        if(this.columnChart == null) {
          console.log("2");
          this.columnChart = new google.charts.Bar(document.getElementById("columnChart"));
        }
        let options = {
          title: "Pilacoins por Thread",
          colors:['#FF7F50']
        }
        this.columnChart.draw(columnChartData, google.charts.Bar.convertOptions(options));
      }
  }

  drawBarChart(data) {
      if(data != null) {
        let barChartData = google.visualization.arrayToDataTable([["Dificuldade", "Pilacoins"]].concat(data));
        if(this.barChart == null) {
          this.barChart = new google.visualization.BarChart(document.getElementById("barChart"));
        }
        let options = {
          title: "Pilacoins por Dificuldade",
          colors: ['#00008B']
        }
        this.barChart.draw(barChartData, options);
      }
  }

  startMiningPilacoins() {
    this.getPilacoinsFoundPerThread();
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

  disconnect() {
    if(this.stompService.stompClient.connected) {
      this.stompService.stompClient.disconnect();
      this.connected.set(false);
      localStorage.setItem("connected", JSON.stringify(false));
      this.stop();
      this.forceDisconnect = true;
      localStorage.setItem("forceDisconnect", JSON.stringify(this.forceDisconnect));
      this.miningBlocks = false;
      localStorage.setItem("miningBlocks", JSON.stringify(this.mining));
    }
  }

  processBeforeStopMiningPilacoins() {
    this.mining = false;
    this.stompService.stompClient.unsubscribe(this.totalPilacoinsHeader.id);
    this.stompService.stompClient.unsubscribe(this.pilacoinsFoundPerThreadHeader.id);
    this.stompService.stompClient.unsubscribe(this.pilacoinsFoundPerDifficultyHeader.id);
    this.columnChart = null;
    this.barChart = null;
    localStorage.setItem("mining", JSON.stringify(this.mining));
    this.clearChartData();
  }

  stop(): void {
    if(this.mining) {
      this.pilacoinService.stopMining().subscribe();
    }
    this.processBeforeStopMiningPilacoins();
  }

  clearChartData() {
    this.barChartDataRecord = {};
    this.barChartDataArray.set(null);
    this.columnChartDataRecord = {};
    this.columnChartDataArray.set(null);
    this.pilacoins_total.set(0);
  }

  getTotalPilacoins() {
    this.stompService.subscribe("/topic/total_pilacoins", (data: number) => {
      this.pilacoins_total.set(data);
    }, this.totalPilacoinsHeader)
  }
}
