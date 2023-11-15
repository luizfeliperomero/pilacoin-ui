import { Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pilacoin } from '../../models/pilacoin.model';

@Component({
  selector: 'app-pilacoin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pilacoin.component.html',
  styleUrl: './pilacoin.component.css'
})
export class PilacoinComponent {
  @Input() pilacoin: Pilacoin;
}
