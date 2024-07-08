import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ReportService } from '../../service/report.service';
import { ItemManagementService } from '../../../item-management/Add-ons/service/item-management.service';
import { DatePipe } from '@angular/common';
import { Table } from 'primeng/table';
import * as XLSX from "xlsx-js-style";

@Component({
  selector: 'app-path-tracking',
  templateUrl: './path-tracking.component.html',
  styleUrls: ['./path-tracking.component.scss']
})
export class PathTrackingComponent {
@ViewChild('dt', { static: true })
dt!: Table;

form: any;
pipe = new DatePipe('en-US');
timefrom: any;
timeto: any;
maxDate!: Date ;

itemsname: any = [];
filterdays: any;

  selectedFilter=''
  selectedItem: any;
pathTrackingTable:any;

displaytable: boolean=false;
showloader: boolean=false;
pathTrackingGif: boolean=false;

constructor(private fb: FormBuilder,private http: HttpClient,private service: ReportService,
  private itemservice: ItemManagementService)
{

  this.service.getData('item/pathtracker').subscribe( res=>{
  this.itemsname = res


  // let name = itemname
  // console.log(typeof(name))
  // console.log(name)

 });



 this.filterdays =[
  { name: 'Custom', code: 'Custom' },
   { name: '1 Day', code: '1 Day'  },
    { name: '7 Days', code: '7 Days' },
     { name: '15 Days', code: '15 Days' },
      { name: '30 Days', code: '30 Days' },
 ];
 this.form = this.fb.group({
  date1 : new FormControl(),
  date2: new FormControl(),
  pt_filter : ['',Validators.required],
  pt_item  : ['',Validators.required],
 })
}
ngOnInit(): void {

}

OnSelectedChange(value:any){
  this.selectedItem = Number(value.value)
}

openfilter(){
  this.showloader = false
  this.displaytable = !this.displaytable
  this.pathTrackingGif = !this.pathTrackingGif
}

applyFilterGlobal($event:any, stringValue:any){
  this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringValue);
}

dropdownChange(){
  console.log(this.selectedFilter)

  const selectedFilterValue = this.selectedFilter;

  switch(selectedFilterValue){
    case '1 Day':
      this.filterDatafor1day();
    break;
    case '7 Days':
      this.filterDatafor7days();
    break;
    case '15 Days':
      this.filterDatafor15days();
    break;
    case '30 Days':
      this.filterDatafor30days();
    break;

  }
}
filterDatafor1day(){

  const currDate = new Date();
  const oneDayAgo =new Date();
  this.timefrom=""
  this.timeto=""
  oneDayAgo.setDate(currDate.getDate()-1)
  this.timefrom=this.pipe.transform(oneDayAgo,'yyyy-MM-dd')
  this.timeto=this.pipe.transform(currDate,'yyyy-MM-dd')

  // console.log(oneDayAgo)
}
filterDatafor7days(){
  this.timefrom=""
  this.timeto=""
  var sevendays = new Date((new Date()).valueOf() - 7000*60*60*24);
  var yesterday = new Date((new Date()).valueOf() - 1000*60*60*24);
  this.timefrom=this.pipe.transform(sevendays,'yyyy-MM-dd')
  this.timeto=this.pipe.transform(yesterday,'yyyy-MM-dd')
}
filterDatafor15days(){
  this.timefrom=""
  this.timeto=""
  var fifteendays = new Date((new Date()).valueOf() - 15000*60*60*24);
  var yesterday = new Date((new Date()).valueOf() - 1000*60*60*24);
  this.timefrom=this.pipe.transform(fifteendays,'yyyy-MM-dd')
  this.timeto=this.pipe.transform(yesterday,'yyyy-MM-dd')
}
filterDatafor30days(){
  this.timefrom=""
  this.timeto=""
  var thirtydays = new Date((new Date()).valueOf() - 30000*60*60*24);
  var yesterday = new Date((new Date()).valueOf() - 1000*60*60*24);
  this.timefrom=this.pipe.transform(thirtydays,'yyyy-MM-dd')
  this.timeto=this.pipe.transform(yesterday,'yyyy-MM-dd')
}
OnSubmit(){

  this.showloader = true;
  this.displaytable = !this.displaytable
  this.pathTrackingGif = !this.pathTrackingGif
  const selectedFilterValue = this.selectedFilter;

  switch(selectedFilterValue){
    case 'Custom':
        let date1=this.form.value.date1
        let date2=this.form.value.date2

      let datass = {
        "pt_filter":this.selectedFilter,
        "pt_item":this.selectedItem,
        "pt_fromdate":this.pipe.transform(date1,'yyyy-MM-dd'),
        "pt_todate":this.pipe.transform(date2,'yyyy-MM-dd')
      }
      this.service.postData('taglocation/pathtracking',datass).subscribe(res =>{
        this.pathTrackingTable = res
       })
       console.log(datass)
    break;
    case '1 Day':
      let datas = {
        "pt_filter":this.selectedFilter,
        "pt_item":this.selectedItem,
        "pt_fromdate":this.timefrom,
        "pt_todate":this.timeto
      }
      console.log(this.selectedItem)
      this.service.postData('taglocation/pathtracking',datas).subscribe(res =>{
        this.pathTrackingTable = res
       })

    break;
    case '7 Days':
      let datas1 = {
        "pt_filter":this.selectedFilter,
        "pt_item":this.selectedItem,
        "pt_fromdate":this.timefrom,
        "pt_todate":this.timeto
      }
      this.service.postData('taglocation/pathtracking',datas1).subscribe(res =>{
        this.pathTrackingTable = res
       })
      console.log(datas1)
    break;
    case '15 Days':
      let datas2 = {
        "pt_filter":this.selectedFilter,
        "pt_item":this.selectedItem,
        "pt_fromdate":this.timefrom,
        "pt_todate":this.timeto
      }
      this.service.postData('taglocation/pathtracking',datas2).subscribe(res =>{
        this.pathTrackingTable = res
       })
      console.log(datas2)
    break;
    case '30 Days':
      let datas3 = {
        "pt_filter":this.selectedFilter,
        "pt_item":this.selectedItem,
        "pt_fromdate":this.timefrom,
        "pt_todate":this.timeto
      }
      this.service.postData('taglocation/pathtracking',datas3).subscribe(res =>{
        this.pathTrackingTable = res
       })
      console.log(datas3)
    break;
  }
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
   XLSX.utils.sheet_add_aoa(ws, [['Path Tracking Details']], { origin: 'B2' });


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
  XLSX.writeFile(wb,'Path-Tracking_Report.xlsx')
}
}
