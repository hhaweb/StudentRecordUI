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
  constructor( 
    public app: AppComponent,
    private configDataLoadedEvent: ConfigDataLoadedEvent) { }

  ngOnInit(): void {
    const that = this;
    this.configDataLoadedEvent.on().subscribe((data: ConfigData) => {
      that.items = data.menuList;
    });


  //   this.items = [
  //     {
  //         label: 'File',
  //         routerLink: '/home'
  //     },
  //     {
  //         label: 'Edit',
  //         icon: 'pi pi-fw pi-pencil',
  //         items: [
  //             {label: 'Delete', icon: 'pi pi-fw pi-trash'},
  //             {label: 'Refresh', icon: 'pi pi-fw pi-refresh', routerLink: '/home'}
  //         ]
  //     }
  // ];
  }

}
