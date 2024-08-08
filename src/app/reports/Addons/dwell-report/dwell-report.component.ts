import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ReportService } from '../../service/report.service';
import { Table } from 'primeng/table';
import { SettingsService } from '../../../settings/Add-ons/service/settings.service';
import { HttpClient } from '@angular/common/http';
import * as XLSX from "xlsx-js-style";

@Component({
  selector: 'app-dwell-report',
  templateUrl: './dwell-report.component.html',
  styleUrls: ['./dwell-report.component.scss']
})
export class DwellReportComponent {
@ViewChild('dt', { static: true })
dt!: Table;
form: any;

sitesname: any = [];
zonesname: any = [];
areasname: any = [];
categoriesname: any = [];
AssetDetails: any;

pipe = new DatePipe('en-US');
DwellTable: any;
dwellSearch: any;
dwellValue: any;

maxDate!: Date ;
selectedCategoryName: string = '';




formgroup:boolean=false;
displaytable: boolean=false;
showloader: boolean=false;

constructor(private fb: FormBuilder,private service: ReportService,private http: HttpClient){
}
 ngOnInit(): void {
  this.dwellSearch = [
    {name: 'HOURS',   code: 'HOURS'},
  ];
  this.dwellValue =[
    {name: 'MORE THAN ONE',code: 'MORE THAN ONE'},
    {name: 'EQUALS',code: 'EQUALS'},
    {name: 'NOT EQUALS',code: 'NOT EQUALS'},
    {name: 'LESS THAN ',code: 'LESS THAN'},
    {name: 'LESS THAN OR EQUALS',code: 'LESS THAN OR EQUALS'},
    {name: 'MORE THAN ',code: 'MORE THAN'},
    {name: 'MORE THAN OR EQUALS',code: 'MORE THAN OR EQUALS'},
  ];
  this.service.getData("businesslocations/site").subscribe(res => {
    this.sitesname = res.map((site: any) => ({ label: site.sc_name, value: site.sc_id }));
  });

  this.service.getData("businesslocations/area").subscribe(res => {
    this.areasname = res.map((area: any) => ({ label: area.ar_name, value: area.ar_id }));
  });

  this.service.getData("businesslocations/zone").subscribe(res => {
    this.zonesname = res.map((zone: any) => ({ label: zone.zn_name, value: zone.zn_id }));
  });

  this.service.getData("category/data").subscribe(res => {
    this.categoriesname = res.map((category: any) => ({ label: category.cm_name, value: category.cm_id }));
    this.AssetDetails = res.cm_name
  });




  this.form = this.fb.group({
    dr_frmdte:   ['',Validators.required],
    dr_todte:   ['',Validators.required],
    dr_siteid: ['',Validators.required],
    dr_areaid: ['',Validators.required],
    dr_zoneid: ['',Validators.required],
    dr_dwelltype: ['',Validators.required],
    dr_category:['',Validators.required],
    // dr_logicaloperator: ['',Validators.required],
    dr_dwelloperator1: ['',Validators.required],
    dr_dwelloperand1: [0],
    // dr_dwelloperator2: ['',Validators.required],
    // dr_dwelloperand2: [0]
  });

  this.form.get('dr_category').valueChanges.subscribe((selectedCategoryId: any) => {
    const selectedCategory = this.categoriesname.find((category: any) => category.value === selectedCategoryId);
    this.selectedCategoryName = selectedCategory ? selectedCategory.label : '';
  });

  }
  OnSelectedChange(value:any){
    this.sitesname = Number(value.value)
  }
  openfilter1(){
    this.showloader = false
    this.formgroup = !this.formgroup
  }
  openfilter(){
    this.showloader = false
    this.displaytable = !this.displaytable
  }

  applyFilterGlobal($event:any, stringValue:any){
    this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringValue);
  }
OnSubmit(){
  this.showloader = true;
  this.displaytable = !this.displaytable
  this.service.postData('virtualreport/dwelltime',this.form.value).subscribe(res => {
    this.DwellTable = res
  })

  console.log(this.form.value)

  let fromDate=this.pipe.transform(this.form.value.dr_frmdte,"yyyy-MM-dd")
  let toDate=this.pipe.transform(this.form.value.dr_todte,"yyyy-MM-dd")

  this.form.controls['dr_frmdte'].setValue(fromDate);
  this.form.controls['dr_todte'].setValue(toDate);

  this.service.postData('virtualreport/dwelltime',this.form.value).subscribe(res => {
    this.DwellTable = res
  })
  this.showloader=false
}
exportExcel(){
  const table = document.getElementById('dwell');

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
  // Generate the report title based on selectedCategoryName
  const reportTitle = this.selectedCategoryName
    ? `Dwell Report Details for   ${this.selectedCategoryName}`
    : 'Dwell Report Details';

  // Add the title with the selected category name or fallback
  XLSX.utils.sheet_add_aoa(ws, [[reportTitle]], { origin: 'B2' });


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
  // Setting the column widths for better spacing
  ws['!cols'] = [
    { wch: 1 }, // Column for S.No
    { wch: 30 }, // Column for Entry location
    { wch: 20 }, // Column for Entry time
    { wch: 20 }, // Column for Exit location
    { wch: 20 },  // Column for Exit time
    { wch: 20 },  // Column for Exit time
    { wch: 20 },  // Column for Exit time
    { wch: 20 },  // Column for Exit time
];

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
  XLSX.writeFile(wb,'Dwell_Report.xlsx')
}
}
