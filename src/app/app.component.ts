import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";

import { IconSetService } from "@coreui/icons-angular";
import { freeSet } from "@coreui/icons";

@Component({
  // tslint:disable-next-line
  selector: "body",
  template: ` <app-public-header></app-public-header>
    <router-outlet></router-outlet>
    <footer class="app-footer">
      <div>
        <a href="https://coreui.io">HBC</a>
        <span>&copy; 2021.</span>
      </div>
      <div class="ml-auto">
        <span>Powered by</span>
        <a href="https://coreui.io">HBC DEV</a>
      </div>
    </footer>`,
  providers: [IconSetService],
})
export class AppComponent implements OnInit {
  constructor(private router: Router, public iconSet: IconSetService) {
    // iconSet singleton
    iconSet.icons = { ...freeSet };
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
}
