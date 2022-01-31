import { RoutesModel } from 'src/app/model/config-model/route-model';
import { Router, RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import {MenubarModule} from 'primeng/menubar';
import {MenuItem} from 'primeng/api';
import { ConfigData } from './model/system/system.model';
import { FullScreenService } from './share/event/full-screen.service';
import { AuthenticationService } from './service/utility/authentication.service';
import { ConfigDataLoadedEvent } from './share/event/config-data-loaded.event';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent   {
  title = 'StudentRecUI';
  configData: ConfigData;
  showFullScreen: boolean;
  
  constructor(
    private router: Router,
    private fullScreenService: FullScreenService,
    private authenticationService: AuthenticationService,
    private configDataLoadedEvent: ConfigDataLoadedEvent  ) {
    this.fullScreenService.on().subscribe(() => {
      this.showFullScreen = true;
      //console.log(' this.showFullScreen ' ,  this.showFullScreen );
    });
  }

  ngOnInit() {
    if(this.authenticationService.isAuthorized()) {
      this.loadApplicationData();
    } else {
      void this.router.navigate([RoutesModel.Login]);
    }
  }

  loadApplicationData() {
    this.authenticationService.getSystemConfig().subscribe(
      (response: ConfigData) => {
        this.configData = response;
        this.configDataLoadedEvent.fire(this.configData);
     //   this.cookieService.set('routePermissions',JSON.stringify(this.configData.routeList));
      },
      (error: any) => {

      }
    );
  
  }

  changeOfRoutes() {
    this.showFullScreen = false;
    if(!this.authenticationService.isAuthorized()) {
      void this.router.navigate([RoutesModel.Login]);
    }
  }

  
}
