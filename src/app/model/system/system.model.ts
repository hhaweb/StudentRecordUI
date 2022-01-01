
import { MenuItem } from 'primeng/api';

export class Menu {
    public label: string;
    public icon: string;
    public routerLink: string[];
    public items: MenuItem[]; 
    public rightMenus: Menu[]; 
}

export class ConfigData {
    public menus: Menu[];
    public routeList: string[];
    public role: string;
    public userId: number;
    public studentId: number;
    public userName: string;
}