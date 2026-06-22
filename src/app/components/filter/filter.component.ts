import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AnaliseUsuario, dataSource, iFilterValues } from '../../core/types/type';
import { MaterialModule } from '../../core/material/material.module';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter',
  imports: [MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
})
export class FilterComponent {
  @Output() statusChange = new EventEmitter<dataSource[]>();
  @Input() analises!: any[];
  dataInicio: Date | null = null;
  dataFim: Date | null = null;

  filterValues: iFilterValues = {
    dateRange: {
      start: '',
      end: '',
    },
  };

  selectedTableType = new FormControl<string[]>([]);
  sampleNumber = new FormControl<string>('');

  tableTypes: string[] = ['Physical', 'Size','Descriptive', 'Affective',  'Extrisinc'];

  filter() {
    this.filterValues.dateRange.start = this.dataInicio?.toJSON();
    this.filterValues.dateRange.end = this.dataFim?.toJSON();

    this.onStatusChange();
  }

  onStatusChange() {
    let filteredAnalises = this.analises;

    if (this.filterValues.dateRange.start) {
      const startDate = this.zerarHoraUTC(new Date(this.filterValues.dateRange.start));
      filteredAnalises = filteredAnalises.map((table) => {
        const analiseDate = table.data.filter((analise: AnaliseUsuario) => {
          const analiseDate = this.zerarHoraUTC(new Date(analise.date));
          return analiseDate >= startDate;
        });
        return { tableType: table.tableType, tableName: table.tableName, data: analiseDate };
      });
    }

    if (this.filterValues.dateRange.end) {
      const endDate = this.zerarHoraUTC(new Date(this.filterValues.dateRange.end));
      filteredAnalises = filteredAnalises.map((table) => {
        const analiseDate = table.data.filter((analise: AnaliseUsuario) => {
          const analiseDate = this.zerarHoraUTC(new Date(analise.date));
          return analiseDate <= endDate;
        });
        return { tableType: table.tableType, tableName: table.tableName, data: analiseDate };
      });
    }

    if (this.selectedTableType.value && this.selectedTableType.value.length > 0) {
      filteredAnalises = filteredAnalises.filter((analise) => {
        // console.log(analise, this.selectedTableType.value);
        return this.selectedTableType.value!.includes(analise.tableType);
      });
    }

    if (this.sampleNumber.value) {
      const sampleNumberFilter = this.sampleNumber.value.trim().toLowerCase();
      filteredAnalises = filteredAnalises.map((table) => {
        const analiseData = table.data.filter(
          (analise: AnaliseUsuario) =>
            analise.sample_number && analise.sample_number.toLowerCase().includes(sampleNumberFilter)
        );
        return { tableType: table.tableType, tableName: table.tableName, data: analiseData };
      });
    }

    this.statusChange.emit(filteredAnalises);
  }

  zerarHoraUTC(date: Date): Date {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  }
}
