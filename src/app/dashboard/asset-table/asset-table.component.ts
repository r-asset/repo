import { Component,OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Table, TableModule } from 'primeng/table';
import { DashboardService } from '../service/dashboard.service';



@Component({
  selector: 'app-asset-table',
  templateUrl: './asset-table.component.html',
  styleUrls: ['./asset-table.component.css']
})
export class AssetTableComponent {
  Table: any;

  @ViewChild('dt', { static: true })
  dt!: Table;

  constructor(private service: DashboardService)
  {

  }

  ngOnInit(){
    this.service.postdata("overview/categorytotal").subscribe(res=>{
      this.Table=res

     });

  }
}
