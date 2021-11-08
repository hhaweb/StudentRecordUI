
import { MenuItem } from 'primeng/api';

export class Menu {
    public label: string;
    public icon: string;
    public routerLink: string[];
    public items: MenuItem[];  
}

export class ConfigData {
    public menuList: Menu[];
}