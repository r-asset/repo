import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { urlComponent } from '../url';


@Injectable({
  providedIn: 'root'
})
export class LoginserviseService {

  constructor(private http: HttpClient) { }

  url = new urlComponent().url
     

  getData(UserData:any):Observable <any>{
    const Headers = {'content-type': 'application/json'}
    const body = JSON.stringify(UserData)
    return this.http.post(this.url+'loginvalidation'+'/',body,{'headers':Headers})
  }


}
