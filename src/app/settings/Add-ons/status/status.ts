export interface Status {
    st_id:number;
        st_code: number,
        st_name: string,
        st_companyid: {
            pmid: string;
            pmcode: string;
            pmcompanyname: string;
            pmmaxsites:number;
            pmmaxarea:number;
            pmmaxzone:number;
            pmmaxgateway: number;
            pmmaxbeacons:number;
            pmmaxusers: number;
        },
        st_active: boolean;
        st_createdon:any;
        st_createdby: string;
        st_modifiedon: any;
        st_modifiedby: string;
}
