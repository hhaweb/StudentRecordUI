import { UploadHistoryComponent } from './view/upload/upload-history.component';
import { StudentListComponent } from './view/student-list/student-list.component';
import { RoutesModel } from 'src/app/model/config-model/route-model';
import { UploadComponent } from './view/upload/upload.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './view/home/home.component';
import { LoginComponent } from './share/login/login.component';
import { StudentProfileComponent } from './view/student-profile/student-profile.component';

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
    path: RoutesModel.UploadHistory,
    component: UploadHistoryComponent
  },
  {
    path: RoutesModel.StudentProfile,
    component: StudentProfileComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
