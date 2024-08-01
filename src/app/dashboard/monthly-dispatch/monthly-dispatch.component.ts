import { Component, ViewChild } from "@angular/core";
import { DashboardService } from "../service/dashboard.service";
import * as Highcharts from 'highcharts';
import HC_3D from 'highcharts/highcharts-3d';
import HC_More from 'highcharts/highcharts-more';


@Component({
  selector: 'app-monthly-dispatch',
  templateUrl: './monthly-dispatch.component.html',
  styleUrls: ['./monthly-dispatch.component.css']
})


export class MonthlyDispatchComponent {
  
  Highcharts: typeof Highcharts = Highcharts;
  Options: any;
  weekData: any;

  rangeDates!: Date[];
  weeks: any[] = [];

  selectedWeek: any;


  constructor(private service:DashboardService) {
    this.Options = {
      chart: {
        type: 'column',
        width:340,
        height:250,
        options3d: {
          enabled: true,
          alpha: 20,
          beta: 0,
          depth: 50,
          viewDistance: 50
      }
      },
      title: {
        text: ''
      },
      xAxis: {
        gridLineWidth: 0,
        minorGridLineWidth: 0,
        categories: [ ]
      },
      yAxis: {
        title: {
          text: ''
        }
      },

      plotOptions: {
        column: {
          stacking: 'normal',
          borderRadius: 0,
          pointWidth: 30
        }
      },
      legend: {
        layout: 'horizontal',
        align: 'right',
        verticalAlign: 'top',
        itemStyle: {
          color: '#333'
        }
      },
      credits: {
        enabled: false
      },
      series: [],
    };

    this.generateWeeks();
    this.getChart()
  }

  generateWeeks() {
    for (let i = 1; i <= 52; i++) {
        this.weeks.push({ label: `CW${i}` });
    }

    console.log("Cw",this.weeks)
}

  ngOnInit(){

    HC_3D(Highcharts);
    HC_More(Highcharts);

  }

  ngOnChanges(){
    this.getChart()
  }

  getChart(){

    this.service.GET().subscribe(res =>{
      this.weekData = res
      console.log(this.weekData)


    let Data = this.weekData;
    // console.log(Data);
    let length = Data.length;
    let In = [];
    let Out = [];
    let catagories = [];
    for (let i = 0; i < length; i++) {
        In.push(Data[i].inwards);
        Out.push(Data[i].outwards);
        catagories.push(Data[i].date);
    }

    let seriesData = [
      {
        name: 'Out',
        data: Out,
        type: 'column',
        color: '#d991f2'
      },
      {
        name: 'In',
        data: In,
        type: 'column',
        color: '#f07f7f'
      },
    ];

    this.Options.series = seriesData;
    this.Options.xAxis.categories = catagories;
    this.Options.column.dataLabels = {
      enabled: true,
        colors: "#000000",
        style: {
          textOutline: 'none' // Disable text outline
      }
    },

    this.Options = {
      chart: {
        type: 'column',
        options3d: {
          enabled: true,
          alpha: 20,
          beta: 0,
          depth: 50,
          viewDistance: 50
      }
      },

      xAxis: {
        categories: catagories,
      },
      yAxis: {
        title: {
          text: ''
        }
      },

      plotOptions: {
        column: {
          stacking: 'normal',
          borderRadius: 0,
          pointWidth: 30
        }
      },
      legend: {
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'top',
        itemStyle: {
          color: '#333'
        }
      },
      credits: {
        enabled: false
      },
      series: seriesData,
    };
  });
  }

}


