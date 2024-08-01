import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { ItemManagementService } from './Add-ons/service/item-management.service';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NewItemPopupComponent } from './Add-ons/new-item-popup/new-item-popup.component';
import { Table } from 'primeng/table';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { SettingsService } from '../settings/Add-ons/service/settings.service';
import * as XLSX from "xlsx-js-style";
// import * as xlsx from "xlsx";
import { faArrowRotateForward, faCheck, faChevronCircleDown, faCloudArrowUp, faPenToSquare, faPlus, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { CookieService } from 'ngx-cookie-service';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import {  faTemperatureHigh } from '@fortawesome/free-solid-svg-icons';
import { faBatteryThreeQuarters } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-item-management',
  templateUrl: './item-management.component.html',
  styleUrls: ['./item-management.component.scss'],
  providers: [DialogService, MessageService]
})
export class ItemManagementComponent {
  @ViewChild('dt') dt!: ElementRef;
  @ViewChild('dt', { static: false }) dtt!: Table;

  temperature = faTemperatureHigh;
  battery = faBatteryThreeQuarters;

  DataView!: any[];
  DataViewtype: any;

  check = faCheck
  cross = faXmark
  down = faChevronCircleDown
  reset = faArrowRotateForward
  add = faPlus
  del = faTrash
  edit = faPenToSquare
  cloud = faCloudArrowUp

  ModalType = 'ADD'
  defaultValue: string = '';

  public file: File | null = null;
  uploadInProgress: boolean = false;
  uploadProgress: number = 0;

  selectedItem: any = [];
  tableData: any;
  loading: boolean = true;
  ref!: DynamicDialogRef;
  showtable:boolean=true;

  public SelectedCategory: string = ''
  public SelectedStatus: string = ''
  public SelectedCurrLoc: string = ''
  public SelectedHomeLoc: string = ''
  public SelectedCondi: string = ''

  // url = 'assets/item-data.json';
  categories: any;
  conditions: any;
  status: any;
  locations: any;

  MacAddress: any=[];
  Addform: any;
  item : any;
  itemDialog: boolean = false;
  submitted: boolean = false;

  endpoint ='item/data'
  Editform: any;
  Editpopup: any;

  actionRow: MenuItem[] | any;

  constructor(private settingservice: SettingsService,private service: ItemManagementService,public dialogService: DialogService, public messageService: MessageService,private http: HttpClient,private fb: FormBuilder, private Cookie: CookieService, private confirmation: ConfirmationService) {


    this.showtable=true
    this.loading=true
    this.settingservice.getData("category/data").subscribe(res=>{
      this.categories=res

    })

    this.settingservice.getData("condition/data").subscribe(res=>{
      this.conditions=res

    })
    this.settingservice.getData("status/data").subscribe(res=>{
      this.status=res

    })
    this.settingservice.getData("businesslocations/zone").subscribe(res=>{
      this.locations=res

    })
    this.service.getData("item/data").subscribe(res =>{
      this.tableData = res.item_data
      this.loading=false
      this.showtable=false
      console.log(this.tableData)
    });

    this.service.getData('').subscribe(res =>{
      this.categories=res.category
      this.conditions=res.condition
      this.status=res.status
      this.locations=res.location
    });

    this.Addform = this.fb.group({
      im_code           : [''],
      bcn_code          : [''],
      im_name           : ['', Validators.required],
      im_active         : [''],
      im_assetcode      : ['', Validators.required],
      // im_beaconid       : ['', Validators.required],
      im_categoryid     : ['', Validators.required],
      im_conditionid    : ['', Validators.required],
      im_statusid       : ['', Validators.required],
      im_areaid         : [''],
      im_siteid         : [''],

      im_temperature    : [''],
      im_companyid      : [''],
      br_name           :  'Robis',
      im_btry_prcnt     : [''],
      im_zonecurrentid  : ['', Validators.required],
      im_zonehomeid     : ['', Validators.required],
      br_itemdesc       : ['', Validators.required],
      br_lastservice    : ['', Validators.required],
      wr_expireson      : ['', Validators.required],
      im_purchaseDate      : [''],
      im_purchaseFrom      : [''],
      im_warrantyPeriod    : [''],
      im_purchaseCost      : [''],
      im_replacementCost   : [''],
      im_purchaseOrder     : [''],
      br_ponumber          : '12345',
      im_model             : 'RT',
      im_lastAuditDate     : [''],
      im_auditBy           : [''],
      im_nextaudit         : [''],
      im_assignto          : [''],
      im_sendmail          : [''],
      im_auditreport       : [''],
      im_createdon         : [''],
      im_createdby         : [''],
      im_modifiedon      : [''],
      im_modifiedby        : [''],
      // im_lastcapturedon   : [''],
      im_firstupdate    : [''],
      im_lastupdated    : [''],
      im_macadd            : [''],
      im_liveimage : new FormControl('',),

    });


  }
  ngOnInit() :void {
    this.Addform.reset();
    this.GetData()
    WebcamUtil.getAvailableVideoInputs().then(
      (mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      }
    );
  }

