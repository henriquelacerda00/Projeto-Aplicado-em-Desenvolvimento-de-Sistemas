import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../core/material/material.module';
import { RouterModule } from '@angular/router';
import { SidebarService } from '../../core/services/sidebar.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-layout',
  imports: [MaterialModule, RouterModule,SidebarComponent,],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {
  drawerOpened = false;

  constructor(private sidebarService: SidebarService) {}

  ngOnInit() {
    this.sidebarService.sidebarVisible.subscribe(v => {
      this.drawerOpened = v;
    });
  }
}
