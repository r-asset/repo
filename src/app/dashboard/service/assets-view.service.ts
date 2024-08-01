import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssetsViewService {

  constructor(private http: HttpClient) { }

  private selectedSiteSource = new BehaviorSubject<string>('');
  selectedSite = this.selectedSiteSource.asObservable();
  
  url = 'http://localhost:3000/SiteAreaZoneData'
  Statusurl = 'http://localhost:3000/StatusChart'


getStatus():Observable <any> {
  // return this.http.get(this.Statusurl)  
  return of( 
    {
  "StatusChart":[
    {
        "StatusName":"InProdcution",
        "Count": 90
    },
    {
        "StatusName":"Dispatched",
        "Count": 45
    },
    {
        "StatusName":"Maintenance",
        "Count":3
    }
]
    })
}

getData():Observable <any> {
  return this.http.get(this.url)
}



}
