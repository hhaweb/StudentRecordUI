import { environment } from 'src/environments/environment';

const controllerName = 'student';
const baseUrl: string = environment.API_BASE + '/' + controllerName + '/';
export const StudentUrls = {
    SaveStudent: baseUrl + 'save-student',
    GetStudentList: baseUrl+ 'get-student-list',
    GetStudentById: baseUrl + 'get-student-by-id',
    ExportStudentList: baseUrl + 'export-student-list'
}