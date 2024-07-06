import { Component } from '@angular/core';
import { SettingsService } from '../service/settings.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-conditions',
  templateUrl: './conditions.component.html',
  styleUrls: ['./conditions.component.scss']
})
export class ConditionsComponent {
conditions: any;

Addform: any;
Editform: any;

display: boolean = false;
Editpopup: boolean = false;
// url="assets/conditions.json"

endpoint="condition/data"

constructor(private service: SettingsService,private http: HttpClient,private fb:FormBuilder, private messageService: MessageService)
{
    // this.endpoint = "condition/data"
    this.service.getData(this.endpoint).subscribe(res =>{
      this.conditions = res
      console.log(res)
    })
 
}

ngOnInit(){
   this.Addform=this.fb.group({
     
      cdn_name:["",Validators.required],
      cdn_icon:[""],
      cdn_code:["",Validators.required],
      cdn_active:[false,Validators.required],
      cdn_createdby:["",Validators.required],
      cdn_createdon:["",Validators.required],
      cdn_modifiedon:["",Validators.required],
      cdn_modifiedby:["",Validators.required]
    })
    

   this.Editform=this.fb.group({
     
    cdn_name:["",Validators.required],
    cdn_icon:[""],
    cdn_code:["",Validators.required],
    cdn_active:[false,Validators.required],
    cdn_createdby:["",Validators.required],
    cdn_createdon:["",Validators.required],
    cdn_modifiedon:["",Validators.required],
    cdn_modifiedby:["",Validators.required]
  })
}
codeEndpoint = "cdncode"

SavaData(Data:any){
  this.conditions.push(Data)
}

selectedData: any = null
Update(Update:any){
  const i = this.conditions.findIndex((user:any) => user.cdn_code === this.selectedData.cdn_code);
  this.conditions[i] = Update;
}

showDialog(){
  this.display = true;
  this.service.getData(this.codeEndpoint).subscribe(
    res =>{
    let code = res.cdn_code
    this.Addform.get('cdn_code')?.setValue(code)
  })
}

 AddConditionForm(){
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

 EditConditionForm(){
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
  this.service.deleteData(this.endpoint, i.udusercode).subscribe(
    () =>{
      this.Editpopup = false
      this.conditions.splice(i,1)
      this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Successfully', life: 4000 });
    },
    error => {
      this.messageService.add({ severity: 'error', summary: 'Not Deleted', detail: 'Failed', life: 4000 });
      console.log("Error");
    }
  )
}
}
