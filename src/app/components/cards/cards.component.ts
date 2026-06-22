import { CommonModule } from '@angular/common';

import { MaterialModule } from './../../core/material/material.module';
import { Component, Input } from '@angular/core';
import { Card } from '../../core/types/type';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [MaterialModule, CommonModule, RouterLink, TranslateModule],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss'
})
export class CardsComponent {
  @Input({ required: true }) typeCard!: 'physical' | 'size' | 'descriptive' | 'affective' | 'extrinsic';
  @Input() disabled = false;
  @Input() verified = false;

  cards: Card[] = [
    {
      type: 'physical',
      icon: 'assets/bean-icon.png',
      route: '/physical-assessments'
    },
    {
      type: 'size',
      icon: 'assets/size_icon.png',
      route: '/size-table'
    },
    {
      type: 'descriptive',
      icon: 'assets/descriptive_icon.png',
      route: '/descriptive-form'
    },
    {
      type: 'affective',
      icon: 'assets/affective_icon.png',
      route: '/affective-form'
    },
    {
      type: 'extrinsic',
      icon: 'assets/extrisinc_icon.png',
      route: '/extrisinc-form'
    }
  ]

  card!: typeof this.cards[number];

  ngOnChanges() {
    this.card = this.cards.find(c => c.type === this.typeCard)!;
  }
}
