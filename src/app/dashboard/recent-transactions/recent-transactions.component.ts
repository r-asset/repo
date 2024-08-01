
import { Component, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { DashboardService } from '../service/dashboard.service';
import { DatePipe } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import * as XLSX from "xlsx-js-style";
import { MatCard } from '@angular/material/card';
import { MatSlider } from '@angular/material/slider';

@Component({
  selector: 'app-recent-transactions',
  standalone: false,
  templateUrl: '../recent-transactions/recent-transactions.component.html',
  styleUrls: ['../recent-transactions/recent-transactions.component.scss']
})
export class RecentTransactionsComponent {

  @ViewChild('dt', { static: true })
  dt!: Table;

  form: any;
  Table: any;

  date=new Date()
  pipe= new DatePipe("en-US")

  applyFilterGlobal($event:any, stringValue:any){
    this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringValue);
  }

  constructor(private service:DashboardService,private fb: FormBuilder,)
  {
    this.form = this.fb.group({
      date: [''],
    });


    let today = new Date();
    today.setDate(today.getDate());

    let CurrDate = {"date": this.pipe.transform(today,"YYYY-MM-dd") }
      // console.log(CurrDate)

    this.service.postData('overview/dashboard',CurrDate).subscribe(res =>{
      this.Table = res
      // console.log(this.Table)
    });

  }
  ngOnInit() {
    this.form.patchValue({
      date: new Date()
    });

   }

  OnSubmit(event: any){

    let events =  {date: this.pipe.transform(event,"yyyy-MM-dd")}


    this.service.postData('overview/dashboard',events).subscribe(res =>{
      this.Table = res
      console.log(this.Table)
    });

  }


  exportExcel(){
    const table = document.getElementById('recent');

    if (!table) {
      console.error("The table element with ID 'dom' does not exist.");
      return;
    }

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);

    const merge = [
       { s: { r: 1, c: 1 }, e: { r: 2, c: 6 } },
     ];
     ws['!merges'] = merge;
     XLSX.utils.sheet_add_aoa(ws, [['Recent Transaction Details']], { origin: 'B2' });


     // Leave 2 empty rows
     XLSX.utils.sheet_add_aoa(ws, [['']], { origin: 'B3' });
     XLSX.utils.sheet_add_aoa(ws, [['']], { origin: 'B4' });

     const headerRow = table.querySelector('thead tr');

     if (headerRow) {
      const headerData = [];
      const headerCells = headerRow.getElementsByTagName('th');
      for (let i = 0; i < headerCells.length ; i++) {
        headerData.push(headerCells[i].textContent);
      }
      XLSX.utils.sheet_add_aoa(ws, [headerData], { origin: 'B5' });
    }

    const tableData = [];
    const rows = table.querySelectorAll('tbody tr');
    for (let i = 0; i < rows.length; i++) {
     const rowData = [];
     const cells = rows[i].getElementsByTagName('td');
     for (let j = 0; j < cells.length ; j++) {
       // Skip the first and last cells in each row
       rowData.push(cells[j].textContent);
      }
      tableData.push(rowData);
    }
    XLSX.utils.sheet_add_aoa(ws, tableData, { origin: 'B6' });

    for (var i in ws) {
      if (typeof ws[i] != 'object') continue;
        let cell = XLSX.utils.decode_cell(i);

        ws[i].s = {
              font: {
                italic: true,
              },
              alignment: {
                vertical: 'center',
                horizontal: 'center',
              },
              border: {
                right: {style: 'thin'},
                left: {style: 'thin'},
                top : {style: 'thin'},
                bottom: {style: 'thin'},
              },

            }
            if (cell.r == 1) {
              ws[i].s = {
                font: {
                  // italic: true,
                  sz:'15',
                  color:{ rgb: 'FF0000' },
                },
                alignment: {
                  vertical: 'center',
                  horizontal: 'center',
                },
              }
            }
            // heading row
            if (cell.r == 4) {
              ws[i].s = {
                font: {
                  bold:true,
                  color:{ rgb: 'fffcfd' },
                },
                alignment: {
                  vertical: 'center',
                  horizontal: 'center',
                },
                border: {
                  right: {style: 'thin'},
                  left: {style: 'thin'},
                  top : {style: 'thin'},
                  bottom: {style: 'thin'},
                },
              }
              ws[i].s.fill = {
                    // background color
                      patternType: 'solid',
                      fgColor: { rgb: 'ff3030' },
                      bgColor: { rgb: 'ff3030' },
                    };
            }

    }

    const cellB4 = 'B4';
    const cellB4Style = {
      border: {
        top: { style: 'none' },
        bottom: { style: 'none' },
        left: { style: 'none' },
        right: { style: 'none' },
      },
    };
    ws[cellB4].s = cellB4Style;


    XLSX.utils.book_append_sheet(wb,ws);
    XLSX.writeFile(wb,'Recent_Transactions.xlsx')
  }
}
