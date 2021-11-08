import { Menu } from "../system/system.model";


export class CurrentUser {
    public userId: string;
    public userName: string;
    public email: string;
    public roleList: Roles[];
}

export class Roles{
    public roleName: string;

    constructor(roleName: string) {
        this.roleName = roleName;
    }
}

export class TokenResponse {
    public token: string;
    public userId: string;
    public userName: string;
    public email: string;
    public menuList: Menu[];
    public roles: string[];
}



