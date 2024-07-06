import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { SettingsService } from '../../service/settings.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';


@Component({
  selector: 'app-locationtype',
  templateUrl: './locationtype.component.html',
  styleUrls: ['./locationtype.component.scss'],
  providers: [DialogService,ConfirmationService]
})
export class LocationtypeComponent {
  
  pipe = new DatePipe('en-US');
  date=new Date();

  locationtype: any;

  // LocationTypeurl = 'assets/locationtype.json';

  form: any;
  editform: any;
  display: boolean = false;
  EditPopup: boolean = false;

  endpoint="businesslocations/locationtype"

  constructor(private service: SettingsService,private http: HttpClient,private messageService: MessageService, private confirmationService: ConfirmationService,private fb:FormBuilder,public dialogService: DialogService, public ref: DynamicDialogRef)
  {
    
  }

  ngOnInit(){
    this.service.getData(this.endpoint).subscribe(res =>{  
      this.locationtype = res
      console.log(res)
      });
      this.form=this.fb.group({
        lc_code:["",Validators.required],
        lc_name:["",Validators.required],
        lc_createdby:["",Validators.required],
        lc_createdon:["",Validators.required]
      });
      this.editform=this.fb.group({
        lc_code:["",Validators.required],
        lc_name:["",Validators.required],
        lc_createdby:["",Validators.required],
        lc_createdon:["",Validators.required]
      })
  }
  codeEndpoint = "locationcode"

  SavaData(Data:any){
    this.locationtype.push(Data)
  }
  
  selectedData: any = null
  Update(Update:any){
    const i = this.locationtype.findIndex((user:any) => user.lc_code === this.selectedData.lc_code);
    this.locationtype[i] = Update;
  }

  showDialog(){
    this.display = true;
  this.service.getData(this.codeEndpoint).subscribe(
    res =>{
    let code = res.lc_code
    this.form.get('lc_code')?.setValue(code)
  })
  }
  AddLocationForm(){
    this.service.postData(this.endpoint,this.form.value).subscribe(
      res =>{
        this.SavaData(this.form.value)
        this.display = false;
        this.form.reset()
        this.messageService.add({ severity: 'success', summary: 'Added', detail:'Sucessfully', life: 4000 });
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Not Added', detail: 'Failed', life: 4000 });
        console.log("Error")
      }
      )
  }

  EditLocationForm(){
    this.service.putData(this.endpoint, this.editform.value).subscribe(
      update =>{
        this.Update(this.editform.value)
        this.messageService.add({ severity: 'info', summary: 'Updated', detail:'Sucessfully', life: 4000 });
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Not Updated', detail: 'Failed', life: 4000 });
        console.log("Error")
      }
    )
  }


edit(i:any) {
  this.EditPopup= true;
  this.selectedData = i;
  this.editform.patchValue(this.selectedData)
}

delete(i: any) {
  this.service.deleteData(this.endpoint, i.lc_code).subscribe(
    () =>{
      this.EditPopup = false
      this.locationtype.splice(i,1)
      this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Successfully', life: 4000 });
    },
    error => {
      this.messageService.add({ severity: 'error', summary: 'Not Deleted', detail: 'Failed', life: 4000 });
      console.log("Error");
    }
  )

}
}
