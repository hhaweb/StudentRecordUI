export class StudentInput {
    public name: string;
    public email: string;
    public mobileNo: string;
    public gender: string;
    public avatar: string;
    public cid: number;


}

export class StudentOutput {
    public name: string;
    public email: string;
    public mobileNo: string;
    public gender: string;
    public cid: string;
    public did: string;
    public dateOfBith: string;


}

export class StudentFilter {
    public rowOffset: number;
    public rowsPerPage: number;
    public sortName: string;
    public sortType: number;
}