import { BroadcasterService } from 'src/app/service/utility/broadcaster.service';
import { AuthorizationService } from './service/utility/authorization.service';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MenubarModule} from 'primeng/menubar';
import {ConfirmationService, MessageService} from 'primeng/api';
import { MenuComponent } from './share/menu/menu.component';
import { HomeComponent } from './view/home/home.component';
import { LoginComponent } from './share/login/login.component';
import {CardModule} from 'primeng/card';
import {InputTextModule} from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import {PasswordModule} from 'primeng/password';
import { UtilityService } from './service/utility/utility.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpsAuthRequestInterceptor } from './service/utility/auth.interceptor';
import { GolbalErrorHandlerService } from './service/utility/golbal-error-handler.service';
import { AuthenticationService } from './service/utility/authentication.service';
import { ConfigDataLoadedEvent } from './share/event/config-data-loaded.event';
import { UploadComponent } from './view/upload/upload.component';
import { FullScreenService } from './share/event/full-screen.service';
import { StudentListComponent } from './view/student-list/student-list.component';
import {ButtonModule} from 'primeng/button';
import {FileUploadModule} from 'primeng/fileupload';
import { LoadingComponent } from './share/loading/loading.component';
import { ToastComponent } from './share/toast/toast.component';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {DialogModule} from 'primeng/dialog';
import {ToastModule} from 'primeng/toast';
import { StudentProfileComponent } from './view/student-profile/student-profile.component';
import {DropdownModule} from 'primeng/dropdown';
import {RadioButtonModule} from 'primeng/radiobutton';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HomeComponent,
    LoginComponent,
    UploadComponent,
    StudentListComponent,
    StudentProfileComponent,
    LoadingComponent,
    ToastComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MenubarModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    HttpClientModule,
    ToastModule,
    DialogModule,
    FormsModule,
    PasswordModule,
    CardModule,
    FileUploadModule,
    ConfirmDialogModule,
    DropdownModule,
    RadioButtonModule
  ],
  providers: [
    MessageService,
    ConfirmationService,
    UtilityService,
    BroadcasterService, 
    AuthorizationService,
    AuthenticationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpsAuthRequestInterceptor,
      multi: true,
    },
    { provide: ErrorHandler, useClass: GolbalErrorHandlerService },
    ConfigDataLoadedEvent,
    FullScreenService

  ],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
