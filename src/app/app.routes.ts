import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PilacoinsComponent } from './components/pilacoins/pilacoins.component';

export const routes: Routes = [
  {path: "dashboard", component: DashboardComponent},
  {path: "pilacoins", component: PilacoinsComponent},
];
