import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MaterialModule } from '../../../core/material/material.module';
import { CommonModule } from '@angular/common';
import {
  ChecklistItem,
  ChecklistWithNotesComponent,
} from '../checklist-with-notes/checklist-with-notes.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-group-extrisinc',
  standalone: true,
  imports: [MaterialModule, CommonModule, ChecklistWithNotesComponent, TranslateModule],
  templateUrl: './group-extrisinc.component.html',
  styleUrl: './group-extrisinc.component.scss',
})
export class GroupExtrisincComponent {
  @Output() farmingChanged = new EventEmitter<ChecklistItem[]>();
  @Output() processingChanged = new EventEmitter<ChecklistItem[]>();
  @Output() tradingChanged = new EventEmitter<ChecklistItem[]>();
  @Output() certificationsChanged = new EventEmitter<ChecklistItem[]>();
  @Input() farmingItems!: ChecklistItem[];
  @Input() processingItems!: ChecklistItem[];
  @Input() tradingItems!: ChecklistItem[];
  @Input() certificationsItems!: ChecklistItem[];

  // farmingItems: ChecklistItem[] = [
  //   { label: 'Country', checked: false, notes: '', allowNotes: true },
  //   { label: 'Region', checked: false, notes: '' },
  //   { label: 'Name of Farm or Co-op', checked: false, notes: '' },
  //   { label: 'Name of Producer(s)', checked: false, notes: '' },
  //   { label: 'Species', checked: false, notes: '' },
  //   { label: 'Variety or Varieties', checked: false, notes: '' },
  //   { label: 'Harvest Date/Year', checked: false, notes: '' },
  //   { label: 'Other', checked: false, notes: '' },
  // ];

  // processingItems: ChecklistItem[] = [
  //   { label: 'Name of Processor(s)', checked: false, notes: '' },
  //   { label: 'Wet Mill / Station', checked: false , allowNotes: false},
  //   { label: 'Dry Mill', checked: false , allowNotes: false},
  //   { label: 'Type of processing:', checked: false, hasTree: true },
  //   { label: 'Type of fermentation:', checked: false, hasTree: true },
  // ];

  // tradingItems: ChecklistItem[] = [
  //   { label: 'Size Grade', checked: false, notes: '' },
  //   { label: 'Other Grade', checked: false, notes: '' },
  //   { label: 'Dry Mill', checked: false, notes: '' },
  //   { label: 'ICO Number', checked: false, notes: '' },
  //   { label: 'Other', checked: false, notes: '' },
  // ];

  // certificationsItems: ChecklistItem[] = [
  //   { label: '4C', checked: false ,allowNotes: false},
  //   { label: 'Fair Trade', checked: false ,allowNotes: false},
  //   { label: 'Organic', checked: false ,allowNotes: false},
  //   { label: 'Rainforest Alliance', checked: false ,allowNotes: false},
  //   { label: 'Geographical Indication', checked: false, notes: '' },
  //   { label: 'ABIC', checked: false, notes: '' },
  //   { label: 'Other', checked: false, notes: '' },
  // ];

  onFarmingChange(value: ChecklistItem[]) {

    this.farmingChanged.emit(value);
  }
  onProcessingChange(value: ChecklistItem[]) {

    this.processingChanged.emit(value);
  }

  onTradingChange(value: ChecklistItem[]) {

    this.tradingChanged.emit(value);
  }

  onCertificationsChange(value: ChecklistItem[]) {

    this.certificationsChanged.emit(value);
  }


}
