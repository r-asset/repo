import { Component } from '@angular/core';
import { SettingsService } from '../service/settings.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-plant-management',
  templateUrl: './plant-management.component.html',
  styleUrls: ['./plant-management.component.scss']
})
export class PlantManagementComponent {
  plantManagement: any ;

  plantManagementUrl="assets/plant-management.json"

  Addform: any;
  Editform: any
submitted = '';
  display: boolean = false;
  Editpopup: boolean = false;
  endpoint = "plantmanagement/data"

  constructor(private service: SettingsService,private http: HttpClient,private fb:FormBuilder, private messageService: MessageService){}

  ngOnInit(){
  
     this.service.getData(this.endpoint).subscribe(res =>{
       this.plantManagement = res
       console.log(res)
     })
      this.Addform = this.fb.group({
      pmcode: ['', Validators.required],
      pmmaxusers: ['', Validators.required],
      pmcompanyname: ['', Validators.required],
      pmmaxsites: ['', Validators.required],
      pmmaxarea: ['', Validators.required],
      pmmaxzone: ['', Validators.required],
      pmmaxgateway: ['', Validators.required],
      pmmaxbeacons: ['', Validators.required]
    })
    this.Editform = this.fb.group({
      pmcode: ['', Validators.required],
      pmmaxusers: ['', Validators.required],
      pmcompanyname: ['', Validators.required],
      pmmaxsites: ['', Validators.required],
      pmmaxarea: ['', Validators.required],
      pmmaxzone: ['', Validators.required],
      pmmaxgateway: ['', Validators.required],
      pmmaxbeacons: ['', Validators.required]
    }) ;
  }
  codeEndpoint = 'pmcode'

  SavaData(Data:any){
    this.plantManagement.push(Data)
  }
  
  selectedData: any = null
  
  Update(Update:any){
    const i = this.plantManagement.findIndex((user:any) => user.pmcode === this.selectedData.pmcode);
    this.plantManagement[i] = Update;
  }
  
  showDialog(){
    this.display = true;
    this.service.getData(this.codeEndpoint).subscribe(
      res =>{
      let code = res.pmcode
      this.Addform.get('pmcode')?.setValue(code)
    })
  }
  
  AddPlantForm(){
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
  editPlantForm(){
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
        this.plantManagement.splice(i,1)
        this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Successfully', life: 4000 });
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Not Deleted', detail: 'Failed', life: 4000 });
        console.log("Error");
      }
    )
  
  }
}
