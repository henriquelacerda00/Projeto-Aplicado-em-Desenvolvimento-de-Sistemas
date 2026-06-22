import { Component, OnInit } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthService } from '../../core/services/auth.service';
import { SidebarComponent } from "../../components/sidebar/sidebar.component";
import { SidebarService } from '../../core/services/sidebar.service';
import { MaterialModule } from '../../core/material/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-home',
  imports: [MaterialModule, TranslateModule, RouterLink, DashboardComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  userRole: string | null = null;
  drawerOpened = true;

  constructor(private authService: AuthService, private sidebarService: SidebarService) {

  }
  ngOnInit(): void {
    this.sidebarService.sidebarVisible.subscribe(visible => {
      this.drawerOpened = visible;
    });
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        this.userRole = user.role;
      }
    }
  }

}
