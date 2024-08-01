import { Component } from '@angular/core';
import { SettingsService } from '../service/settings.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent {
status: any;
loading: boolean = true;

// url = 'assets/status.json';

Addform: any
Editform: any

display: boolean = false;
Editpopup: boolean = false;

endpoint = "status/data"
date = new Date();
pipe= new DatePipe("en-US")

constructor(private service: SettingsService,private http: HttpClient,private fb:FormBuilder, private messageService: MessageService,private cookie:CookieService){}

  ngOnInit(){
    // this.loading=true
    this.service.getData(this.endpoint).subscribe(res =>{
      this.status = res
      // this.loading=false

     });
     this.Addform=this.fb.group({
      st_code:["",Validators.required],
      st_name:["",Validators.required],
      st_active:[null,Validators.required],
      st_createdby:["",Validators.required],
      st_createdon:["",Validators.required],
      st_modifiedby:["",Validators.required],
      st_modifiedon:["",Validators.required]
    });
    this.Editform=this.fb.group({
      st_code:["",Validators.required],
      st_name:["",Validators.required],
      st_active:[null,Validators.required],
      st_createdby:["",Validators.required],
      st_createdon:["",Validators.required],
      st_modifiedby:["",Validators.required],
      st_modifiedon:["",Validators.required]
    });
  }

  codeEndpoint = "stcode"

SavaData(Data:any){
  this.status.push(Data)
}


selectedData: any = null
Update(Update:any){
  const i = this.status.findIndex((user:any) => user.st_code === this.selectedData.st_code);
  this.status[i] = Update;
}

showDialog(){
  this.display = true;
  this.service.getData(this.codeEndpoint).subscribe(
    res =>{
    let code = res.st_code
    this.Addform.get('st_code')?.setValue(code)
    let username=this.cookie.get('username')
    let modifiedon=this.pipe.transform(this.date, 'yyyy-MM-dd');
    this.Addform.controls['st_createdby'].setValue(username);
    this.Addform.controls['st_createdon'].setValue(modifiedon);
    this.Addform.controls['st_modifiedby'].setValue(username);
    this.Addform.controls['st_modifiedon'].setValue(modifiedon);
  })
}

   AddStatusForm(){
    this.service.postData(this.endpoint,this.Addform.value).subscribe({
      next: res =>{
        this.SavaData(this.Addform.value)
        this.display = false;
        this.Addform.reset()
        this.messageService.add({ severity: 'success', summary: 'Added', detail:'Sucessfully', life: 4000 });
      },
      error: error => {
        this.messageService.add({ severity: 'error', summary: 'Not Added', detail: 'Failed', life: 4000 });
        console.log("Error")
      }
    }
      )

   }

   EditStatusForm(){
    this.service.putData(this.endpoint, this.Editform.value).subscribe({
      next: update =>{
        this.Update(this.Editform.value)
        this.messageService.add({ severity: 'info', summary: 'Updated', detail:'Sucessfully', life: 4000 });
      },
      error: error => {
        this.messageService.add({ severity: 'error', summary: 'Not Updated', detail: 'Failed', life: 4000 });
        console.log("Error")
      }
    }
    )
   }
   editRow(i: any){
    this.Editpopup= true;
    this.selectedData = i;
    this.Editform.patchValue(this.selectedData)
   }
   deleteRow(i: any) {
    const code = i.st_code; // Assuming `i` is an object containing `st_code`
    this.service.deleteData(this.endpoint, code).subscribe(
      {
      next: () => {
        this.Editpopup = false;
        const index = this.status.findIndex((status: any) => status.st_code === code);
        if (index > -1) {
          this.status.splice(index, 1);
        }
        this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Successfully', life: 4000 });
      },
      error: error => {
        this.messageService.add({ severity: 'error', summary: 'Not Deleted', detail: 'Failed', life: 4000 });
        console.log("Error", error);
      }
    }
    );
  }

}