  GetData(){

  }

  ngOnChanges():void{
    if(this.selectedItem){
      this.Addform.patchValue(this.selectedItem)
      this.ModalType = 'UPDATE'
    }
    else{
      this.Addform.reset();
      this.ModalType = 'ADD'
    }
  }

  @HostListener('change', ['$event.target.files']) emitFiles( event: FileList ) {
    const file = event && event.item(0);
    this.file = file;
  }


  codeEndpoint = 'itemcode'


  selectedData: any = null
  itemcode : any
  beaconcode : any

  openNew(){
  //   this.itemDialog = true;
  // this.service.getdata(this.codeEndpoint).subscribe(
  //   res =>{
  //   let code = res.im_code
  //   this.Addform.get('im_code')?.setValue(code)
  // })

  this.itemDialog=true
    this.selectedData = null
    this.ModalType = 'ADD'
    this.service.getData(this.codeEndpoint).subscribe({
      next: res => {

        this.itemcode = res
        this.beaconcode = res
      },
      error: error => {
        this.closeModal()
        this.messageService.add({ severity: 'error', summary: 'Code Not Generated', detail: 'Failed', life: 5000 });
        console.log("Error")
      }
    }
    )
    this.Addform.controls['im_createdby'].setValue(this.Cookie.get('Username'))
    this.Addform.controls['im_modifiedby'].setValue(this.Cookie.get('Username'))
  }
  // AddNewForm(){
  //   this.service.postData(this.endpoint,this.Addform.value).subscribe(
  //     res =>{
  //       this.SavaData(this.Addform.value)
  //       this.itemDialog = false;
  //       this.Addform.reset()
  //       this.messageService.add({ severity: 'success', summary: 'Added', detail:'Sucessfully', life: 4000 });
  //     },
  //     error => {
  //       this.messageService.add({ severity: 'error', summary: 'Not Added', detail: 'Failed', life: 4000 });
  //       console.log("Error")
  //     }
  //     )
  //     console.log('itemData',this.Addform.value)
  // }

  applyFilterGlobal($event:any, stringValue:any){
    this.dtt.filterGlobal(($event.target as HTMLInputElement).value, stringValue);
  }
  editItems(i: any){
    // this.Editpopup= true;
    // this.selectedData = i;
    // this.Editform.patchValue(this.selectedData)
    this.selectedData = i;
    this.itemDialog = true;
    this.Addform.patchValue(this.selectedData)
    this.ModalType = 'UPDATE'
    this.Addform.controls['im_createdby'].setValue(this.Cookie.get('Username'))
    this.Addform.controls['im_modifiedby'].setValue(this.Cookie.get('Username'))
   }

   SavaData(Data:any){
    this.tableData.push(Data)
  }

  Update(Update:any){
    const i = this.tableData.findIndex((user:any) => user.im_code === this.selectedData.im_code);
    this.tableData[i] = Update;
  }

  closeModal(){
    this.Addform.reset();
    this.file = null
    this.selectedImage = '../../../assets/no-image.jpg';
    this.itemDialog=false
  }


  //  EditForm(){
  //   this.service.putData(this.endpoint, this.Editform.value).subscribe(
  //     update =>{
  //       this.Update(this.Editform.value)
  //       this.messageService.add({ severity: 'info', summary: 'Updated', detail:'Sucessfully', life: 4000 });
  //     },
  //     error => {
  //       this.messageService.add({ severity: 'error', summary: 'Not Updated', detail: 'Failed', life: 4000 });
  //       console.log("Error")
  //     }
  //   )
  //  }
  //  deleteRow(i:any){
  //   this.service.deleteData(this.endpoint, i.wfcode).subscribe(
  //     () =>{
  //       this.Editpopup = false
  //       this.tableData.splice(i,1)
  //       this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Successfully Deleted', life: 4000 });
  //     },
  //     error => {
  //       this.messageService.add({ severity: 'error', summary: 'Not Deleted', detail: 'Failed', life: 4000 });
  //       console.log("Error");
  //     }
  //   )

