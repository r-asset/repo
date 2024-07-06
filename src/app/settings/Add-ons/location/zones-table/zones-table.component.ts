import { Component } from '@angular/core';
import { SettingsService } from '../../service/settings.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-zones-table',
  templateUrl: './zones-table.component.html',
  styleUrls: ['./zones-table.component.scss']
})
export class ZonesTableComponent {

  zones: any;

  Editpopup: boolean = false;
  display: boolean = false;

  ZonesUrl = "assets/zone.json"

  Addform: any
  Editform: any;
  endpoint = "businesslocations/zone"

  sites: any;
  
  constructor(private service: SettingsService,private http: HttpClient,private fb:FormBuilder, private messageService: MessageService){}

  
  ngOnInit(){

    this.Addform=this.fb.group({
      zn_code:["",Validators.required],
      zn_name:["",Validators.required],
      zn_definition:["",Validators.required],
      zn_createdon:["",Validators.required],
      zn_createdby:["",Validators.required],
      zn_areaid:["",Validators.required],
      zn_modifiedby:["",Validators.required],
      zn_modifiedon:["",Validators.required],

    })
    this.Editform=this.fb.group({
      zn_code:["",Validators.required],
      zn_name:["",Validators.required],
      zn_definition:["",Validators.required],
      zn_createdon:["",Validators.required],
      zn_createdby:["",Validators.required],
      zn_areaid:["",Validators.required],
      zn_modifiedby:["",Validators.required],
      zn_modifiedon:["",Validators.required],

    })
 
   this.service.getData(this.endpoint).subscribe(res =>{  
     this.zones = res
     console.log(res)
    });
    let sitename:string[]=[]
    this.service.getData("businesslocations/site").subscribe(res =>{  
      this.sites = res
      for(const res of this.sites){
        sitename.push(res.sc_name)
      }
      // console.log(sitename)  
      this.sites = sitename
  });
 }
 codeEndpoint = "zonecode"
 SavaData(Data:any){
  this.zones.push(Data)
}

selectedData: any = null
Update(Update:any){
  const i = this.zones.findIndex((user:any) => user.zn_code === this.selectedData.zn_code);
  this.zones[i] = Update;
}

showDialog(){
  this.display = true;
  this.service.getData(this.codeEndpoint).subscribe(
    res =>{
    let code = res.zn_code
    this.Addform.get('zn_code')?.setValue(code)
  })
}


 AddZoneForm(){
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

 EditZoneForm(){
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
      this.zones.splice(i,1)
      this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Successfully', life: 4000 });
    },
    error => {
      this.messageService.add({ severity: 'error', summary: 'Not Deleted', detail: 'Failed', life: 4000 });
      console.log("Error");
    }
  )
}
}
