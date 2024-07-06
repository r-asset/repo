import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ElementRef, Injectable, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemManagementService {
    
url='http://172.29.29.181:8077/'




  constructor(private http: HttpClient, private Cookie: CookieService) { }
  

  getData(endpoint:string):Observable <any> {
    // let params = new HttpParams().set('plantname', 'MATE U3');
    // let headers = new HttpHeaders().set('Authorization', 'auth-token');
    // return this.http.get('assets/item-data.json')
    let params = new HttpParams().set('plantname', this.Cookie.get('plantname'));
    return this.http.get(this.url + endpoint + '/', {params})
  }

  postData(endpoint:string, Data:any) {
    // let params = new HttpParams().set('plantname', 'MATE U3');
    // let headers = new HttpHeaders().set('Authorization', 'auth-token');
    // return this.http.post(this.url + endpoint + '/', Data, {params,headers})
    let params = new HttpParams().set('plantname', 'MATE U3');
    let headers = new HttpHeaders().set('Authorization', 'auth-token');
    const postUrl = this.url + endpoint + '/';
    return this.http.post(postUrl, Data,{params,headers});
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
  
  uploadImage(file: File){
    let formParams = new FormData();
     formParams.append('file', file)
     return this.http.post(this.url + 'item/data'+ '/', formParams)
    }
}
