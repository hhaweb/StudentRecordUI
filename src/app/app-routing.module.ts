import { DropdwonSetupComponent } from './view/dropdown/dropdwon-setup.component';
import { RoutesModel } from './model/config-model/route-model';
import { UserListComponent } from './view/user/user-list/user-list.component';
import { TrainerDetailComponent } from './view/trainer/trainer-detail/trainer-detail.component';
import { TrainerListComponent } from './view/trainer/trainer-list/trainer-list.component';
import { Trainer } from './model/student/trainer.model';
import { UploadHistoryComponent } from './view/upload/upload-history.component';
import { StudentListComponent } from './view/student/student-list/student-list.component';
import { UploadComponent } from './view/upload/upload.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './view/home/home.component';
import { LoginComponent } from './share/login/login.component';
import { StudentProfileComponent } from './view/student/student-profile/student-profile.component';
import { StudentDetailsComponent } from "./view/student/student-details/student-details.component";
import { CourseInfoComponent } from './view/course/course-info/course-info.component';
import { UserDetailComponent } from './view/user/user-detail/user-detail.component';
import { CanActivateRoute } from './service/utility/can-activate-route.service';
import { CourseListComponent } from './view/course/course-list/course-list.component';

const routes: Routes = [
  { path: '', redirectTo: RoutesModel.Home, pathMatch: 'full' },
  {
    path: RoutesModel.Home,
    component: HomeComponent
  },
  {
    path: RoutesModel.Login,
    component: LoginComponent,
  },
  {
    path: RoutesModel.StudentList,
    component: StudentListComponent,
    canActivate: [CanActivateRoute],
    data: { newRoute: RoutesModel.StudentList }
  },
  {
    path: RoutesModel.Upload,
    component: UploadComponent,
    canActivate: [CanActivateRoute],
    data: { newRoute: RoutesModel.Upload }
  },
  {
    path: RoutesModel.UploadHistory,
    component: UploadHistoryComponent,
    canActivate: [CanActivateRoute],
    data: { newRoute: RoutesModel.UploadHistory }
  },
  {
    path: RoutesModel.StudentProfile,
    component: StudentProfileComponent
  },
  {
    path: RoutesModel.StudentDetails,
    component: StudentDetailsComponent
  },
  {
    path: RoutesModel.StudentDetails + '/:id/:type',
    component: StudentDetailsComponent
  },
  {
    path: RoutesModel.CourseInfo,
    component: CourseInfoComponent,
    canActivate: [CanActivateRoute],
    data: { newRoute: RoutesModel.CourseInfo }
  },
  {
    path: RoutesModel.CourseInfo + '/:id/:type',
    component: CourseInfoComponent,
    canActivate: [CanActivateRoute],
    data: { newRoute: RoutesModel.CourseInfo }
  }, 
  {
    path: RoutesModel.CourseList,
    component: CourseListComponent,
    canActivate: [CanActivateRoute],
    data: { newRoute: RoutesModel.CourseList }
  },
  {
    path: RoutesModel.TrainerList,
    component: TrainerListComponent,
    canActivate: [CanActivateRoute],
    data: { newRoute: RoutesModel.TrainerList }
  }, {
    path: RoutesModel.TrainerDetail,
    component: TrainerDetailComponent,
    canActivate: [CanActivateRoute],
    data: { newRoute: RoutesModel.TrainerDetail }
  },
  {
    path: RoutesModel.TrainerDetail + '/:id/:type',
    component: TrainerDetailComponent,
    canActivate: [CanActivateRoute],
    data: { newRoute: RoutesModel.TrainerDetail }
  },
  {
    path: RoutesModel.UserList,
    component: UserListComponent,
    canActivate: [CanActivateRoute],
    data: { newRoute: RoutesModel.UserList }
  },
  {
    path: RoutesModel.UserDetail,
    component: UserDetailComponent
  },
  {
    path: RoutesModel.UserDetail + '/:id',
    component: UserDetailComponent
  },
  {
    path: RoutesModel.DropDownSetup,
    component: DropdwonSetupComponent,
    canActivate: [CanActivateRoute],
    data: { newRoute: RoutesModel.DropDownSetup }

  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
