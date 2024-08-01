import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DashboardService } from './service/dashboard.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

load: boolean = true
cards: any;
bcnDetails: any;
date=new Date()
pipe= new DatePipe("en-US")

constructor(private service:DashboardService)
  {
    let today = new Date();
    today.setDate(today.getDate());

    let CurrDate = {"date": this.pipe.transform(today,"YYYY-MM-dd") }
    this.service.postData('overview/dashboard',CurrDate).subscribe(res =>{
      this.cards = res.Cards
    });

    this.service.postdata('overview/assets_count').subscribe(res =>{
      this.bcnDetails = res

    })

  }

ngOnInIt(){
  window.scroll(0,0);


}

}
