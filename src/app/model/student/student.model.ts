export class StudentInput {
    public name: string;
    public email: string;
    public mobileNo: string;
    public gender: string;
    public avatar: string;
    public cid: number;
    public dateOfBirth: Date;
    public batchNo: string;
    public bloodGroup: string;
    public did: string;
    public maritalStatus: string;
    public trainingYear: string;

}

export class StudentOutput {
    public name: string;
    public email: string;
    public mobileNo: string;
    public gender: string;
    public cid: string;
    public did: string;
    public dateOfBirth: Date;


}

export class StudentFilter {
    public rowOffset: number;
    public rowsPerPage: number;
    public sortName: string;
    public sortType: number;
}

export class StudentDetails{
    public studentId: number;
    public name: string;
    public cid: string;
    public courseName: string;
    public courseStatus: string;
    public courseLeve: string;
    public sector: string;
    public duration: string;
    public startDate: string;
    public endDate: string;
}