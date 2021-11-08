import { BroadcasterService } from 'src/app/service/utility/broadcaster.service';
import { AuthorizationService } from './service/utility/authorization.service';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MenubarModule} from 'primeng/menubar';
import {MenuItem, MessageService} from 'primeng/api';
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

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HomeComponent,
    LoginComponent,
    UploadComponent,
    StudentListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MenubarModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    HttpClientModule,
    FormsModule,
    PasswordModule
  ],
  providers: [
    MessageService,
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
