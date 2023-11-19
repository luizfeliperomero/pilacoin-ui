import { Component } from '@angular/core';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { PilacoinMiningDataComponent } from '../pilacoin-mining-data/pilacoin-mining-data.component';
import { PilacoinService } from '../../services/pilacoin.service';
import { PilacoinMiningData } from '../../models/pilacoin-mining-data.model';

@Component({
  selector: 'app-mining-data-page',
  standalone: true,
  imports: [CommonModule, PilacoinMiningDataComponent],
  templateUrl: './mining-data-page.component.html',
  styleUrl: './mining-data-page.component.css'
})
export class MiningDataPageComponent {
  pilacoinMiningDataArr: PilacoinMiningData[] = [];

  constructor(private pilacoinService: PilacoinService) {}

  ngOnInit() {
    this.listPilacoinMiningData();
  }

  listPilacoinMiningData() {
    this.pilacoinService.getMiningData().subscribe(data => {
      data.forEach(data => {
        data.date = new Date(data.date).toLocaleDateString();
      });
      this.pilacoinMiningDataArr = data;
    });
  }
}
