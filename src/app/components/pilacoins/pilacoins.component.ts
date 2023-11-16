import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PilacoinService} from '../../services/pilacoin.service';
import { Pilacoin } from '../../models/pilacoin.model';
import { PilacoinComponent } from '../pilacoin/pilacoin.component';
import { SpinnerComponent } from '../spinner/spinner.component';
import { ServerDownMsgComponent } from '../server-down-msg/server-down-msg.component';

@Component({
  selector: 'app-pilacoins',
  standalone: true,
  imports: [CommonModule, PilacoinComponent, SpinnerComponent, ServerDownMsgComponent],
  templateUrl: './pilacoins.component.html',
  styleUrl: './pilacoins.component.css'
})
export class PilacoinsComponent {
  pilacoins: Pilacoin[] = [];
  serverDown: boolean = false;
  totalPilacoins: number = 0;
  constructor(private pilacoinService: PilacoinService){
    this.pilacoinService.getPilacoins().subscribe((data: Pilacoin[]) => {
      this.pilacoins = data;
      this.totalPilacoins = this.pilacoins.length;
      this.serverDown = false;
    },
    (error: any) => {
      this.serverDown = true;
    })
  }
}
