 
export interface CategoryType {
    id:string;
    title:string;
    icon:string;
    inline?:boolean;
    isBack?:boolean;
}

export interface JobTyps {
    title?:string;
    position?:string;
    jobId?:number;
    positionNumber?:number;
    band?:string;
    bu?:string;
    jobScope?:string;
    qualification?:string;
    workLocation?:string;
    category?:string;
    isVertical?:boolean;
    statusText?:string;
    startDate?:string;
    endDate?:string;
    statusActive?:string;
    onClickEditJob?:(value:any)=>void;
}