import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MaterialModule } from '../../../core/material/material.module';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AffectiveFormComponent } from '../affective-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-group-affective',
  imports: [MaterialModule, CommonModule, FormsModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './group-affective.component.html',
  styleUrl: './group-affective.component.scss',
})
export class GroupAffectiveComponent {

  @Input() title!: string;
  @Input() otherGroups: boolean = false;
  @Input() group!: FormGroup;
  @Input() parent!: AffectiveFormComponent;

  buttons = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  sendIndividual() {
    if (this.parent) {
      const key = this.title.toLowerCase();
      if (key === 'fragrance' || key === 'aroma') {
        this.parent.sendBulkData(key.charAt(0).toUpperCase() + key.slice(1) as 'Fragrance' | 'Aroma');
      } else {
        this.parent.sendBulkData('Beverage')
      }
    }
  }
}