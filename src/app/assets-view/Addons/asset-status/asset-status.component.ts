import { Component } from '@angular/core';

@Component({
  selector: 'app-asset-status',
  templateUrl: './asset-status.component.html',
  styleUrl: './asset-status.component.css'
})
export class AssetStatusComponent {
  donutChartData = [44, 55, 41];
  // Common configurations
  chartColors = ['#3357FF', '#FF33A1', '#A133FF'];
  chartHeight = 400;
  chartWidth = '130%';
  chartLabels = ['Jan', 'Feb', 'Mar'];
  yAxisTitle = 'Value';
}
