
import { Component } from '@angular/core';
import Chart from 'chart.js/auto';
import { DashboardService } from '../service/dashboard.service';

@Component({
  selector: 'app-cust-details',
  templateUrl: './cust-details.component.html',
  styleUrls: ['./cust-details.component.css']
})

export class CustDetailsComponent {
  public chart: any;
  vendor: any;


  constructor(private service:DashboardService)
  {
    this.chart = new Chart("MyChart", {
      type: 'doughnut',
      data: {
         datasets: [{
          label: '',
          data: [],
          backgroundColor: [
            '#FDC6C6',
            '#FD6363',
            '#FDD7C6',
          ],
        hoverOffset: 1,
        borderRadius: 10
      }],
      labels: [],

      },

      options: {
        aspectRatio:0.5,
        responsive: true,
        animation: {
          animateScale : true
        },
        plugins: {
          legend: {
            position: 'bottom',
            align:'start',
            display: true,
          labels: {

            boxWidth: 12,
            padding: 5

          },
        }
      }
      }


    });
  }

  ngOnInit(): void {
    this.createChart();
  }

    createChart(){

      this.service.postdata('overview/vendordetails').subscribe(res =>{
        this.vendor = res



      let series = [];
      let catagories = [];
      for (let i of this.vendor) {
          series.push(i.category_count);
          catagories.push(i.vendor_name );
      }
      console.log(series)

      const backgroundColors = [
        '#FDC6C6',
        '#FD6363',
        '#FDD7C6',

      ];


    this.chart = new Chart("MyChart", {
      type: 'doughnut',
      data: {
         datasets: [{
          label: '',
          data: series,
          backgroundColor: backgroundColors,
          hoverOffset: 2,
          borderRadius: 10
        }],
      labels: catagories,

      },

      options: {
        aspectRatio:0.5,
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            align:'start',
            display: true,
            labels: {

            boxWidth: 12, // Adjust width of colored box
            padding: 5, // Adjust padding around each legend item
          }

          },
          title: {
              display: true,
          }
      }
      }


    });
  });
  }


}
