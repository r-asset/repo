import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.scss'],
})
export class SiteComponent {
  lineChartData = [
    {
      name: 'Series 1',
      data: [10, 41, 35, 51, 49, 62, 69, 191, 148]
    }
  ];

  lineChartColors = ['#FF5733'];
  lineChartType = 'area';
  lineChartHeight = 200; // Height in pixels
  lineChartWidth = 350; // Width in percentage
  lineChartXAxis = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
}
