import { Component, signal, effect} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PilacoinService} from '../../services/pilacoin.service';
import { Pilacoin } from '../../models/pilacoin.model';
import { PilacoinComponent } from '../pilacoin/pilacoin.component';
import { SpinnerComponent } from '../spinner/spinner.component';
import { ServerDownMsgComponent } from '../server-down-msg/server-down-msg.component';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-pilacoins',
  standalone: true,
  imports: [CommonModule, PilacoinComponent, SpinnerComponent, ServerDownMsgComponent, MatPaginatorModule],
  templateUrl: './pilacoins.component.html',
  styleUrl: './pilacoins.component.css'
})
export class PilacoinsComponent {
  pilacoins = signal<Pilacoin[]>([]);
  serverDown: boolean = false;
  totalPilacoins: number = 0;
  currentPage = 0;
  paginationField: string = "dataCriacao";

  constructor(private pilacoinService: PilacoinService){
    effect(() => {
      this.totalPilacoins = this.pilacoins().length;
    });
    this.refreshPilacoins();
  }

  getPilacoins(offset: number, size: number, field: string) {
    this.pilacoinService.getPilacoins(offset, size, field).subscribe((data: any) => {
      this.pilacoins.set(data.content);
      this.serverDown = false;
    },
    (error: any) => {
      this.serverDown = true;
    })
  }

  refreshPilacoins() {
    this.pilacoinService.refreshPilacoins().subscribe(() => {
      this.getPilacoins(0, 10, this.paginationField);
    });
  }

  handlePageEvent(pageEvent: PageEvent) {
    this.currentPage = pageEvent.pageIndex;
    this.getPilacoins(pageEvent.pageIndex, pageEvent.pageSize, this.paginationField);
  }
}
