import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MaterialModule } from '../../../core/material/material.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

export interface Color {
  name: string;
}

@Component({
  selector: 'app-colors-physical',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule, ReactiveFormsModule,TranslateModule],
  templateUrl: './colors-physical.component.html',
  styleUrl: './colors-physical.component.scss',
})
export class ColorsPhysicalComponent implements OnInit {
  @Input({ required: true }) formGroup!: FormGroup;

  colors: Color[] = [
    { name: 'COLORS.BLUE__GREEN' },
    { name: 'COLORS.BLUISH__GREEN' },
    { name: 'COLORS.GREEN' },
    { name: 'COLORS.GREENISH' },
    { name: 'COLORS.YELLOW__GREEN' },
    { name: 'COLORS.PABLE__YELLOW' },
    { name: 'COLORS.YELLOWISH' },
    { name: 'COLORS.BROWNISH' },
  ];

  ngOnInit() {
    // Garante que os controles existam
    this.colors.forEach((color) => {
      if (!this.formGroup.contains(color.name)) {
        this.formGroup.addControl(color.name, new FormControl(false));
      }
    });
  }

  getColorsAsFlatObject(): Record<string, number> {
    const result: Record<string, number> = {};
    this.colors.forEach((color) => {
      const key = color.name.toLowerCase().replace(/ /g, '_');
      const value = this.formGroup.get(color.name)?.value ? 1 : 0;
      result[key] = value;
    });

    return result;
  }
}
