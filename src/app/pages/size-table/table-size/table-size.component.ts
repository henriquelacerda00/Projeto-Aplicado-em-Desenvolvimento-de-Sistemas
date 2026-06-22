import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../core/material/material.module';
import { TranslateModule } from '@ngx-translate/core';

export interface SizeElement {
  size: string;
  g: number;
  percentage: number;
}

@Component({
  selector: 'app-table-size',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  styleUrl : './table-size.component.scss',
  templateUrl: './table-size.component.html'
})
export class TableSizeComponent implements OnInit {

  @Input({ required: true }) formGroup!: FormGroup;
  @Input({ required: true }) formArray!: FormArray;

  displayedColumns: string[] = ['size', 'g', 'percentage'];

  ngOnInit(): void {

    // recalcula quando peso muda
    this.formGroup.get('weightWithoutDefects')!
      .valueChanges
      .subscribe(() => this.updatePercentages());

    // recalcula quando qualquer G muda
    this.formArray.valueChanges
      .subscribe(() => this.updatePercentages());

    this.updatePercentages();
  }

  private updatePercentages(): void {

    const weight = this.formGroup.get('weightWithoutDefects')?.value;

    if (!weight || weight <= 0) {
      this.formArray.controls.forEach(control =>
        control.get('percentage')?.setValue(0, { emitEvent: false })
      );
      return;
    }

    this.formArray.controls.forEach(control => {

      const g = control.get('g')?.value || 0;

      const percentage = g
        ? +((g / weight) * 100).toFixed(1)
        : 0;

      control.get('percentage')?.setValue(percentage, { emitEvent: false });

    });
  }
}

