import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MaterialModule } from '../../../core/material/material.module';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-checkboxes-group-descriptive',
  imports: [MaterialModule, CommonModule, FormsModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './checkboxes-group-descriptive.component.html',
  styleUrl: './checkboxes-group-descriptive.component.scss',
})
export class CheckboxesGroupDescriptiveComponent {
  @Input() parentFormGroup!: FormGroup;

  checkboxColumns = [
    {
      rows: [
        ['Floral'],
        ['Fruity', 'Berry', 'Dried Fruit', 'Citrus Fruit'],
        ['Sour/Fermented', 'Sour', 'Fermented'],
        ['Green/Vegetative'],
        ['Other', 'Chemical', 'Musty/Earthy', 'Woody'],
      ],
    },
    {
      rows: [
        ['Roasted', 'Cereal', 'Burnt', 'Tobacco'],
        ['Nutty/Cocoa', 'Nutty', 'Cocoa'],
        ['Spice'],
        ['Sweet', 'Vanilla/Vanillin', 'Brown Sugar'],
      ],
    },
  ];

  constructor() { }

  ngOnInit(): void {
    if (!this.parentFormGroup) {
      console.error(`CheckboxesGroupDescriptiveComponent: 'parentFormGroup' input is required.`);
      return;
    }

    // Adiciona dinamicamente os FormControls correspondentes
    this.checkboxColumns.forEach(column => {
      column.rows.forEach(row => {
        row.forEach(label => {
          const controlName = this.normalizeCheckboxName(label);
          if (!this.parentFormGroup.get(controlName)) {
            this.parentFormGroup.addControl(controlName, new FormControl(false));
          }
        });
      });
    });
  }

  normalizeCheckboxName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[\s\/\-]/g, '_')
      .replace(/_+$/, '');
  }

  getTranslationKey(label: string): string {
    return label
      .toUpperCase()
      .replace(/[\s\/\-]/g, '_')
      .replace(/_+$/, '');
  }
}
