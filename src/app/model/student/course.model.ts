import { Student } from "./student.model";

export class Course {
    public id: number;

	public courseId: string;
	public courseName: string;
	public status: string;
	public sector: string;
	public courseLevel: string;
	public duration: string;
	public startDate: string;
	public endDate: string;
	public batchNo: string;
	public trainingLoaction: string;
	public trainerNationality: string;
	public trainerAffiliation: string;
	public trainerId: string;
	public cId: string;
	public dId: string;

	public cohortSizeMale: number;
	public cohortSizeFemale: number;
	public numberOfApplicantsMale: number;
	public numberOfApplicantsFemale: number;
	public numberOfCertifiedMale: number;
	public numberOfCertifiedFemale: number;

	public totalRecords: number;

}
