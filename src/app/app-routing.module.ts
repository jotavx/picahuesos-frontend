import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnvioEmailComponent } from './components/envio-email/envio-email.component';
import { LoginComponent } from './components/login/login.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { HomeComponent } from './components/home/home.component';
import { PaymentHistoryComponent } from './components/payment-history/payment-history.component';
import { CierreDeCajaComponent } from './components/cierre-de-caja/cierre-de-caja.component';
import { BajasComponent } from './components/bajas/bajas.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: 'home',
    component: HomeComponent,
    ...canActivate(() => redirectUnauthorizedTo(['/login'])),
  },
  {
    path: 'envio-email',
    component: EnvioEmailComponent,
    ...canActivate(() => redirectUnauthorizedTo(['/login'])),
  },
  {
    path: 'historial-pagos',
    component: PaymentHistoryComponent,
    ...canActivate(() => redirectUnauthorizedTo(['/login'])),
  },
  {
    path: 'cierre-de-caja',
    component: CierreDeCajaComponent,
    ...canActivate(() => redirectUnauthorizedTo(['/login'])),
  },
  {
    path: 'bajas',
    component: BajasComponent,
    ...canActivate(() => redirectUnauthorizedTo(['/login'])),
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
