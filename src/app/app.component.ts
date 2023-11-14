import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { StompService } from './services/stomp.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pilacoin';
  count: number = 0;
  constructor(private http: HttpClient, private stompService: StompService) {
  }
  ngOnInit(): void {
    this.stompService.subscribe('/ws/topic/pilacoins_found_per_difficulty', (data): any => {
        console.log(data);
        console.log("TEST");
    })
  }
}

