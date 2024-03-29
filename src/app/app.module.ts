import { CommonService } from './service/controller-service/common.service';
import { CourseService } from './service/controller-service/course.service';
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
import { StudentListComponent } from './view/student/student-list/student-list.component';
import {ButtonModule} from 'primeng/button';
import {FileUploadModule} from 'primeng/fileupload';
import { LoadingComponent } from './share/loading/loading.component';
import { ToastComponent } from './share/toast/toast.component';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {DialogModule} from 'primeng/dialog';
import {ToastModule} from 'primeng/toast';
import { StudentProfileComponent } from './view/student/student-profile/student-profile.component';
import {DropdownModule} from 'primeng/dropdown';
import {RadioButtonModule} from 'primeng/radiobutton';
import {TableModule} from 'primeng/table';
import {CalendarModule} from 'primeng/calendar';

import { MessagesModule } from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MenuModule} from 'primeng/menu';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import {faUserCircle}  from '@fortawesome/free-solid-svg-icons';
import {AvatarModule} from 'primeng/avatar';
import { UploadHistoryComponent } from './view/upload/upload-history.component';
import { StudentDetailsComponent } from './view/student/student-details/student-details.component';
import { CourseInfoComponent } from './view/course/course-info/course-info.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { StudentService } from './service/controller-service/student.service';
import { TrainerListComponent } from './view/trainer/trainer-list/trainer-list.component';
import { TrainerDetailComponent } from './view/trainer/trainer-detail/trainer-detail.component';
import { UserListComponent } from './view/user/user-list/user-list.component';
import { UserDetailComponent } from './view/user/user-detail/user-detail.component';
import { CanActivateRoute } from './service/utility/can-activate-route.service';
import { CookieService } from 'ngx-cookie-service';
import { CourseListComponent } from './view/course/course-list/course-list.component';
import {InputTextareaModule} from 'primeng/inputtextarea';
import { DropdwonSetupComponent } from './view/dropdown/dropdwon-setup.component';
import { DropdwonListComponent } from './view/dropdown/dropdwon-list.component';
import {AvatarGroupModule} from 'primeng/avatargroup';
import {PanelModule} from 'primeng/panel';
import { StudentDialogComponent } from './view/student/student-dialog/student-dialog.component';
import { ChipModule } from 'primeng/chip';
import {CheckboxModule} from 'primeng/checkbox';
import { PasswordChangeComponent } from './share/password-change/password-change.component';
import {BadgeModule} from 'primeng/badge';


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
    ToastComponent,
    UploadHistoryComponent,
    StudentDetailsComponent,
    CourseInfoComponent,
    TrainerListComponent,
    TrainerDetailComponent,
    UserListComponent,
    UserDetailComponent,
    CourseListComponent,
    DropdwonSetupComponent,
    DropdwonListComponent,
    StudentDialogComponent,
    PasswordChangeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
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
    CheckboxModule,
    DropdownModule,
    RadioButtonModule,
    InputNumberModule,
    BadgeModule,
    MessagesModule,
    MessageModule,
    MenuModule,
    FontAwesomeModule,
    TableModule,
    CalendarModule,
    AvatarModule,
    InputTextareaModule,
    AvatarGroupModule,
    PanelModule,
    ChipModule
  ],
  providers: [
    MessageService,
    ConfirmationService,
    UtilityService,
    BroadcasterService, 
    AuthorizationService,
    AuthenticationService,
    CommonService,
    CourseService,
    StudentService,
    CanActivateRoute,
    CookieService,
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
export class AppModule { 
  constructor(library: FaIconLibrary) {
    this.buildFontAwesomeLibrary(library);
  }
  buildFontAwesomeLibrary(library: FaIconLibrary) {
    library.addIcons(faUserCircle);
  }
}
