import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';

import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { AppComponent } from './app.component';
import { ListAlumnosComponent } from './components/list-alumnos/list-alumnos.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { environment } from 'src/environments/enviroment';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { EnvioEmailComponent } from './components/envio-email/envio-email.component';
import { SeleccionAlumnosDialogComponent } from './components/seleccion-alumnos-dialog/seleccion-alumnos-dialog.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { LoginComponent } from './components/login/login.component';
import { LogoutDialogComponent } from './components/logout-dialog/logout-dialog.component';
import { HomeComponent } from './components/home/home.component';
import { ReminderDialogComponent } from './components/reminder-dialog/reminder-dialog.component';
import { FormatDatePipe } from './pipes/format-date.pipe';
import { CreateAlumnComponent } from './components/create-alumn/create-alumn.component';
import { EnvioComprobanteComponent } from './components/envio-comprobante/envio-comprobante.component';
import { MainContainerComponent } from './components/layout/main-container/main-container.component';
import { PaymentHistoryComponent } from './components/payment-history/payment-history.component';
import { CierreDeCajaComponent } from './components/cierre-de-caja/cierre-de-caja.component';
import { BajasComponent } from './components/bajas/bajas.component';
import { ConfirmBajaDialogComponent } from './components/confirm-baja-dialog/confirm-baja-dialog.component';
import { EnvioEmailDialogComponent } from './components/envio-email-dialog/envio-email-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    ListAlumnosComponent,
    NavbarComponent,
    ConfirmDialogComponent,
    EnvioEmailComponent,
    SeleccionAlumnosDialogComponent,
    LoginComponent,
    LogoutDialogComponent,
    HomeComponent,
    ReminderDialogComponent,
    FormatDatePipe,
    CreateAlumnComponent,
    EnvioComprobanteComponent,
    MainContainerComponent,
    PaymentHistoryComponent,
    CierreDeCajaComponent,
    BajasComponent,
    ConfirmBajaDialogComponent,
    EnvioEmailDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatPaginatorModule,
    MatDialogModule,
    HttpClientModule,
    MatCheckboxModule,
    MatSelectModule,
    MatTooltipModule,
    MatButtonModule,
    MatTabsModule,
    MatIconModule,
    MatMenuModule,
    FormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
