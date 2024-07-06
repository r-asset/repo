import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'R-Asset';

  constructor(private router: Router) {}
  
  ngOnInit(): void {
    window.scroll(0,0);
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = () => {
      window.history.go(1)
    };
  }

  public getRouter(): Router {
    return this.router;
  }

}
