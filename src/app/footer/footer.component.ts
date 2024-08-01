import { DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CookieService } from 'ngx-cookie-service'
import { faTemperatureDown, faTemperatureUp, faTemperatureHigh, faDroplet} from '@fortawesome/free-solid-svg-icons';
import { FooterService } from './footer.service';
import { interval } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  providers: [DatePipe]
})
export class FooterComponent implements OnInit, OnDestroy{

  Date = new Date();
  currentTime!: Date;

  timer: any;
  startTime: number = 0;
  elapsedTime: number = 0;
  isRunning: boolean = false;
  countdownDuration: number = 60 * 60 * 1000; // 1 hour in milliseconds

  constructor(private Cookie: CookieService, private router: Router){

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

  ngOnInit(): void {
    this.checkUserLogin();
    this.updateTime();
    setInterval(() => {
      this.updateTime();
    }, 1000);
  }

  private updateTime() {
    this.currentTime = new Date();
  }

  ngOnDestroy(): void {
    this.stopTimer();
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

  logout(): void {
    this.stopTimer();
    localStorage.removeItem('timerStartTime');
    this.Cookie.deleteAll();
    this.router.navigate(['/']);
    location.reload()
  }



}
