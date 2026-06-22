import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

interface LegendItem {
  number: number;
  description: string;
}

@Component({
  selector: 'app-legend-group-affective',
  imports: [TranslateModule],
  templateUrl: './legend-group-affective.component.html',
  styleUrl: './legend-group-affective.component.scss'
})
export class LegendGroupAffectiveComponent {
  @Input() title: string = 'AFFECTIVE_FORM.LEGEND.TITLE';
  @Input() legendItems: LegendItem[] = [];

  getTranslationKey(label: string): string {
    return label.toUpperCase().replace(/[\s\/\-]/g, '_').replace(/_+$/, '');
  }
}
