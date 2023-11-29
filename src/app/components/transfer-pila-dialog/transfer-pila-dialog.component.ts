import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatSelectModule } from '@angular/material/select';
import { PilacoinService } from "../../services/pilacoin.service";
import {MatButtonModule} from '@angular/material/button';
import { User } from "../../models/user.model";
import { Pilacoin } from "../../models/pilacoin.model";
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-transfer-pila-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule,
    FontAwesomeModule
  ],
  templateUrl: './transfer-pila-dialog.component.html',
  styleUrl: './transfer-pila-dialog.component.css'
})
export class TransferPilaDialogComponent {
  @Input() pilacoin: Pilacoin;
  @Input() dialogRef: any;
  users: User[];
  destinationUser: User;
  faCircleCheck = faCircleCheck;
  showSuccessMsg: boolean = false;

  constructor(private builder: FormBuilder, private pilacoinService: PilacoinService) {}
  ngOnInit() {
    this.updateUsers();
    this.getUsers();
  }
  form = this.builder.group({
    user: this.builder.control(""),
  });

  onUserSelected(event: any) {
    this.destinationUser = event.value;
  }

  close() {
    this.dialogRef.close();
  }

  transfer() {
    console.log(this.destinationUser);
    this.pilacoinService.transfer(this.destinationUser, this.pilacoin).subscribe(data => {
      this.showSuccessMsg = true;
      setTimeout(() => {
        this.close();
      }, 2000);
    });
  }

  updateUsers() {
    this.pilacoinService.updateUserList().subscribe();
  }

  getUsers() {
    this.pilacoinService.getUsers().subscribe((data: User[]) => {
        this.users = data;
    });
  }
}
