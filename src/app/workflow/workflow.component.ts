import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { WorkflowService } from './service/workflow.service';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ItemManagementService } from '../item-management/Add-ons/service/item-management.service';
import { SettingsService } from '../settings/Add-ons/service/settings.service';
import * as XLSX from "xlsx-js-style";

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss']
})
export class WorkflowComponent {
@ViewChild('myTable', { static: true })
myTable!: Table;
dropdown: any;
selectedEvent = '' ; 

tableData!: any ;
loading: boolean = false;

display: boolean=false;
Addform: any;
Editform: any;
Editpopup: any;

url = 'assets/workflow.json'

checked: boolean = false;
value1= '';
value2= '';
value3= '';

priorityLevel: any

Conditionurl="assets/conditions.json"
conditions: any ;
status:any;
categorys: any;
items: any;

endpoint ='workflow/dashboard'

constructor(private http: HttpClient,private fb:FormBuilder,private service: WorkflowService,private messageService: MessageService,private Itemservice: ItemManagementService, private SettingsService: SettingsService)  {
  this.dropdown = [
      {name: 'None',       },
      {name: 'Daily Status Report', code: 'Last Report'},
      {name: 'Absence Report',     code: 'Absence'},
     
  ];
   this.priorityLevel = [
    {name: 'HIGH'      , code:'High'},
    {name: 'MEDIUM'    , code:'Medium'},
    {name: 'LOW'       , code:'Low'},
    {name: 'CRITICAL'  , code:'Critical'}
   ]
  // this.endpoint = "condition/data"
  this.service.getData('').subscribe(res =>{
    this.conditions = res
    console.log(res)
  })
}

ngOnInit(): void {
  this.GetData();

  this.http.get(this.url).subscribe(res =>{  
    this.tableData = res
    console.log(res)
   });  
   this.Addform = this.fb.group({
      
    wfeventcode     :['', Validators.required],
    wfeventname     :['', Validators.required],
    wfeventgroup    :['', Validators.required],
    wfresetinterval :[0],
    wfpriority      :['', Validators.required],
    wfactive        :['', Validators.required],
    wfdescription   :['', Validators.required],
    wfalertmessage  :['', Validators.required],
    wfcorrectmessage:['', Validators.required],
    wfcreatedon     :['', Validators.required],
    wfcreatedby     :['', Validators.required],
    wfmodifiedon    : [""],
    wfmodifiedby   : [""],
    sstatus        : [],
   
    scondition     :[],
    sclassification:  [true],
    scategory:  [],
    sitem:    [],
    rmeacht:[0],
    atoemail:  ['', Validators.required],
    accmail:   ['', Validators.required],
    asubject:  ['', Validators.required],
    apriority: ['', Validators.required],
    amessage:  ['', Validators.required],
    wfdays:[0],
    wfmins:[0],
    wfhrs:[0],
    stime: ['', Validators.required],
    wftype:['', Validators.required],
    schedule_days: new FormGroup({
      ssun: new FormControl(),
      smon: new FormControl(),
      stue: new FormControl(),
      swed: new FormControl(),
      sthu: new FormControl(),
      sfri: new FormControl(),
      ssat: new FormControl(),
    })
    
});
this.Editform = this.fb.group({
      
  wfeventcode     :['', Validators.required],
  wfeventname     :['', Validators.required],
  wfeventgroup    :['', Validators.required],
  wfresetinterval :[0],
  wfpriority      :['', Validators.required],
  wfactive        :['', Validators.required],
  wfdescription   :['', Validators.required],
  wfalertmessage  :['', Validators.required],
  wfcorrectmessage:['', Validators.required],
  wfcreatedon     :['', Validators.required],
  wfcreatedby     :['', Validators.required],
  wfmodifiedon    : [""],
  wfmodifiedby   : [""],
  sstatus        : [],
 
  scondition     :[],
  sclassification:  [true],
  scategory:  [],
  sitem:    [],
  rmeacht:[0],
  atoemail:  ['', Validators.required],
  accmail:   ['', Validators.required],
  asubject:  ['', Validators.required],
  apriority: ['', Validators.required],
  amessage:  ['', Validators.required],
  wfdays:[0],
  wfmins:[0],
  wfhrs:[0],
  stime: ['', Validators.required],
  wftype:['', Validators.required],
  schedule_days: new FormGroup({
    ssun: new FormControl(),
    smon: new FormControl(),
    stue: new FormControl(),
    swed: new FormControl(),
    sthu: new FormControl(),
    sfri: new FormControl(),
    ssat: new FormControl(),
  })
  
});
}
GetData(){
  this.SettingsService.getData("condition/data").subscribe(res =>{
    this.conditions = res
 
  let data = this.conditions
  let len = data.length
  let conditionName: string[] =[]
  for(let i=0; i<len; i++){
    conditionName.push(data[i].cdn_name)
  }
  this.conditions = conditionName
})
  this.SettingsService.getData('status/data').subscribe(res =>{
    this.status = res

  let data = this.status
  let len = data.length
  let statusName: string[] =[]
  for(let i=0; i<len; i++){
    statusName.push(data[i].st_name)
  }
  this.status = statusName
  })
  this.SettingsService.getData('category/data').subscribe(res =>{
    this.categorys = res

  let data = this.categorys
  let len = data.length
  let categoryName: string[] =[]
  for(let i=0; i<len; i++){
    categoryName.push(data[i].cdn_name)
  }
  this.categorys =categoryName
  })
  this.Itemservice.getData("item/data").subscribe(res =>{
    this.items = res

  let data = this.items
  let len = data.length
  let itemName: string[] =[]
  for(let i=0; i<len; i++){
    itemName.push(data[i].im_name)
  }
  this.items =itemName
  })
}
applyFilterGlobal($event:any, stringValue:any){
  this.myTable.filterGlobal(($event.target as HTMLInputElement).value, stringValue);
 }
 
codeEndpoint = 'wfcode'

