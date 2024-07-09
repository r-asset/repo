import { Component } from '@angular/core';

@Component({
  selector: 'app-condition',
  templateUrl: './condition.component.html',
  styleUrls: ['./condition.component.scss'],
})
export class ConditionComponent {
  pieChartData = [44, 55];

  // Common configurations
chartColors = ['#FF5733', '#000000'];
chartHeight = 200;
chartWidth = '142%';
chartLabels = ['Working Active', 'Maintenance'];
}
