import { environment } from 'src/environments/environment';

const controllerName = 'student';
const baseUrl: string = environment.API_BASE + '/' + controllerName + '/';
export const StudentUrls = {
    CreateNewStudent: baseUrl + 'add-student',
    GetStudentLists: baseUrl+ 'student-lists'
}