import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  // url='http://127.0.0.1:8000/'
  
  url='http://172.29.29.181:8077/'

  getData(endpoint: any, CurrDate: { date: string | null; }):Observable <any> {
    let params = new HttpParams().set('plantname', 'MATE U3');
    let headers = new HttpHeaders().set('Authorization', 'auth-token');
    return this.http.get(this.url+endpoint+'/',{params,headers})
  }

  postData(endpoint:string, Data:any):Observable <any>  {
    let params = new HttpParams().set('plantname', 'MATE U3');
    let headers = new HttpHeaders().set('Authorization', 'auth-token');
    return this.http.post(this.url + endpoint + '/', Data, {params,headers})
  }

  postdata(endpoint:string):Observable <any>  {
    let params = new HttpParams().set('plantname', 'MATE U3');
    let headers = new HttpHeaders().set('Authorization', 'auth-token');
    return this.http.post(this.url + endpoint + '/', {params,headers})
  }

  putData(endpoint:string, Data:any){
    let params = new HttpParams().set('plantname', 'MATE U3');
    let headers = new HttpHeaders().set('Authorization', 'auth-token');
    return this.http.put(this.url + endpoint + '/', Data,{params,headers})
  }

  deleteData(endpoint:string, code:any){
    let params = new HttpParams().set('plantname', 'MATE U3');
    const body = JSON.stringify({code: code});
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const options = ({
      headers : headers,
      body : body,
      params
    });
    // console.log(options);
    return this.http.delete(this.url + endpoint + '/',options)
  }
  GET(){
    return of(
      [
        {
            "date": "Mon",
            "inwards": 10,
            "outwards": 20
        },
        {
            "date": "Tue",
            "inwards": 30,
            "outwards": 80
        },
        {
            "date": "Wed",
            "inwards": 100,
            "outwards": 20
        },
        {
            "date": "Thu",
            "inwards": 10,
            "outwards": 50
        },
        {
            "date": "Fri",
            "inwards": 80,
            "outwards": 10
        },
        {
            "date": "Sat",
            "inwards": 0,
            "outwards": 10
        },
        {
            "date": "Sun",
            "inwards": 50,
            "outwards": 0
        }
    ]
    )}
  getdata(endpoint:any): Observable<any> {
    return of( 
      {
    "Cards":[
        {
          "Total_Assets":1000,
         "In_Assets":500,
        "Out_Assets":200,
        "Maintenance_Assets":50,
        "Lost_Assets":50,
        "Cur_In_Assets":120, "currInDate":"10:21AM",
        "Cur_Out_Assets":80, "currOutDate":"10:21AM"
      }
    ],
    // "Vendor_Details":[{"HMIL": 100},{"RNAIPL": 100},{"MOBIS": 100},{"GLOVIS": 100}],
   vendordetails : [
    [
      {
          "vendor_name": "DIAMLER",
          "category_count": 551
      },
      {
          "vendor_name": "HUNDAI",
          "category_count": 1023
      },
      {
          "nofzones": 2,
          "nofitems": 1574,
          "nofareas": 1,
          "nofsites": 1
      }
  ]
  
      
  
 ],
    // "Category_Details":[
    //     {"Ai3 Transverse":100},{"Ai3 Center Plr Lower":200},{"Su2i Cluster Fascia":100},{"Stanchion Roof Rack":150},
    //     {"Panel Under Cover":50},{"Wheel Guard LH/RH":150},{"RR Bumper":150},{"Qxi IP Assy":200}
    // ],
    "Category_Details" :[ 
                          ['Ai3 Transverse', 16],
                          ['Ai3 Center Plr Lower', 12],
                          ['Su2i Cluster Fascia', 8],
                          ['Stanchion Roof Rack', 8],
                          ['Panel Under Cover', 8],
                          ['truck', 6],
                          ['DICV TOP PANEL', 7],
                          ['DICV CCB  Trolley', 4],
                          ['DICV MDT IP PANEL', 3],
                          ['HMIL - AI3 PANEL SIDE COVER', 6],
                          ['DICV HDT ROOF TRIM KIT', 10],
                          ['HMIL - AI3 RR BUMBER', 8],
                          ['HMIL - AI3 RR BUMBER', 6],
                          ['Ai3 Transverse', 16],
                          ['Ai3 Center Plr Lower', 12],
                          ['Su2i Cluster Fascia', 8],
                          ['Stanchion Roof Rack', 8],
                          ['Panel Under Cover', 8],
                          ['truck', 6],
                          ['DICV TOP PANEL', 7],
                          ['DICV CCB  Trolley', 4],
                          ['DICV MDT IP PANEL', 3],
                          ['HMIL - AI3 PANEL SIDE COVER', 6],
                          ['DICV HDT ROOF TRIM KIT', 10],
                          ['HMIL - AI3 RR BUMBER', 8],
                          ['HMIL - AI3 RR BUMBER', 6],
                          
                          // {
                          // "category_name":["Ai3 Transverse", "Ai3 Center Plr Lower", "Su2i Cluster Fascia", "Stanchion Roof Rack", "Panel Under Cover","truck", "DICV TOP PANEL","DICV CCB  Trolley ","DICV MDT IP PANEL","HMIL - AI3 PANEL SIDE COVER", "DICV HDT ROOF TRIM KIT ", "HMIL - AI3 RR BUMBER","HMIL - AI3 RR BUMBER"],
                          // "category_data":[44, 55, 13, 43, 22,42,82,12,15,42,35,24,92]
                          // }
                        ],
    "Zone Details":[{"MATE IN": 150}, {"MATE OUT": 250}, {"MATE Storage Area": 600}],
    "Recent_Transaction":[
        {"ItemName":"Ctr Plr 25", "Category":"Ai3 Center Plr Lower", "Status":"Working Active","Location":"MATE IN ", "LastSeen":"07-07-2023 00:50"}, 
        {"ItemName":"Ctr Plr 26", "Category":"Ai3 Center Plr Lower", "Status":"Working Active","Location":"MATE IN", "LastSeen":"07-07-2023 00:51"},
        {"ItemName":"Ctr Plr 27", "Category":"Ai3 Center Plr Lower", "Status":"Working Active","Location":"MATE IN", "LastSeen":"07-07-2023 00:50"},
        {"ItemName":"Ctr Plr 28", "Category":"Ai3 Center Plr Lower", "Status":"Working Active","Location":"MATE IN", "LastSeen":"07-07-2023 00:50"},
        {"ItemName":"Ctr Plr 29", "Category":"Ai3 Center Plr Lower", "Status":"Working Active","Location":"MATE IN", "LastSeen":"07-07-2023 00:52"},
        {"ItemName":"Ctr Plr 30", "Category":"Ai3 Center Plr Lower", "Status":"Working Active","Location":"MATE IN", "LastSeen":"07-07-2023 00:51"},
        {"ItemName":"Ctr Plr 31", "Category":"Ai3 Center Plr Lower", "Status":"Working Active","Location":"MATE IN", "LastSeen":"07-07-2023 00:51"},
        {"ItemName":"Panel Under Cover 02", "Category":"Panel Under Cover", "Status":"Working Active","Location":"MATE OUT", "LastSeen":"07-07-2023 02:15"}, 
        {"ItemName":"Panel Under Cover 03", "Category":"Panel Under Cover", "Status":"Working Active","Location":"MATE OUT", "LastSeen":"07-07-2023 02:51"},
        {"ItemName":"Panel Under Cover 04", "Category":"Panel Under Cover", "Status":"Working Active","Location":"MATE OUT", "LastSeen":"07-07-2023 02:50"},
        {"ItemName":"Panel Under Cover 05", "Category":"Panel Under Cover", "Status":"Working Active","Location":"MATE OUT", "LastSeen":"07-07-2023 02:50"},
        {"ItemName":"Panel Under Cover 06", "Category":"Panel Under Cover", "Status":"Working Active","Location":"MATE OUT", "LastSeen":"07-07-2023 02:52"},
        {"ItemName":"Panel Under Cover 08", "Category":"Panel Under Cover", "Status":"Working Active","Location":"MATE OUT", "LastSeen":"07-07-2023 02:51"},
        {"ItemName":"Panel Under Cover 12", "Category":"Panel Under Cover", "Status":"Working Active","Location":"MATE OUT", "LastSeen":"07-07-2023 02:51"}
    ],
    "Category_Table":[
        {"CategoryName":"Ai3 Center Plr Lower", "Total":200, "IN":124,  "OUT":76},
        {"CategoryName":"Ai3 Transverse",       "Total":100, "IN":54,   "OUT":46},
        {"CategoryName":"Su2i Cluster Fascia",  "Total":100, "IN":78,   "OUT":22},
        {"CategoryName":"Stanchion Roof Rack",  "Total":150, "IN":100,  "OUT":50},
        {"CategoryName":"Qxi IP Assy",          "Total":200, "IN":89,   "OUT":111},
        {"CategoryName":"RR Bumper",            "Total":150, "IN":24,   "OUT":126},
        {"CategoryName":"Wheel Guard LH/RH",    "Total":150, "IN":125,  "OUT":25},
        {"CategoryName":"Panel Under Cover",    "Total":50,  "IN":35,   "OUT":15}
    ]
}
    )
  }
}
