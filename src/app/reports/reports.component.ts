import { Component } from '@angular/core';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {
  activeIndex: number = 0;

    // Define the paths for default and GIF backgrounds
   public defaultBackground: string = '../../assets/background.png'; // Replace with your default image path
   public pathTrackingGif: string = '../../assets/pathtracking.gif'; // Replace with your GIF path

  tabs: { iconRed: string, iconWhite: string, name : string}[] = [
    {name: 'PathTrackingComponent', iconRed: '../../assets/reports/path.png', iconWhite: '../../assets/reports/onclick/path.png' },
    {name: 'DwellReportComponent', iconRed: '../../assets/reports/dwell.png', iconWhite: '../../assets/reports/onclick/dwell.png' },
    {name: 'InOutReportComponent', iconRed: '../../assets/reports/inout.png', iconWhite: '../../assets/reports/onclick/inout.png' },
    {name: 'AssetsAvailabilityComponent', iconRed: '../../assets/reports/availl.png', iconWhite: '../../assets/reports/onclick/avail.png' },
    {name: 'MplComponent', iconRed: '../../assets/reports/mpl.png', iconWhite: '../../assets/reports/onclick/mpl.png' },
    {name: 'MonthlyReportComponent', iconRed: '../../assets/reports/monthly.png', iconWhite: '../../assets/reports/onclick/monthly.png' }
  ];

  //changing function
  onTabChange(event: any) {
    this.activeIndex = event.index;
    this.updateBackgroundImage();
  }

  //update background image based on tabs
  updateBackgroundImage(): void {
    const defaultImageElement = document.getElementById('defaultImage') as HTMLImageElement;
    const pathTrackingElement = document.getElementById('pathTrackingImage') as HTMLImageElement;

    if (defaultImageElement && pathTrackingElement) {
      if (this.tabs[this.activeIndex].name === 'PathTrackingComponent') {
        defaultImageElement.style.display = 'none';
        pathTrackingElement.style.display = 'block';
        pathTrackingElement.style.width = '60%';
        pathTrackingElement.style.position = 'absoute';
        pathTrackingElement.style.overflow = 'hidden';
        pathTrackingElement.style.left = '15%';
        pathTrackingElement.style.top = '220%';
      } else {
        defaultImageElement.style.display = 'block';
        defaultImageElement.style.left = '30%';
        defaultImageElement.style.overflow = 'hidden';
        defaultImageElement.style.position = 'fixed';
        pathTrackingElement.style.display = 'none';
        defaultImageElement.style.opacity = '.2';
      }
    }
  }
  //for changing the con color to white when clicked
  getImageSource(index: number): string {
    return this.activeIndex === index ? this.tabs[index].iconWhite : this.tabs[index].iconRed;
  }

}

