import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ReportService } from '../../service/report.service';
import { Table } from 'primeng/table';
import { HttpClient } from '@angular/common/http';
import * as XLSX from "xlsx-js-style";

@Component({
  selector: 'app-mpl',
  templateUrl: './mpl.component.html',
  styleUrls: ['./mpl.component.scss']
})
export class MplComponent {
@ViewChild('dt', { static: true })
dt!: Table;
form: any;

mplTable: any;

maxDate!: Date ;
pipe = new DatePipe('en-US');

formgroup:boolean=false;
displaytable: boolean=false;
showloader: boolean=false;
visible:boolean = false;

sites: any[] = [];
areas: any[] = [];
zones: any[] = [];
category: any[] = [];
categoriesname: any = [];

// siteurl = 'assets/site.json'
// zoneurl = 'assets/zone.json'
// areaurl = 'assets/area.json'
// categoryurl = 'assets/category.json'
staticData: any[] = [
  { col1: 'Row 1 Col 1', col2: 'Row 1 Col 2', col3: 'Row 1 Col 3', col4: 'Row 1 Col 4' },
  { col1: 'Row 2 Col 1', col2: 'Row 2 Col 2', col3: 'Row 2 Col 3', col4: 'Row 2 Col 4' },
  { col1: 'Row 3 Col 1', col2: 'Row 3 Col 2', col3: 'Row 3 Col 3', col4: 'Row 3 Col 4' },
  { col1: 'Row 4 Col 1', col2: 'Row 4 Col 2', col3: 'Row 4 Col 3', col4: 'Row 4 Col 4' },
  { col1: 'Row 5 Col 1', col2: 'Row 5 Col 2', col3: 'Row 5 Col 3', col4: 'Row 5 Col 4' },
  { col1: 'Row 6 Col 1', col2: 'Row 6 Col 2', col3: 'Row 6 Col 3', col4: 'Row 6 Col 4' },
  { col1: 'Row 7 Col 1', col2: 'Row 7 Col 2', col3: 'Row 7 Col 3', col4: 'Row 7 Col 4' },
  { col1: 'Row 8 Col 1', col2: 'Row 8 Col 2', col3: 'Row 8 Col 3', col4: 'Row 8 Col 4' },
  { col1: 'Row 9 Col 1', col2: 'Row 9 Col 2', col3: 'Row 9 Col 3', col4: 'Row 9 Col 4' },
  { col1: 'Row 10 Col 1', col2: 'Row 10 Col 2', col3: 'Row 10 Col 3', col4: 'Row 10 Col 4' },
];
  selectedCategoryName: any;


constructor(private fb: FormBuilder,private service:ReportService,private http: HttpClient)
{

}
ngOnInit(): void {
  this.form = this.fb.group({
    mpl_frmdte:  ['', Validators.required],
    mpl_todte:  ['', Validators.required],
    mpl_startlocation: ['', Validators.required],
    mpl_endlocation: ['', Validators.required],
    mpl_category: ['', Validators.required],
  });

  // Fetch site, area, zone, and category data
  this.service.getData("businesslocations/site").subscribe(res => {
    this.sites = res;
  });

  this.service.getData("businesslocations/area").subscribe(res => {
    this.areas = res;
  });

  this.service.getData("businesslocations/zone").subscribe(res => {
    this.zones = res;
  });

  this.service.getData("category/data").subscribe(res => {
    this.category = res;
    this.categoriesname = res.map((category: any) => ({ label: category.cm_name, value: category.cm_id }));
  });
  this.form.get('mpl_category').valueChanges.subscribe((selectedCategoryId: any) => {
    const selectedCategory = this.categoriesname.find((category: any) => category.value === selectedCategoryId);
    this.selectedCategoryName = selectedCategory ? selectedCategory.label : '';
  });
}

showDialog() {
  this.visible = true;
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

  let formdate=this.pipe.transform(this.form.value.mpl_frmdte,"yyyy-MM-dd")
  let todate=this.pipe.transform(this.form.value.mpl_todte,"yyyy-MM-dd")

  this.form.controls['mpl_frmdte'].setValue(formdate);
  this.form.controls['mpl_todte'].setValue(todate);

  this.service.postData('virtualreport/movementsperlocation',this.form.value).subscribe(res =>{
    this.mplTable = res
   })
   this.showloader=false
}

exportExcel(){
  const table = document.getElementById('mpl');

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
       ? `Asset Availability Report Details for   ${this.selectedCategoryName}`
       : 'Asset Availability Report Details';

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
  XLSX.writeFile(wb,'MPL_Report.xlsx')
}
}
