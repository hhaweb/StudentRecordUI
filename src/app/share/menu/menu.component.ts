import { AuthenticationService } from 'src/app/service/utility/authentication.service';
import { MenuItem } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { ConfigDataLoadedEvent } from '../event/config-data-loaded.event';
import { ConfigData } from 'src/app/model/system/system.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  items: MenuItem[] = [];
  rightMenuItem: MenuItem[] = [];
  constructor( 
    public app: AppComponent,
    private configDataLoadedEvent: ConfigDataLoadedEvent,
    private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.rightMenuItem = [
      {
        items: [{
            label: 'Profile',
            icon: 'pi pi-user',
            url: 'http://angular.io'
        },
        {
            label: 'Logout',
            icon: 'pi pi-times',
            command: () => {
              this.logout();
          }
        }
    ]}
    ]
    const that = this;
    this.configDataLoadedEvent.on().subscribe((data: ConfigData) => {
      that.items = data.menus;
      console.log('enter menu',  that.items);
    });
  }

  logout() {
    this.authenticationService.logout();
  }

}
