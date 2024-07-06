import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReportService } from '../../service/report.service';
import { Table } from 'primeng/table';
import * as XLSX from "xlsx-js-style";

@Component({
  selector: 'app-mpl',
  templateUrl: './mpl.component.html',
  styleUrls: ['./mpl.component.scss']
})
export class MplComponent {
  @ViewChild('dt', { static: true }) dt!: Table;
  form: FormGroup;
  mplTable: any;
  maxDate!: Date;
  pipe = new DatePipe('en-US');
  formgroup: boolean = false;
  displaytable: boolean = false;
  showloader: boolean = false;
  startname: any = [];
  endname: any = [];
  categoriesname: any = [];

  constructor(private fb: FormBuilder, private service: ReportService) {
    this.form = this.fb.group({
      mpl_frmdte: ['', Validators.required],
      mpl_todte: ['', Validators.required],
      mpl_startlocation: ['', Validators.required],
      mpl_endlocation: ['', Validators.required],
      mpl_category: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.service.getData('businesslocations/zone').subscribe(res => {
      this.startname = res.map((item: any) => ({ label: item.sc_name, value: item.id }));
    });

    this.service.getData('endlocations').subscribe(res => {
      this.endname = res.map((item: any) => ({ label: item.ar_name, value: item.id }));
    });

    this.service.getData('category/data').subscribe(res => {
      this.categoriesname = res.map((item: any) => ({ label: item.cm_name, value: item.id }));
    });
  }

  openfilter1() {
    this.showloader = false;
    this.formgroup = !this.formgroup;
  }

  openfilter() {
    this.showloader = false;
    this.displaytable = !this.displaytable;
  }

  applyFilterGlobal($event: any, stringValue: any) {
    this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringValue);
  }

  OnSubmit() {
    this.showloader = true;
    this.displaytable = !this.displaytable;

    let formdate = this.pipe.transform(this.form.value.mpl_frmdte, "yyyy-MM-dd");
    let todate = this.pipe.transform(this.form.value.mpl_todte, "yyyy-MM-dd");

    this.form.controls['mpl_frmdte'].setValue(formdate);
    this.form.controls['mpl_todte'].setValue(todate);

    this.service.postData('virtualreport/movementsperlocation', this.form.value).subscribe(res => {
      this.mplTable = res;
      this.showloader = false;
    });
  }

  exportExcel() {
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
    XLSX.utils.sheet_add_aoa(ws, [['Movements Per Location Details']], { origin: 'B2' });

    XLSX.utils.sheet_add_aoa(ws, [['']], { origin: 'B3' });
    XLSX.utils.sheet_add_aoa(ws, [['']], { origin: 'B4' });

    const headerRow = table.querySelector('thead tr');

    if (headerRow) {
      const headerData = [];
      const headerCells = headerRow.getElementsByTagName('th');
      for (let i = 0; i < headerCells.length; i++) {
        headerData.push(headerCells[i].textContent);
      }
      XLSX.utils.sheet_add_aoa(ws, [headerData], { origin: 'B5' });
    }

    const tableData = [];
    const rows = table.querySelectorAll('tbody tr');
    for (let i = 0; i < rows.length; i++) {
      const rowData = [];
      const cells = rows[i].getElementsByTagName('td');
      for (let j = 0; j < cells.length; j++) {
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
          right: { style: 'thin' },
          left: { style: 'thin' },
          top: { style: 'thin' },
          bottom: { style: 'thin' },
        },
      };
      if (cell.r == 1) {
        ws[i].s = {
          font: {
            sz: '15',
            color: { rgb: 'FF0000' },
          },
          alignment: {
            vertical: 'center',
            horizontal: 'center',
          },
        };
      }
      if (cell.r == 4) {
        ws[i].s = {
          font: {
            bold: true,
            color: { rgb: 'fffcfd' },
          },
          alignment: {
            vertical: 'center',
            horizontal: 'center',
          },
          border: {
            right: { style: 'thin' },
            left: { style: 'thin' },
            top: { style: 'thin' },
            bottom: { style: 'thin' },
          },
        };
        ws[i].s.fill = {
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

    XLSX.utils.book_append_sheet(wb, ws);
    XLSX.writeFile(wb, 'MPL_Report.xlsx');
  }
}
