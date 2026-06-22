import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { MaterialModule } from '../../../core/material/material.module';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-impression-value-extrisinc',
  standalone: true,
  imports: [MaterialModule, CommonModule, TranslateModule],
  templateUrl: './impression-value-extrisinc.component.html',
  styleUrl: './impression-value-extrisinc.component.scss'
})
export class ImpressionValueExtrisincComponent implements OnChanges {

  // 🔥 IMPORTANTE: usar string para bater com buttons
  @Input() value: string | number | null = null;

  @Output() valueChange = new EventEmitter<string | null>();

  selectedValue: string | null = null;

  buttons: string[] = ['1','2','3','4','5','6','7','8','9'];

  // 🔥 ESSENCIAL para funcionar com paginator
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.selectedValue =
        this.value !== null && this.value !== undefined
          ? String(this.value)
          : null;
    }
  }

  onSelect(value: string) {
    if (this.selectedValue === value) {
      this.selectedValue = null;
    } else {
      this.selectedValue = value;
    }

    this.valueChange.emit(this.selectedValue);
  }
}
