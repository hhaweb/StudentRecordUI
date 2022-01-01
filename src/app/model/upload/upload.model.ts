export class UploadResult {
    public id: number;
    public uploadType: string;
    public totalCount: number;
    public successCount: number;
    public failCount: number;
}

export class UploadHistory {
    public id: number;
    public uploadType: string;
    public fileName: string;
    public errorFileName: string;
    public totalRecord: number;
    public successRecord: number;
    public failRecord: number;
    public uploadDate: Date;
    public uploadBy: string;
}