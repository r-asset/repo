import { Component } from '@angular/core';
import { SettingsService } from '../service/settings.service';
import { HttpClient } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';


@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class LocationComponent {


  locationName: string = 'MATE U3';

  onLocationNameChange(newName: string) {
    this.locationName = newName;
  }

constructor(private service: SettingsService,private http: HttpClient){}

  ngOnInit(){

  }



}
