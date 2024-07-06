import { Component, EventEmitter, Input, OnChanges, OnInit, Output, HostListener } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { faEye, faEyeSlash, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { LoginserviseService } from './loginservise.service'
import { Router } from '@angular/router';
import { faLightbulb, faSolarPanel } from '@fortawesome/free-solid-svg-icons';
import { CookieService } from 'ngx-cookie-service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  eye = faEye
  eyeCls = faEyeSlash
  log = faRightToBracket

  light = faLightbulb
  solar = faSolarPanel

  AutencateData: any

  form:FormGroup;

  showPassword: boolean = false;



  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }


  ngOnInit(): void {

  }


  constructor(private loginAut: LoginserviseService, private messageService: MessageService, private router: Router, private Cookie: CookieService){
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    })
  }

  login(): void {
    if (this.form.valid) {
      // console.log(this.form.value)
      this.loginAut.getData(this.form.value).subscribe(
        res=>{
          // console.log(res)
          let valid = res.validationstring
          if(valid === 'Email ID and Password matches'){
            this.Cookie.set('plantname',res.plantname)
            this.Cookie.set('username',res.username)
            this.Cookie.set('email',res.email)
            this.Cookie.set('firstname',res.firstname)
            this.Cookie.set('lastname',res.lastname)
            this.Cookie.set('address1',res.address1)
            this.Cookie.set('address2',res.address2)
            this.Cookie.set('language',res.language)
            this.Cookie.set('type',res.type)
            // console.log(this.Cookie.getAll())
            this.messageService.add({ severity: 'success', summary: `Welcome ${this.Cookie.get('Username')}`, detail: 'Authentication Success', life: 4000 });
            this.router.navigate(['default']);
          }
          else{
          this.Cookie.deleteAll();
          this.messageService.add({ severity: 'error', summary: 'Authencation Failed', detail: 'Invalid Username or Password', life: 4000 });
        }
    })
  }

  }
}
