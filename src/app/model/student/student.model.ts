import { Course } from "./course.model";

export class Student {
    public id: number;
    public name: string;
    public status: string;
    public email: string;
    public mobileNo: string;
    public gender: string;
    public cid: string;
    public did: string;
    public bloodGroup: string
    public dateOfBirth: string;
    public trainingYear: number;
    public batchNo: number;
    public maritalStatus: string;
    public totalRecord: number;

    public createdDate: string;
	public updatedDate: string;
	public deletedDate: string;
    public courseList: Course[];
    constructor() {
        this.courseList = [];
    }
}
