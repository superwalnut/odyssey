import { Component } from "@angular/core";
import { INavData } from "@coreui/angular";
import { AccountService } from "../../services/account.service";

@Component({
  selector: "app-dashboard-2",
  templateUrl: "./default-layout.component.html",
})
export class DefaultLayoutComponent {
  public sidebarMinimized = false;
  public navItems;

  isGod: boolean;
  isAdmin: boolean;

  constructor(private accountService: AccountService) {
    this.isGod = this.accountService.isGod();
    this.isAdmin = this.accountService.isAdmin();

    console.log("isadmin", this.isAdmin);
    this.navItems = this.initNav(this.isAdmin);
  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  initNav(isAdmin: boolean) {
    var items: INavData[] = [
      {
        name: "Dashboard",
        url: "/dashboard",
        icon: "icon-speedometer",
        badge: {
          variant: "info",
          text: "NEW",
        },
      },
      //For Users
      {
        title: true,
        name: "Account",
      },
      {
        name: "Profile",
        url: "/settings/profile",
        icon: "icon-user",
      },
      {
        name: "Password",
        url: "/settings/password",
        icon: "icon-pencil",
      },
      {
        name: "Credit Statement",
        url: "/settings/creditstatement",
        icon: "cil-dollar",
      },
      {
        name: "Booking Schedule",
        url: "/settings/schedule",
        icon: "cil-tennis",
      },
      {
        name: "Attendance History",
        url: "/settings/attendancehistory",
        icon: "cil-check",
      },
      {
        name: "Family Members",
        url: "/settings/family",
        icon: "icon-people",
      },
    ];

    if (isAdmin) {
      const adminNavs = [
        {
          divider: true,
        },
        //For Admin
        {
          divider: true,
        },
        {
          title: true,
          //name: 'Components'，
          name: "Admin Only",
        },
        {
          name: "Users",
          url: "/admin/users",
          icon: "cil-group",
        },
        {
          name: "Bookings",
          url: "/admin/bookings",
          icon: "cil-notes",
        },
        {
          name: "Reports",
          url: "/base",
          icon: "cil-chart",
          children: [
            {
              name: "Income",
              url: "/base/cards",
              icon: "icon-puzzle",
            },
            {
              name: "Attendance",
              url: "/base/cards",
              icon: "icon-puzzle",
            },
            {
              name: "Unpaid users",
              url: "/base/cards",
              icon: "icon-puzzle",
            },
          ],
        },
      ];

      adminNavs.forEach((x) => {
        items.push(x);
      });
    }

    return items;
  }
}
