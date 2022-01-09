import { environment } from 'src/environments/environment';

const controllerName = 'common';
const baseUrl: string = environment.API_BASE + '/' + controllerName + '/';
export const CommonUrls = {
    SaveDropDown: baseUrl + 'save-dropdown-item',
    DeleteDropDown: baseUrl + 'delete-dropdown-item',
    GetDropDownItem: baseUrl + 'get-dropdown-item',
    GetDropDownName: baseUrl + 'get-dropdown-name',
    DownloadSimpleUpload: baseUrl + 'download-upload-simple'


}