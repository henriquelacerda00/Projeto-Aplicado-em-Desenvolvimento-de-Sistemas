import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MaterialModule } from '../../../core/material/material.module';
import { CommonModule } from '@angular/common';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AbstractControl, FormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

interface MainTaste {
  description: string;
  selected: boolean;
}

@Component({
  selector: 'app-main-tastes',
  standalone: true,
  imports: [MaterialModule, CommonModule, MatSnackBarModule,TranslateModule],
  templateUrl: './main-tastes.component.html',
  styleUrls: ['./main-tastes.component.scss'],
})
export class MainTastesComponent {

  @Input() parentForm!: FormGroup;

  tastes = [
    { label: 'Salty', control: 'main_taste_salty' },
    { label: 'Bitter', control: 'main_taste_bitter' },
    { label: 'Sour', control: 'main_taste_sour' },
    { label: 'Umami', control: 'main_taste_umami' },
    { label: 'Sweet', control: 'main_taste_sweet' },
  ];

  constructor(private snackBar: MatSnackBar) {}

  // Conta quantos estão marcados no FormGroup
  get selectedCount(): number {
    return this.tastes.filter(t =>
      this.parentForm?.get(t.control)?.value
    ).length;
  }

  isSelected(controlName: string): boolean {
    return !!this.parentForm?.get(controlName)?.value;
  }

  toggle(controlName: string) {

    const control = this.parentForm?.get(controlName);
    if (!control) return;

    const currentValue = control.value;

    // Limite de 2 selecionados
    if (!currentValue && this.selectedCount >= 2) {
      this.snackBar.open(
        'Só é possível selecionar no máximo 2 sabores.',
        'Fechar',
        { duration: 3000 }
      );
      return;
    }

    control.setValue(!currentValue);
  }

  getTranslationKey(label: string): string {
    return label
      .toUpperCase()
      .replace(/[\s\/\-]/g, '_')
      .replace(/_+$/, '');
  }
}
