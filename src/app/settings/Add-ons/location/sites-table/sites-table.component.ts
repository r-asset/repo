import { Component } from '@angular/core';
import { SettingsService } from '../../service/settings.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-sites-table',
  templateUrl: './sites-table.component.html',
  styleUrls: ['./sites-table.component.scss'],
  providers: [MessageService],
})
export class SitesTableComponent {
  sites: any;
  SitesUrl = "assets/site.json"
  form: any;
  editform: any;
  display: boolean = false;
  Editpopup: boolean = false;


  endpoint="businesslocations/site";  

  constructor(private service: SettingsService,private http: HttpClient,private fb:FormBuilder, private messageService: MessageService){}
  
  ngOnInit(){

   
   this.service.getData(this.endpoint).subscribe(res =>{  
     this.sites = res
     console.log(res)
    });

    this.form = this.fb.group({
    sc_code:["",Validators.required],
    sc_createdby:["",Validators.required],
    sc_createdon:["",Validators.required],
    sc_name:["",Validators.required],
    sc_notes:["",Validators.required],
    sc_modifiedby:["",Validators.required],
    sc_modifiedon:["",Validators.required],
  });

  this.editform = this.fb.group({
    sc_code:["",Validators.required],
    sc_createdby:["",Validators.required],
    sc_createdon:["",Validators.required],
    sc_name:["",Validators.required],
    sc_notes:["",Validators.required],
    sc_modifiedby:["",Validators.required],
    sc_modifiedon:["",Validators.required],
  });
 
  }
  codeEndpoint = "sitecode"

  SavaData(Data:any){
    this.sites.push(Data)
  }
  
  selectedData: any = null
  Update(Update:any){
    const i = this.sites.findIndex((user:any) => user.sc_code === this.selectedData.sc_code);
    this.sites[i] = Update;
  }
  showDialog(){
    this.display = true;
    this.service.getData(this.codeEndpoint).subscribe(
      res =>{
      let code = res.sc_code
      this.form.get('sc_code')?.setValue(code)
    })
  }
  AddSitesForm(){
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
  EditSitesForm(){
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
        this.sites.splice(i,1)
        this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Successfully', life: 4000 });
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Not Deleted', detail: 'Failed', life: 4000 });
        console.log("Error");
      }
    )
  
  }
  
}
