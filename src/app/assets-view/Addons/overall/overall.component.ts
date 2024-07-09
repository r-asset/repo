import { Component } from '@angular/core';

@Component({
  selector: 'app-overall',
  templateUrl: './overall.component.html',
  styleUrl: './overall.component.css'
})
export class OverallComponent {

    barChartData = [
  {
    name: 'Series 3',
    data: [30, 15, 10, 25, 18, 32, 40, 60, 35, 30, 15, 10, 25, 18, 32, 40, 60, 35]
  }
];
  // // Common configurations
  chartColors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF'];
  chartHeight = 300;
  chartWidth = 1250;
  chartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec','Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  yAxisTitle = 'Value';
}
