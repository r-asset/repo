import { Component } from '@angular/core';
import { SettingsService } from '../service/settings.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent {
category: any;

// url="assets/category.json"

Addform: any;
Editform: any;

display: boolean = false;
Editpopup: boolean = false;

endpoint ='category/data'
constructor(private service: SettingsService,private http: HttpClient,private fb:FormBuilder, private messageService: MessageService){}

ngOnInit(){
  // this.endpoint = "category/data"
   this.service.getData(this.endpoint).subscribe(res =>{
     this.category = res
     console.log(res)
   });
   this.Addform=this.fb.group({
    cm_code:["",Validators.required],
    cm_name:["",Validators.required],
    
    cm_active:[false,Validators.required],
    // cm_createdby:["",Validators.required],
    cm_createdon:["",Validators.required],
    // cm_special:[false,Validators.required],
    cm_notes:["",Validators.required],
    cm_maintenance_parameters: [""],
    // cm_modifiedon:[""],
    // cm_modifiedby:[""]

  });
  this.Editform=this.fb.group({
    cm_code:["",Validators.required],
    cm_name:["",Validators.required],
    
    cm_active:[false,Validators.required],
    // cm_createdby:["",Validators.required],
    cm_createdon:["",Validators.required],
    // cm_special:[false,Validators.required],
    cm_notes:["",Validators.required],
    cm_maintenance_parameters: [""],
    // cm_modifiedon:[""],
    // cm_modifiedby:[""]

  })
}
codeEndpoint ='cccode'

SavaData(Data:any){
  this.category.push(Data)
}

selectedData: any = null
Update(Update:any){
  const i = this.category.findIndex((user:any) => user.cm_code === this.selectedData.cm_code);
  this.category[i] = Update;
}

showDialog(){
  this.display = true;
  this.service.getData(this.codeEndpoint).subscribe(
    res =>{
    let code = res.cm_code
    this.Addform.get('cm_code')?.setValue(code)
  })
}

 AddCategoryForm(){
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

 EditCategoryForm(){
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
      this.category.splice(i,1)
      this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Successfully', life: 4000 });
    },
    error => {
      this.messageService.add({ severity: 'error', summary: 'Not Deleted', detail: 'Failed', life: 4000 });
      console.log("Error");
    }
  )

}
}
