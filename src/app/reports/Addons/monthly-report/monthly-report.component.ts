import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ReportService } from '../../service/report.service';
import { Table } from 'primeng/table';
import { HttpClient } from '@angular/common/http';
import * as XLSX from "xlsx-js-style";



@Component({
  selector: 'app-monthly-report',
  templateUrl: './monthly-report.component.html',
  styleUrls: ['./monthly-report.component.scss']
})
export class MonthlyReportComponent {
  @ViewChild('dt', { static: true })
dt!: Table;
form: any;

assetavailabilityTable: any;

maxDate!: Date ;
pipe = new DatePipe('en-US');

sitesname: any = [];



formgroup:boolean=false;
displaytable: boolean=false;
showloader: boolean=false;

siteurl = 'assets/site.json'


constructor(private fb: FormBuilder,private service:ReportService,private http: HttpClient){

}
ngOnInit(): void {
  this.form = this.fb.group({
    aa_frmdte:   ['',Validators.required],
    aa_todte:   ['',Validators.required],
    aa_siteid: ['',Validators.required],
  });
   this.http.get(this.siteurl).subscribe(res=>{
      this.sitesname=res

      let sitename: string[] =[]
      for(const res of this.sitesname){
        sitename.push(res.sc_name)
      }
      console.log(sitename)
      this.sitesname = sitename
  });

}
applyFilterGlobal($event:any, stringValue:any){
  this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringValue);
}
openfilter1(){
  this.showloader = false
  this.formgroup = !this.formgroup
}

openfilter(){
  this.showloader = false
  this.displaytable = !this.displaytable
}

OnSubmit(){
  this.showloader = true;
  this.displaytable = !this.displaytable

  let formdate=this.pipe.transform(this.form.value.aa_frmdte,"yyyy-MM-dd")
  let todate=this.pipe.transform(this.form.value.aa_todte,"yyyy-MM-dd")

  this.form.controls['aa_frmdte'].setValue(formdate);
  this.form.controls['aa_todte'].setValue(todate);

  this.service.postData('virtualreport/assetavailability',this.form.value).subscribe(res =>{
    this.assetavailabilityTable = res
   })
   this.showloader=false
}
exportExcel(){
  const table = document.getElementById('dom');

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
   XLSX.utils.sheet_add_aoa(ws, [['Asset Availability Details']], { origin: 'B2' });


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
  XLSX.writeFile(wb, 'Asset_Availability.xlsx')

}
}
