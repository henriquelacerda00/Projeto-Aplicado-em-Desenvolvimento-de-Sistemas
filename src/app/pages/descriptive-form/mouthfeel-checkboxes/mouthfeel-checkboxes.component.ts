import { Component, Input, OnInit } from '@angular/core';
import { MaterialModule } from '../../../core/material/material.module';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms'; // Adicionamos FormGroup e ReactiveFormsModule
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-mouthfeel-checkboxes',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    ReactiveFormsModule,
    TranslateModule // Importante para usar [formGroup] e formControlName
  ],
  templateUrl: './mouthfeel-checkboxes.component.html',
  styleUrl: './mouthfeel-checkboxes.component.scss'
})
export class MouthfeelCheckboxesComponent implements OnInit {
  // Recebe o FormGroup do componente pai (DescriptiveFormComponent)
  @Input() parentFormGroup!: FormGroup;

  // Array de objetos para renderizar as checkboxes dinamicamente
  checkboxes = [
    { label: 'Rough (Gritty, Chalky, Sandy)', formControlName: 'rough' },
    { label: 'Smooth (Velvety, Silky, Syrupy)', formControlName: 'smooth' },
    { label: 'Metallic', formControlName: 'metallic' },
    { label: 'Oily', formControlName: 'oily' },
    { label: 'Mouth-Drying', formControlName: 'mouth_drying' }
  ];

  constructor() { }

  ngOnInit(): void {
    // É uma boa prática verificar se o FormGroup foi recebido corretamente
    if (!this.parentFormGroup) {
      console.error("MouthfeelCheckboxesComponent requires a parentFormGroup input.");
    }
  }

  getTranslationKey(label: string): string {
    return label.toUpperCase().replace(/[\s\/\-]/g, '_').replace(/_+$/, '');
  }
}
