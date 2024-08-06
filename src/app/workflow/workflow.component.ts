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

date3: Date | undefined;

tableData!: any ;
loading: boolean = false;

display: boolean=false;
Addform: any;
Editform: any;
Editform2:any
Editpopup: any;
Editpopup2: any;


checked: boolean = false;
value1= '';
value2= '';
value3= '';

priorityLevel: any

tickets: any;

conditions: any ;
status:any;
categorys: any;
items: any;
itemss: any[] = [];
displays: boolean = false;
ticketData: any;

endpoint ='workflow/dashboard'
endpoint2 = 'workflow/ticketmanagement'
  code2: any;


  adjustPosition(event: any) {
    const dropdown = event.originalEvent.currentTarget.querySelector('.p-datepicker');
    if (dropdown) {
      const rect = event.originalEvent.currentTarget.getBoundingClientRect();
      const dropdownHeight = dropdown.offsetHeight;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        dropdown.classList.add('open-upwards');
      } else {
        dropdown.classList.remove('open-upwards');
      }
    }
  }

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
   ];
}

categories:any;

ngOnInit(): void {
  this.GetData();

  this.service.getData('condition/data').subscribe(res =>{
    this.conditions = res.map((condition: any) => ({ label: condition.cdn_name, value: condition.cdn_id }));
    console.log(res)
   });

  this.service.getData("category/data").subscribe(res => {
    this.categories = res.map((category: any) => ({ label: category.cm_name, value: category.cm_id }));
  });

  this.service.getData('status/data').subscribe( res=>{
    this.status= res.map((status: any) => ({ label: status.st_name, value: status.st_id }))
  });

  this.service.getData('item/pathtracker').subscribe( res=>{
    this.items= res.map((item: any) => ({ label: item.im_name, value: item.im_id }))
  });


   this.service.getData('workflow/dashboard').subscribe(res =>{
    this.tableData = res
    console.log(res)
   });

   this.service.getData('workflow/ticketmanagement').subscribe(res =>{
    this.tickets = res
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
    atoemail:  ['', [Validators.email, Validators.maxLength(255)]],
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
    }),
    tm_code:[''],
    tm_description: ['',Validators.required],
    tm_createdon: ['',Validators.required],
    tm_createdby: ['',Validators.required],
    tm_status: ['',Validators.required],
    tm_modifiedby: ['',Validators.required],

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
  }),
});
this.Editform2 = this.fb.group({
  tm_code: [''],
    tm_description: ['',Validators.required],
    tm_createdon: ['',Validators.required],
    tm_createdby: ['',Validators.required],
    tm_status: ['',Validators.required],
    tm_modifiedby: ['',Validators.required],

});
}

GetData(){

}
applyFilterGlobal($event:any, stringValue:any){
  this.myTable.filterGlobal(($event.target as HTMLInputElement).value, stringValue);
 }

codeEndpoint = 'wfcode'

  SavaData(Data:any){
    this.tableData.push(Data)
  }

  SavaData2(Data:any){
    this.tickets.push(Data)
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

onSubmit() {
  if (this.Addform.invalid) {
    this.Addform.markAllAsTouched(); // Mark all fields as touched
    return;
  }
  const stimeControl = this.Addform.get('stime');
  if (stimeControl && stimeControl.value) {
    const date = new Date(stimeControl.value);
    stimeControl.setValue(date.toISOString().split('T')[0]); // Format to yyyy-mm-dd
  }
  // Handle valid form submission
}
AddNewForm(){
  const formValue = this.Addform.value;
  if (formValue.stime) {
    const date = new Date(formValue.stime);
    formValue.stime = date.toISOString().split('T')[0]; // Format to yyyy-mm-dd
  }
  this.service.postData(this.endpoint,this.Addform.value).subscribe(
     res =>{
      this.SavaData(this.Addform.value)
      this.display = true;
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
  this.service.deleteDatas(this.endpoint, i.wfcode).subscribe(
     () =>{
      this.Editpopup = false
      console.log(i.wfcode);
      this.tableData.splice(i,1)
      this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Successfully', life: 4000 });
    },
    error => {
      this.messageService.add({ severity: 'error', summary: 'Not Deleted', detail: 'Failed', life: 4000 });
      console.log("Error");
    }

  )

}
//ticket management
ticketEndpoint = 'ticketcode'
code: any;
desc: any;
createdby: any;

// Update2(Update2:any){
//   const i = this.tickets.findIndex((user:any) => user.tm_code === this.selectedData.tm_code);
//   this.tickets[i] = Update2;
// }

openTicket() {
  this.displays = true;
  this.service.getData(this.ticketEndpoint).subscribe(
    res => {
      this.code = res.tm_code;
      const formattedDate = new Date(res.created_on).toISOString().split('T')[0];
      this.Addform.patchValue({
        tm_code: res.tm_code,
        tm_createdon: formattedDate,
      });
    },
    error => {
      console.error('Error fetching data:', error);
    }
  );
}

AddNewForm2(){
  const formValue = this.Addform.value;
  if (formValue.tm_createdon) {
    const date = new Date(formValue.tm_createdon);
    formValue.tm_createdon = date.toISOString().split('T')[0]; // Format to yyyy-mm-dd
  }
  this.service.postData(this.endpoint2,this.Addform.value).subscribe(
     res =>{
      this.SavaData2(this.Addform.value)
      this.displays = false;
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
editRow2(i: any) {
  this.Editpopup2 = true;
  this.selectedData = i;
  this.Editform2.patchValue(this.selectedData);
  this.code2 = this.selectedData.tm_code;
  console.log(this.Editform2.value);
}

EditForm2() {
  this.service.putData(this.endpoint2, this.Editform2.value).subscribe(
    update2 => {
      this.Update2(this.Editform2.value);
      this.loadItems();
      this.messageService.add({ severity: 'info', summary: 'Updated', detail: 'Successfully', life: 4000 });
    },
    error => {
      this.messageService.add({ severity: 'error', summary: 'Not Updated', detail: 'Failed', life: 4000 });
      console.log(this.Editform2.value);
    }
  );
}

Update2(update: any) {
  const i = this.tickets.findIndex((user: any) => user.tm_code === this.selectedData.tm_code);
  this.tickets[i] = update;
}
 deleteRow2(row:any){

  this.service.deleteData(this.endpoint2, row.tm_code).subscribe(
    () =>{
      this.Editpopup = false
      this.tableData.splice(row,1);
      this.loadItems();
      this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Successfully', life: 4000 });
    },
    error => {
      this.messageService.add({ severity: 'error', summary: 'Not Deleted', detail: 'Failed', life: 4000 });
      console.log("Error");
    }
  )

}
loadItems() {
  // Fetch the items from the server and assign them to the items array
  this.service.getData(this.endpoint2).subscribe(
    (data: any[]) => {
      this.tickets = data;
    },
    (error) => {
      console.error('Failed to load items', error);
    }
  );
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
