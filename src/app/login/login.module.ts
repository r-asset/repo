import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [
    LoginComponent,
  ],
  providers: [MessageService],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ToastModule,
    ReactiveFormsModule,
    FontAwesomeModule,
  ],
  exports:[LoginComponent]
})
export class LoginModule { }
