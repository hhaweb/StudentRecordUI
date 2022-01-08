import { environment } from 'src/environments/environment';

const controllerName = 'course';
const baseUrl: string = environment.API_BASE + '/' + controllerName + '/';
export const CourseUrls = {
    SaveCourse: baseUrl + 'save-course',
    GetCourseList: baseUrl + 'get-course-list',
    GetCourseById: baseUrl + 'get-course-by-id',
    GetTrainerList: baseUrl +'get-trainer-list',
    GetTrainerById: baseUrl + 'get-trainer-by-id',
    SaveTrainer: baseUrl + 'save-trainer',
    DeleteTrainer: baseUrl + 'delete-trainer',
    GetCoursesByCid: baseUrl + 'get-courses-by-cid',
    GetRecommendCourse: baseUrl + 'get-recommend-courses',
    ExportCourseDetail: baseUrl + 'export-course-detail',
    ExportCourseList: baseUrl + 'export-course-list',
    ExportTrainerList: baseUrl + 'export-trainer-list',
    GetTrainerItem: baseUrl + 'get-trainer-item'
}
