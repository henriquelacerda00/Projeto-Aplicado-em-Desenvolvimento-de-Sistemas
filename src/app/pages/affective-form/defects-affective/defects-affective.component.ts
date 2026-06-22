import { Component, Input } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-defects-affective',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCheckboxModule, TranslateModule],
  templateUrl: './defects-affective.component.html',
  styleUrl: './defects-affective.component.scss'
})
export class DefectsAffectiveComponent {
  @Input() group!: FormGroup;

  defectivesAny: string[] = [
  'MOLDY',
  'PHENOLIC',
  'POTATO'
];

  get nonUniformCups(): FormArray {
    return this.group.get('non_uniform_cups') as FormArray;
  }

  get defectiveCups(): FormArray {
    return this.group.get('defective_cups') as FormArray;
  }

  get defectsAny(): FormArray {
    return this.group.get('defects_any') as FormArray;
  }

  getTranslationKey(label: string): string {
    return label.toUpperCase().replace(/[\s\/\-]/g, '_').replace(/_+$/, '');
  }
}
