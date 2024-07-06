import { Component } from '@angular/core';
import { SettingsService } from '../service/settings.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-reader-management',
  templateUrl: './reader-management.component.html',
  styleUrls: ['./reader-management.component.scss']
})
export class ReaderManagementComponent {
  readerManagement: any;
  Addform: any
  Editform: any;

  display: boolean=false;
  EditPopup: boolean=false;
  endpoint: any;
 
  // url="assets/reader-management.json"

  constructor(private service: SettingsService,private http: HttpClient,private fb:FormBuilder, private messageService: MessageService){}

  ngOnInit(){
    this.endpoint = "reader/data"
     this.service.getData(this.endpoint).subscribe(res =>{
       this.readerManagement = res
       console.log(res)
     });
     
     this.Addform=this.fb.group({
       bg_statusid:[""],
       bg_code:["",Validators.required],
       bg_manufacturer:["",Validators.required],
       bg_webkey:["",Validators.required],
       bg_conditionid:[""],
       bg_zoneid:[""],
       bg_gatewayname:["",Validators.required],
       bg_macaddress:["",Validators.required],
       bg_createdon:["",Validators.required],
       bg_createdby:["",Validators.required],
       bg_modifiedon:["",Validators.required],
       bg_modifiedby:["",Validators.required],
       bg_lastupdt:["",Validators.required],
       bg_inorout:["",Validators.required]
     });

     this.Editform=this.fb.group({
      bg_statusid:[""],
      bg_code:["",Validators.required],
      bg_manufacturer:["",Validators.required],
      bg_webkey:["",Validators.required],
      bg_conditionid:[""],
      bg_zoneid:[""],
      bg_gatewayname:["",Validators.required],
      bg_macaddress:["",Validators.required],
      bg_createdon:["",Validators.required],
      bg_createdby:["",Validators.required],
      bg_modifiedon:["",Validators.required],
      bg_modifiedby:["",Validators.required],
      bg_lastupdt:["",Validators.required],
      bg_inorout:["",Validators.required]
    })
  }
  codeEndpoint ="rdcode"

  SavaData(Data:any){
    this.readerManagement.push(Data)
  }
  
  selectedData: any = null
  Update(Update:any){
    const i = this.readerManagement.findIndex((user:any) => user.rdrcode === this.selectedData.rdrcode);
    this.readerManagement[i] = Update;
  }

  showDialog(){
    this.display = true;
    this.service.getData(this.codeEndpoint).subscribe(
      res =>{
      let code = res.rdrcode
      this.Addform.get('rdrcode')?.setValue(code)
    })
  }
  hideDialog(){
    this.display = false;
    this.EditPopup = false
  }
  editRow(i:any){
    this.EditPopup= true;
    this.selectedData = i;
    this.Editform.patchValue(this.selectedData)
  }
  deleteRow(i:any){
    this.service.deleteData(this.endpoint, i.rdrcode).subscribe(
      () =>{
        this.EditPopup = false
        this.readerManagement.splice(i,1)
        this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Successfully', life: 4000 });
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Not Deleted', detail: 'Failed', life: 4000 });
        console.log("Error");
      }
    )
  }
  AddForm(){
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
}
