import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss'],
})
export class AreaComponent {
  lineChartData = [
    {
      name: 'Series 1',
      data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
    }
  ];

  lineChartColors = ['#FF5733'];
  lineChartType = 'area';
  lineChartHeight = 250; // Height in pixels
  lineChartWidth = 350; // Width in percentage
  lineChartXAxis = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
}