import { DatePipe } from '@angular/common';
import { Component, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ReportService } from '../../service/report.service';
import { Table } from 'primeng/table';
import { HttpClient } from '@angular/common/http';
import * as XLSX from "xlsx-js-style";
import { MAT_DATE_FORMATS } from '@angular/material/core';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-monthly-report',
  templateUrl: './monthly-report.component.html',
  styleUrls: ['./monthly-report.component.scss'],
  // providers: [
  //   { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  // ]
})
export class MonthlyReportComponent implements OnInit {
  form: any;
  displayedColumns: string[] = [];
  dataSource: any[] = [];
  datesArray: string[] = [];
  row: any;
  zones: any;
  unitnames: any;
  unit: any;
  formgroup: boolean = false;
  displaytable: boolean = false;
  showloader: boolean = false;
  maxDate!: Date;
  date = new Date()
  pipe = new DatePipe('en-US');
  sites: any[] = [];
  areas: any[] = [];
  category: any[] = [];

  @ViewChild('dt', { static: true }) dt!: Table;

  constructor(private fb: FormBuilder, private service: ReportService, private http: HttpClient) {}

  ngOnInit() {
    this.service.getData("businesslocations/zone").subscribe(result => {
      this.zones = result;
    });

    this.service.getData("virtualreport/unitname").subscribe(res => {
      this.unit = res;
      console.log(this.unit);
    });

    this.form = this.fb.group({
      date: new FormControl(this.pipe.transform(this.date,'YYYY-MM')),
      zone_name:  ['', Validators.required],
      unitname:  ['', Validators.required]
    });
    console.log(this.form.value)
  }

  applyFilterGlobal($event: any, stringValue: any) {
    this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringValue);
  }

  openfilter1() {
    this.showloader = false;
    this.formgroup = !this.formgroup;
  }

  openfilter() {
    this.showloader = false;
    this.displaytable = !this.displaytable;
  }

  getMonthlyDataCount(element: any, date: string): number {
    if (element && element.monthly_data) {
      const i = element.monthly_data.find((d: any) => d.date === date);
      return i ? i.Total_Count : 0;
    }
    return 0;
  }

  onSubmit() {
    this.displaytable = !this.displaytable;

    const formattedDate = this.pipe.transform(this.form.value.date, 'yyyy-MM');
    if (formattedDate) {
      const [year, month] = formattedDate.split('-');
      const payload = {
        "month": month,
        "year": year,
        "zone_name": this.form.get('zone_name').value,
        "unitname": this.form.get('unitname').value
      };


    console.log(payload);
    this.service.postData('virtualreport/montlyreport', payload).subscribe(res => {
      this.showloader = false;
      this.row = res;
      this.dataSource = this.row;
      this.datesArray = this.dataSource.length > 0 ? this.dataSource[0].monthly_data.map((entry: any) => entry.date) : [];
      this.displayedColumns = ['serialNumber', 'categoryName', 'zoneName', ...this.datesArray];
    });
  }
  }

  exportExcel() {
    const table = document.getElementById('monthly');

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
   XLSX.utils.sheet_add_aoa(ws, [['Monthly Report Details']], { origin: 'B2' });


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
  XLSX.writeFile(wb,'Monthly_Report.xlsx')
}
  }

