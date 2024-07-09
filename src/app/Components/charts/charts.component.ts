import { Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
})
export class ChartsComponent implements OnInit {
  @Input() chartData: any;
  @Input() chartColors: string[] | undefined;
  @Input() chartType: string | undefined;
  @Input() chartHeight: number | string | undefined;
  @Input() chartWidth: number | string | undefined;
  @Input() xAxisCategories: string[] | undefined;
  @Input() yAxisTitle: string | undefined;
  @Input() value: boolean | undefined;

  public chartOptions: any;

  ngOnInit(): void {
    this.chartOptions = {
      series: this.chartData,
      chart: {
        type: this.chartType || 'line',
        height: this.chartHeight || 350,
        width: this.chartWidth || '100%'
      },

      colors: this.chartColors,
      labels: this.xAxisCategories, // Used for pie, donut, and radar charts
      xaxis: this.chartType !== 'pie' && this.chartType !== 'donut' && this.chartType !== 'radar' ? {
        categories: this.xAxisCategories || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      } : undefined,
      yaxis: this.chartType !== 'pie' && this.chartType !== 'donut' && this.chartType !== 'radar' ? {
        title: {
          text: this.yAxisTitle || ''
        }
      } : undefined,
      plotOptions: {
        bar:{
          distributed: true,
          borderRadius: 10,
        },
        pie: {
          donut: {
            size: '50%' // Specific to donut charts
          }
        }
      },
      stroke: {
        width: 2
      },
      dataLabels: {
        enabled: false,

      },
      tooltip: {
        enabled: true
      }
    };
  }
}


              //  Sample Usages
// Example data for different chart types
// {
// lineChartData = [
//   {
//     name: 'Series 1',
//     data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
//   }
// ];
// areaChartData = [
//   {
//     name: 'Series 2',
//     data: [20, 30, 40, 80, 20, 80, 99, 100, 45]
//   }
// ];
// barChartData = [
//   {
//     name: 'Series 3',
//     data: [30, 15, 10, 25, 18, 32, 40, 60, 35]
//   }
// ];
// pieChartData = [44, 55, 13, 43, 22];
// donutChartData = [44, 55, 41, 17, 15];
// radarChartData = [
//   {
//     name: 'Series 4',
//     data: [80, 90, 70, 60, 80, 90, 100]
//   }
// ];

// // Common configurations
// chartColors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF'];
// chartHeight = 400;
// chartWidth = '80%';
// chartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
// yAxisTitle = 'Value';
// }