  // }

  ngAfterViewInit(){

  }

  private trigger: any = new Subject();
  public webcamImage!: any;
  private nextWebcam: any = new Subject();
  captureImage  = '';
  fileName = '';
  public showWebcam = false;
  // url = '';
  imageData: any;

  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId!: string;
  public errors: WebcamInitError[] = [];
  DisplayCamModal = false
  public capturedImageData: string | null = null;

  captureImg(){
    this.DisplayCamModal = true
    this.showWebcam = true;
  }

  closeWebcamModal(){
    this.DisplayCamModal = false
    this.showWebcam = false
  }

  // Capture Image
  public takeSnapshot(): void {
    this.trigger.next();
  }

  // ON OFF Camera
  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  // Switch to next camera device if avaiable
  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public OkSnapshot(webcamImage: WebcamImage): void {
    this.DisplayCamModal = false
    this.imageData = webcamImage!.imageAsDataUrl
    this.selectedImage = this.imageData
    const byteString = atob(this.imageData.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: 'image/jpeg' });

    // Create a File object from the Blob
    this.file = new File([blob], 'captured_image.jpg', { type: 'image/jpeg' });
    this.webcamImage = undefined;
    this.showWebcam = false
  }

  showNextCamera() {
    if (this.showWebcam) {
      this.showNextWebcam(true);
    }
  }

  public retakeSnapshot(): void {
    this.webcamImage = undefined;
  }

  public takePicture(webcamImage: WebcamImage): void {
    // console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
  }

  public cameraWasSwitched(deviceId: string): void {
    // console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get initObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  deleteImg(){
    this.imageData = null
    this.selectedImage = '../../../assets/no-image.jpg';
    this.Addform.controls['im_liveimage'].reset()
  }

  onSubmit() {
    this.Addform.controls['im_code'].setValue(this.itemcode.im_code);
    this.Addform.controls['bcn_code'].setValue(this.beaconcode.bcn_code);

    console.log(this.Addform.value)
    if(this.ModalType==='UPDATE'){
      this.OnUpdate();
    }
    else{
      this.OnSave(this.Addform.value);
    }
  }

  OnSave(form:any){

    if (this.Addform.valid) {
      this.service.postData(this.endpoint, form).subscribe({
        next: response =>{

          this.SavaData(form)
          this.Addform.reset();
          this.closeModal();
          this.messageService.add({ severity: 'success', summary: 'Added', detail:'Sucessfully', life: 4000 });
        },
        error: error => {

          this.messageService.add({ severity: 'error', summary: 'Not Added', detail: 'Failed', life: 4000 });
          console.log("Error")
        }
      }
      )
    }
  }

  selected: any = [];
  DisplayModal=false

  OnUpdate(){
    if(this.selected){

      this.service.putData(this.endpoint, this.Addform.value).subscribe({
        next: update =>{

          this.Update(this.Addform.value)
          this.closeModal();
          this.messageService.add({ severity: 'info', summary: 'Updated', detail:'Sucessfully', life: 4000 });
        },
        error: error => {

          this.messageService.add({ severity: 'error', summary: 'Not Updated', detail: 'Failed', life: 4000 });
          console.log("Error")
        }
      }
      )
    }
  }

  deleteselectedRows() {
    this.confirmation.confirm({
      message: 'Sure, you want to delete the selected Item?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        this.DeleteData();
      }
    });
  }

  DeleteData(){
    for (let i = 0; i < this.selected.length; i++)
    {
      const code = this.selected[i].im_code;
      // console.log(id)
      this.service.deleteData(this.endpoint, code).subscribe({
        next: () => {
          const index = this.tableData.findIndex((j:any) => j.im_code === code);
          if (index !== -1) {

            this.tableData.splice(index, 1);
            this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Successfully', life: 4000 });
          }
        },
        error: error => {
          this.messageService.add({ severity: 'error', summary: 'Not Deleted', detail: 'Failed', life: 4000 });
          console.log("Error");
        }
      }
      );
    }
    this.selected = [];
  }

  selectedImage: string = '../../../assets/no-image.jpg';
  selectedImageName: string | null = null;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.readImageFile(file);
    } else {
      this.selectedImageName = null;
      this.selectedImage = '../../../assets/no-image.svg';
    }
  }

  readImageFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.selectedImage = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  upload() {
    if (!this.file) return;
    this.uploadInProgress = true;
    this.service.uploadImage(this.file).subscribe(
      res => {
        // Upload completed
        this.uploadInProgress = false;
        this.messageService.add({ severity: 'error', summary: 'Image', detail:'Uploaded Failed', life: 4000 });
      },
      error => {
        // Handle error during upload
        this.messageService.add({ severity: 'success', summary: 'Image', detail:'Uploaded Sucessfully', life: 4000 });
        this.uploadInProgress = false;
      },
    )
  }


  exportXls(){

   const table = document.getElementById('item');

   // Check if the table element exists
   if (!table) {
     console.error("The table element with ID 'dom' does not exist.");
     return;
   }

   const wb: XLSX.WorkBook = XLSX.utils.book_new();
   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);

   const headerRow = table.querySelector('thead tr');

   const merge = [
      { s: { r: 1, c: 1 }, e: { r: 2, c: 12 } },
    ];

    ws['!merges'] = merge;
    XLSX.utils.sheet_add_aoa(ws, [['Item Management Details']], { origin: 'B2' });

   // Leave 2 empty rows
   XLSX.utils.sheet_add_aoa(ws, [['']], { origin: 'B3' });
   XLSX.utils.sheet_add_aoa(ws, [['']], { origin: 'B4' });

   // Add the table header (th) row data to the worksheet
   if (headerRow) {
     const headerData = [];
     const headerCells = headerRow.getElementsByTagName('th');
     for (let i = 1; i < headerCells.length - 1; i++) {
       headerData.push(headerCells[i].textContent);
     }
     XLSX.utils.sheet_add_aoa(ws, [headerData], { origin: 'B5' });
   }

 // td data's
   const tableData = [];
   const rows = table.querySelectorAll('tbody tr');
   for (let i = 0; i < rows.length; i++) {
    const rowData = [];
    const cells = rows[i].getElementsByTagName('td');
    for (let j = 1; j < cells.length - 1; j++) {
      // Skip the first and last cells in each row
      rowData.push(cells[j].textContent);
     }
     tableData.push(rowData);
   }

   // Add your data to the worksheet below the header
   XLSX.utils.sheet_add_aoa(ws, tableData, { origin: 'B6' });

   for (var i in ws) {
    if (typeof ws[i] != 'object') continue;
      let cell = XLSX.utils.decode_cell(i);

      ws[i].s = {
            font: {
              italic: true
            },
            alignment: {
              vertical: 'center',
              horizontal: 'center',
            },
            border: {
              right: {style: 'thin'},
              left: {style: 'thin'},
              top : {style: 'thin'},
              bottom: {style: 'thin'},
            },
          }
          if (cell.r == 1) {
            ws[i].s = {
              font: {
                // italic: true,
                sz:'15',
                color:{ rgb: 'FF0000' },
              },
              alignment: {
                vertical: 'center',
                horizontal: 'center',
              },

            }
          }

      // heading row
    if (cell.r == 4) {
          ws[i].s = {
            font: {
              bold:true,
              color:{ rgb: 'fffcfd' },
            },
            alignment: {
              vertical: 'center',
              horizontal: 'center',
            },
            border: {
              right: {style: 'thin'},
              left: {style: 'thin'},
              top : {style: 'thin'},
              bottom: {style: 'thin'},
            },
          }
           ws[i].s.fill = {
                // background color
                  patternType: 'solid',
                  fgColor: { rgb: 'ff3030' },
                  bgColor: { rgb: 'ff3030' },
                };
        }

 }

// Remove border style for B4 cell
const cellB4 = 'B4';
const cellB4Style = {
  border: {
    top: { style: 'none' },
    bottom: { style: 'none' },
    left: { style: 'none' },
    right: { style: 'none' },
  },
};
ws[cellB4].s = cellB4Style;


  ws['!cols']=[]
  ws['!cols'][2]= { width: 23}
  ws['!cols'][3]= { width: 15}
  ws['!cols'][4]= { width: 17}
  ws['!cols'][5]= { width: 30}
  ws['!cols'][6]= { width: 15}
  ws['!cols'][7]= { width: 15}
  ws['!cols'][8]= { width: 15}
  ws['!cols'][9]= { width: 15}
  ws['!cols'][10]= { width: 13}
  ws['!cols'][12]= { width: 25}
  // ws['!cols'][13] = { hidden: true };

   XLSX.utils.book_append_sheet(wb, ws);
   XLSX.writeFile(wb, 'Item_Data.xlsx');

  }

}
