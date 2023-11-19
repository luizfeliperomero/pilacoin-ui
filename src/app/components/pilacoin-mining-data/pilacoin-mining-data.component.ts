import { Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PilacoinMiningData } from '../../models/pilacoin-mining-data.model';

@Component({
  selector: 'app-pilacoin-mining-data',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pilacoin-mining-data.component.html',
  styleUrl: './pilacoin-mining-data.component.css'
})
export class PilacoinMiningDataComponent {
  @Input() pilacoinMiningData: PilacoinMiningData;
}
