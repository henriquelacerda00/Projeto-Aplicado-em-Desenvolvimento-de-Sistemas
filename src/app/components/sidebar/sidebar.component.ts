import { Component, signal } from '@angular/core';
import { MaterialModule } from '../../core/material/material.module';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [MaterialModule, RouterModule, TranslateModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  readonly panelOpenState = signal(false);
  userRole: string | null = null;

  constructor(public auth: AuthService) {

  }

  ngOnInit() {
    
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        this.userRole = user.txRole;
      }
    }
  }

}
