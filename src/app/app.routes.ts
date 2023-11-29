import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PilacoinsComponent } from './components/pilacoins/pilacoins.component';
import { MiningDataPageComponent } from './components/mining-data-page/mining-data-page.component';

export const routes: Routes = [
  {path: "", component: DashboardComponent},
  {path: "dashboard", component: DashboardComponent},
  {path: "pilacoins", component: PilacoinsComponent},
  {path: "mining-data-page", component: MiningDataPageComponent},
];
