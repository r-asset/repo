import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { SettingsService } from '../../service/settings.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-areas-table',
  templateUrl: './areas-table.component.html',
  styleUrls: ['./areas-table.component.scss']
})
export class AreasTableComponent {

  areas: any;
  // AreasUrl = "assets/area.json"

  display: boolean = false;
  Editpopup: boolean = false;
  Addform: any;
  editform: any;

  endpoint = "businesslocations/area"

  sites: any;

  constructor(private service: SettingsService,private http: HttpClient,private fb:FormBuilder, private messageService: MessageService){}

  ngOnInit(){
    this.Addform=this.fb.group({
      ar_code:["",Validators.required],
      ar_name:["",Validators.required],
      ar_createdby:["",Validators.required],
      ar_createdon:["",Validators.required],
      ar_sitekey:["",Validators.required],
      ar_country:["",Validators.required],
      ar_floor:["",Validators.required],
      ar_image:["",Validators.required],
      ar_latitude:["",Validators.required],
      ar_longitude:["",Validators.required],
      ar_city:["",Validators.required],
      ar_state:["",Validators.required],
      ar_zipcode:["",Validators.required],
      ar_relatedzones:["",Validators.required],
 
    });
   
   this.service.getData(this.endpoint).subscribe(res =>{  
     this.areas = res
     console.log(res)
    });

    this.editform=this.fb.group({
      ar_code:["",Validators.required],
      ar_name:["",Validators.required],
      ar_createdby:["",Validators.required],
      ar_createdon:["",Validators.required],
      ar_sitekey:["",Validators.required],
      ar_country:["",Validators.required],
      ar_floor:["",Validators.required],
      ar_image:["",Validators.required],
      ar_latitude:["",Validators.required],
      ar_longitude:["",Validators.required],
      ar_city:["",Validators.required],
      ar_state:["",Validators.required],
      ar_zipcode:["",Validators.required],
      ar_relatedzones:["",Validators.required],
 
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
  
  codeEndpoint = "areacode"

  SavaData(Data:any){
    this.areas.push(Data)
  }
  
  selectedData: any = null
  Update(Update:any){
    const i = this.areas.findIndex((user:any) => user.ar_code === this.selectedData.ar_code);
    this.areas[i] = Update;
  }
  
  showDialog(){
    this.display = true;
    this.service.getData(this.codeEndpoint).subscribe(
      res =>{
      let code = res.ar_code
      this.Addform.get('ar_code')?.setValue(code)
    })
  }
  AddAreaForm(){
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
  EditAreaForm(){
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
  editRow(i:any){
    this.Editpopup= true;
    this.selectedData = i;
    this.editform.patchValue(this.selectedData)
  }
  deleteRow(i:any){
    this.service.deleteData(this.endpoint, i.udusercode).subscribe(
      () =>{
        this.Editpopup = false
        this.areas.splice(i,1)
        this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Successfully', life: 4000 });
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Not Deleted', detail: 'Failed', life: 4000 });
        console.log("Error");
      }
    )
  }
 
}
