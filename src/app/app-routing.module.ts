import { StudentListComponent } from './view/student-list/student-list.component';
import { RoutesModel } from 'src/app/model/config-model/route-model';
import { UploadComponent } from './view/upload/upload.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './view/home/home.component';
import { LoginComponent } from './share/login/login.component';
import { StudentProfileComponent } from './view/student-profile/student-profile.component';
import {StudentDetailsComponent} from "./view/student-details/student-details.component";

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
    component: StudentListComponent
  },
  {
    path: RoutesModel.Upload,
    component: UploadComponent
  },
  {
    path: RoutesModel.StudentProfile,
    component: StudentProfileComponent
  },
  {
    path: RoutesModel.StudentDetails,
    component: StudentDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
