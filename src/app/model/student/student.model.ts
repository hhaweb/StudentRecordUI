import { Employment } from "./employment.model";
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
    public avatar: string;
    public bloodGroup: string
    public dateOfBirth: string;
    public trainingYear: number;
    public batchNo: number;
    public maritalStatus: string;
    public userId: number;
    public inDate: Date;
    public employmentTypeId: number;
    public trainingCenterId: number
    public totalRecord: number;

    public createdDate: string;
	public updatedDate: string;
	public deletedDate: string;
    public employment: Employment;
    public courseList: Course[];
    public base64Image: string;
    constructor() {
        this.courseList = [];
        //this.employment = new Employment();
    }
}
