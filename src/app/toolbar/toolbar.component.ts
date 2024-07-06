import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { faHome, faBell, faUserCheck, faArrowUpFromBracket, faHourglass1, faPaperPlane, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faTemperatureDown, faTemperatureUp, faTemperatureHigh, faDroplet} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  DisplayUserModal = false

  constructor(private Cookie: CookieService, private router: Router) {}

  Name = ''
  Email = ''
  Unit = ''
  UnitName = ''
  location = ''

  loc = faLocationDot
  house = faHome
  bell = faBell
  user = faUserCheck
  out = faArrowUpFromBracket
  hour = faHourglass1
  send = faPaperPlane

  temp = faTemperatureHigh
  maxTemp = faTemperatureUp
  minTemp = faTemperatureDown
  hum = faDroplet

  timer: any;
  startTime: number = 0;
  elapsedTime: number = 0;
  isRunning: boolean = false;
  countdownDuration: number = 60 * 60 * 1000; // 1 hour in milliseconds

  userType = ''

  ngOnInit(): void {
    window.scroll(0,0);
    this.checkUserLogin();
  }

  printPage() {
    window.print();
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  checkUserLogin(): void {
    if (this.isLoggedIn()) {
      this.startTimer();
    }
  }

  isLoggedIn(): boolean {
    return (
      this.Cookie.check('Username') &&
      this.Cookie.check('Email') &&
      this.Cookie.check('Plantname')
    );
  }

  startTimer(): void {
    if (!this.isRunning) {
      const storedStartTime = localStorage.getItem('timerStartTime');
      if (storedStartTime) {
        this.startTime = parseInt(storedStartTime, 10);
      } else {
        this.startTime = Date.now();
        localStorage.setItem('timerStartTime', this.startTime.toString());
      }

      this.elapsedTime = Date.now() - this.startTime;

      this.timer = setInterval(() => {
        this.elapsedTime = Date.now() - this.startTime;

        if (this.elapsedTime >= this.countdownDuration) {
          this.stopTimer();
          this.logout();
        }
      }, 1000); // Update elapsed time every second (1000 milliseconds)

      this.isRunning = true;
    }
  }

  stopTimer(): void {
    clearInterval(this.timer);
    this.isRunning = false;
  }

  resetTimer(): void {
    localStorage.removeItem('timerStartTime');
    this.startTime = Date.now();
    localStorage.setItem('timerStartTime', this.startTime.toString());
    this.elapsedTime = 0;
  }

  formatTime(): string {
    const remainingTime = this.countdownDuration - this.elapsedTime;

    const seconds = Math.floor(remainingTime / 1000) % 60;
    const minutes = Math.floor(remainingTime / (1000 * 60)) % 60;
    const hours = Math.floor(remainingTime / (1000 * 60 * 60));

    const pad = (num: number) => String(num).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  DisplayNotifiDialog = false

  showNotifiModal(){
    this.DisplayNotifiDialog = true
  }

  closeCommonModal(){
    this.DisplayNotifiDialog = false
    this.DisplayUserModal = false
  }

  showUserModal(){
    this.DisplayUserModal=true
    this.Name = this.Cookie.get('Username')
    this.Email = this.Cookie.get('Email')
    this.Unit = this.Cookie.get('Plantname')
    this.userType = this.Cookie.get('Usertype')
  }

  logout(): void {
    this.stopTimer();
    localStorage.removeItem('timerStartTime');
    this.Cookie.deleteAll();
    this.router.navigate(['./']);
    location.reload()
  }


}

