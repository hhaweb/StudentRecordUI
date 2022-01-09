import { LoadingBarModel } from './../config-model/loading-bar-model';
export class SearchModel {
    public rowOffset: number;
    public rowsPerPage: number;
    public sortName: string;
    public sortType: number;
    public searchKeyword: string;
}

export class RouteModel {
    public id: number;
    public type: string;
}

export class DropDownItem {
    public id: number;
    public label: string;
    public value: string;
    public name: string;
    constructor(name: string) {
        this.name = name;
    }
}