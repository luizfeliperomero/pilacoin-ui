import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PilacoinService} from '../../services/pilacoin.service';
import { Pilacoin } from '../../models/pilacoin.model';
import { PilacoinComponent } from '../pilacoin/pilacoin.component';

@Component({
  selector: 'app-pilacoins',
  standalone: true,
  imports: [CommonModule, PilacoinComponent],
  templateUrl: './pilacoins.component.html',
  styleUrl: './pilacoins.component.css'
})
export class PilacoinsComponent {
  pilacoins: Pilacoin[];
  totalPilacoins: number;
  constructor(private pilacoinService: PilacoinService){
    this.pilacoinService.getPilacoins().subscribe((data: Pilacoin[]) => {
      this.pilacoins = data;
      this.totalPilacoins = this.pilacoins.length;
    })
  }
}
