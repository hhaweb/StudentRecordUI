import { environment } from 'src/environments/environment';

const controllerName = 'upload';
const baseUrl: string = environment.API_BASE + '/' + controllerName + '/';
export const UploadUrls = {
    UploadStudent: baseUrl + 'upload-student',
    DownloadStudentErrorFile: baseUrl + 'download-student-error'
}