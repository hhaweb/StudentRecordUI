import { environment } from 'src/environments/environment';

const controllerName = 'upload';
const baseUrl: string = environment.API_BASE + '/' + controllerName + '/';
export const UploadUrls = {
    UploadData: baseUrl + 'upload-data',
    DownloadUploadFile: baseUrl + 'download-uploadFile',
    GetUploadHistory: baseUrl + 'get-upload-history',
}