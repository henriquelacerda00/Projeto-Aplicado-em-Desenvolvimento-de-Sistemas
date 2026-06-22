import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MaterialModule } from '../../core/material/material.module';
import { ContainerComponent } from '../container/container.component';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // ✅ importa aqui
import { TranslateModule } from '@ngx-translate/core';
import {  highlightBorder } from '../../core/animations/animations';

@Component({
  selector: 'app-forms-header',
  standalone: true, // garante que ele funcione isoladamente
  imports: [
    CommonModule, // ✅ necessário para usar *ngIf, *ngFor, ngClass, ngStyle, etc.
    MaterialModule,
    ContainerComponent,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  animations:[highlightBorder],
  templateUrl: './forms-header.component.html',
  styleUrls: ['./forms-header.component.scss']
})
export class FormsHeaderComponent {
  @Input({ required: true }) formGroup!: FormGroup;
  @Input({ required: false }) highlightTrigger!: number;
}
