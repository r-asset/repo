import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {

  constructor(private http: HttpClient, private Cookie: CookieService) { }

  url='http://127.0.0.1:8000/'
  
  getData(endpoint:string):Observable <any> {
    let params = new HttpParams().set('plantname', 'MATE U3');
    let headers = new HttpHeaders().set('Authorization', 'auth-token');
    return this.http.get(this.url+endpoint+'/',{params,headers})
  }

  postData(endpoint:string, Data:any) {
    let params = new HttpParams().set('plantname', 'MATE U3');
    let headers = new HttpHeaders().set('Authorization', 'auth-token');
    return this.http.post(this.url + endpoint + '/', Data, {params,headers})
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
}
