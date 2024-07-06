import { Component } from '@angular/core';
import { SettingsService } from '../service/settings.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent {
userManagement: any;
Addform: any;
Editform: any

value!: string;

display: boolean = false;
Editpopup: boolean = false;

endpoint="usermanagement/data"

constructor(private service: SettingsService,private http: HttpClient,private fb:FormBuilder, private messageService: MessageService){}

ngOnInit(){
  // this.endpoint = "usermanagement/data"
   this.service.getData(this.endpoint).subscribe(res =>{
     this.userManagement = res
     console.log(res)
   });
   this.Addform= this.fb.group({
    udusercode  : ["",Validators.required],
    udusername  : ["", Validators.required],
    udfirstName : ["", Validators.required],
    udlastName  : ["", Validators.required],
    udaddress1  : ["", Validators.required],
    udaddress2  : ["", Validators.required],
    udemail     : ["", Validators.required],
    udtype      : ["",Validators.required],
    udpassword  : ["",Validators.required],
    udconfirmpassword:["",Validators.required],
    udlanguage  : ["",Validators.required]
 });
 this.Editform= this.fb.group({
  udusercode  : ["",Validators.required],
  udusername  : ["", Validators.required],
  udfirstName : ["", Validators.required],
  udlastName  : ["", Validators.required],
  udaddress1  : ["", Validators.required],
  udaddress2  : ["", Validators.required],
  udemail     : ["", Validators.required],
  udtype      : ["",Validators.required],
  udpassword  : ["",Validators.required],
  udconfirmpassword:["",Validators.required],
  udlanguage  : ["",Validators.required]
});
 
}

codeEndpoint = "uscode"

SavaData(Data:any){
  this.userManagement.push(Data)
}

selectedData: any = null
Update(Update:any){
  const i = this.userManagement.findIndex((user:any) => user.udusercode === this.selectedData.udusercode);
  this.userManagement[i] = Update;
}

showDialog(){
  this.display = true;
  this.service.getData(this.codeEndpoint).subscribe(
    res =>{
    let code = res.udusercode
    this.Addform.get('udusercode')?.setValue(code)
  })
}

AddUserForm(){
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
EditUserForm(){
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


editRow(i:any){
  this.Editpopup= true;
  this.selectedData = i;
  this.Editform.patchValue(this.selectedData)
}

deleteRow(i:any){
  this.service.deleteData(this.endpoint, i.udusercode).subscribe(
    () =>{
      this.Editpopup = false
      this.userManagement.splice(i,1)
      this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Successfully', life: 4000 });
    },
    error => {
      this.messageService.add({ severity: 'error', summary: 'Not Deleted', detail: 'Failed', life: 4000 });
      console.log("Error");
    }
  )

}
}
