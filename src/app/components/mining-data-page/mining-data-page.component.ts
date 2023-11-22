import { Component, signal} from '@angular/core';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { PilacoinMiningDataComponent } from '../pilacoin-mining-data/pilacoin-mining-data.component';
import { PilacoinService } from '../../services/pilacoin.service';
import { PilacoinMiningData } from '../../models/pilacoin-mining-data.model';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-mining-data-page',
  standalone: true,
  imports: [CommonModule, PilacoinMiningDataComponent, MatPaginatorModule],
  templateUrl: './mining-data-page.component.html',
  styleUrl: './mining-data-page.component.css'
})
export class MiningDataPageComponent {
  pilacoinMiningDataArr = signal<PilacoinMiningData[]>([]);
  currentPage: number = 0;

  constructor(private pilacoinService: PilacoinService) {}

  ngOnInit() {
    this.listPilacoinMiningData(0, 10, "date");
  }

  listPilacoinMiningData(offset: number, size: number, field: string) {
    this.pilacoinService.getMiningData(offset, size, field).subscribe(data => {
      data.content.forEach(data => {
        data.date = new Date(data.date).toLocaleDateString();
      });
      this.pilacoinMiningDataArr.set(data.content);
    });
  }

  handlePageEvent(pageEvent: PageEvent) {
    this.listPilacoinMiningData(pageEvent.pageIndex, pageEvent.pageSize, "date");
  }

}