  SavaData(Data:any){
    this.tableData.push(Data)
  }
  
  selectedData: any = null
  
  Update(Update:any){
    const i = this.tableData.findIndex((user:any) => user.wfcode === this.selectedData.wfcode);
    this.tableData[i] = Update;
  }
openDialog(){
  this.display = true;
  this.service.getData(this.codeEndpoint).subscribe(
    res =>{
    let code = res.wfcode
    this.Addform.get('wfcode')?.setValue(code)
  })
}
AddNewForm(){
  this.service.postData(this.endpoint,this.Addform.value).subscribe(
    res =>{
      this.SavaData(this.Addform.value)
      this.display = false;
      this.Addform.reset()
      this.messageService.add({ severity: 'success', summary: 'Added', detail:'Sucessfully', life: 4000 });
    },
    error => {
      this.messageService.add({ severity: 'error', summary: 'Not Added', detail: 'Failed', life: 4000 });
      console.log("Error")
    }
    )
    console.log('formValue',this.Addform.value)
}
EditForm(){
  this.service.putData(this.endpoint, this.Editform.value).subscribe(
    update =>{
      this.Update(this.Editform.value)
      this.messageService.add({ severity: 'info', summary: 'Updated', detail:'Sucessfully', life: 4000 });
    },
    error => {
      this.messageService.add({ severity: 'error', summary: 'Not Updated', detail: 'Failed', life: 4000 });
      console.log("Error")
    }
  )
 }

 editRow(i: any){
  this.Editpopup= true;
    this.selectedData = i;
    this.Editform.patchValue(this.selectedData)
}

deleteRow(i:any){
  this.service.deleteData(this.endpoint, i.wfcode).subscribe(
    () =>{
      this.Editpopup = false
      this.tableData.splice(i,1)
      this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Successfully', life: 4000 });
    },
    error => {
      this.messageService.add({ severity: 'error', summary: 'Not Deleted', detail: 'Failed', life: 4000 });
      console.log("Error");
    }
  )

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
     { s: { r: 1, c: 1 }, e: { r: 2, c: 12 } }, 
   ];
   ws['!merges'] = merge;
   XLSX.utils.sheet_add_aoa(ws, [['WorkFlow Details']], { origin: 'B2' });

   
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
              italic: true
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
                italic: true,
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
                color:'ff0000',
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
                    fgColor: { rgb: 'ADD8E6' },
                    bgColor: { rgb: 'ADD8E6' },
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

  ws['!cols']=[]
  ws['!cols'][2]= { hidden: true}
  ws['!cols'][3]= { width: 25}
  ws['!cols'][4]= { width: 18}
  ws['!cols'][5]= { width: 20}
  ws['!cols'][6]= { width: 15}
  ws['!cols'][8]= { width: 18}
  ws['!cols'][9]= { width: 18}
  ws['!cols'][10]= { width: 18}
  ws['!cols'][11]= {hidden: true}
  ws['!cols'][12]= { hidden: true}
  ws['!cols'][13]= { hidden: true}
  
  XLSX.utils.book_append_sheet(wb,ws);
  XLSX.writeFile(wb, 'Workflow_Details.xlsx')
}
}



