import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../core/material/material.module';
import { CheckboxesGroupDescriptiveComponent } from '../checkboxes-group-descriptive/checkboxes-group-descriptive.component';
import { MainTastesComponent } from '../main-tastes/main-tastes.component';
import { FormsModule, FormGroup, ReactiveFormsModule } from '@angular/forms'; // Adicionado ReactiveFormsModule
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-group-descriptive',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, // Essencial para o [formGroup] funcionar
    MaterialModule,
    CheckboxesGroupDescriptiveComponent,
    MainTastesComponent,
    TranslateModule
  ],
  templateUrl: './group-descriptive.component.html',
  styleUrls: ['./group-descriptive.component.scss'],
})
export class GroupDescriptiveComponent implements OnInit {
  @Input() titulo: string = '';
  @Input() ShowHiddens: boolean = false;
  @Input() titulo2: string = '';
  @Input() ShowSimple: boolean = false;
  @Input() parentForm!: FormGroup;

  constructor() {}

  ngOnInit() {
    if (!this.parentForm) {
      console.error(`GroupDescriptiveComponent: 'parentForm' input is required.`);
    }
  }
}
