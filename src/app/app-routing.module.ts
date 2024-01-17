import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AgeChartComponent } from './components/component/charts/age-chart/age-chart.component';
import { ClasseBilletsChartComponent } from './components/classe-billets-chart/classe-billets-chart.component';
import { HomeComponent } from './components/home/home.component';
import { TableComponent } from './components/table/table.component';
import { AuthGuard } from './guard/auth.guard'; 


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },  
  { path: 'login', component: LoginComponent },  
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] }, 
  { path: 'statistics/age', component: AgeChartComponent },
  { path: 'statistics/classe', component: ClasseBilletsChartComponent },
  { path: 'table', component: TableComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
