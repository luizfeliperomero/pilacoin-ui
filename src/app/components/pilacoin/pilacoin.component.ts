import { Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pilacoin } from '../../models/pilacoin.model';
import { MatDialogModule, MatDialog} from "@angular/material/dialog";
import {TransferPilaDialogComponent } from "../transfer-pila-dialog/transfer-pila-dialog.component";

@Component({
  selector: 'app-pilacoin',
  standalone: true,
  imports: [CommonModule, MatDialogModule, TransferPilaDialogComponent],
  templateUrl: './pilacoin.component.html',
  styleUrl: './pilacoin.component.css'
})
export class PilacoinComponent {
  constructor(private dialog: MatDialog) {
  }
  @Input() pilacoin: Pilacoin;

  openDialog() {
    let dialogRef = this.dialog.open(TransferPilaDialogComponent, {
      width: "30%",
      height: "300px",
      enterAnimationDuration: '1000ms',
      exitAnimationDuration: '1000ms',
    });
    dialogRef.componentInstance.pilacoin = this.pilacoin;
    dialogRef.componentInstance.dialogRef = dialogRef;
  }
}
