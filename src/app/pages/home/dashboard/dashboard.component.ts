import { Component } from '@angular/core';
import { MaterialModule } from '../../../core/material/material.module';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from '../../../components/container/container.component';
import { CardsComponent } from '../../../components/cards/cards.component';

@Component({
  selector: 'app-dashboard',
  imports: [MaterialModule,CommonModule,ContainerComponent,CardsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
