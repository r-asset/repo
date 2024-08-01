import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FooterService {

  constructor(private http: HttpClient, private Cookie: CookieService) {  }

  WeatherGetData():Observable <any>{
    let location = '12.86035106717085, 80.07129636103556'
    // return this.http.get(`https://api.tomorrow.io/v4/weather/realtime?location=${location}&apikey=DostQ3pQjgYql36YMPnSehCjg7hzuc6v`)
    let lat = '12.86028'
    let lon = '80.07130'
    // return this.http.get('http://localhost:3000/weather')
    return this.http.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=f0095379d48947ed541c34830c33204e&units=metric`)
  }
}
