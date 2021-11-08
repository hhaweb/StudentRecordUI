import { environment } from 'src/environments/environment';

const controllerName = 'auth';
const baseUrl: string = environment.API_BASE + '/' + controllerName + '/';
export const AuthUrls = {
    Login: baseUrl + 'login',
    SaveUser: baseUrl + 'save-user',
    GetCurrentUser: baseUrl + 'get-current-user',
    LogOut: baseUrl + 'logout'
}