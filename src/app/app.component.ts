import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { StompService } from './services/stomp.service';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule, SidebarComponent, DashboardComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pilacoin';
  count: number = 0;
  constructor(private stompService: StompService) {
  }
  ngOnInit(): void {
    this.stompService.subscribe('/topic/pilacoins_found_per_difficulty', () => {
      console.log("TEEEEEEEEEST");
    })
  }
}

