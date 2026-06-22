import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../core/material/material.module';
import { CobTypeService } from '../../../core/services/cobtype.service';
import { TranslateModule } from '@ngx-translate/core';

export interface PhysicalDefect {
  name: string;
  ratio: number;
  defectCount: number;
  fullDefectCount: number;
}

@Component({
  selector: 'app-table-physical',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './table-physical.component.html',
  styleUrl: './table-physical.component.scss',
})
export class TablePhysicalComponent implements OnInit {
  @Input({ required: true }) formGroup!: FormGroup;
  @Input({ required: true }) formArray!: FormArray;
  @Output() cobtypeChange = new EventEmitter<string>();
  @Output() totalGreenDefectsChange = new EventEmitter<number>();
  @Output() tdg300Change = new EventEmitter<number>();

  cobtype: string = '';
  displayedColumns: string[] = [
    'name',
    'ratio',
    'defectCount',
    'fullDefectCount',
  ];

  constructor(
    private fb: FormBuilder,
    private cobTypeService: CobTypeService
  ) { }

  ngOnInit(): void {
    this.initDefectsTable();

    // 🔥 Torna o cálculo 100% reativo
    this.formArray.valueChanges.subscribe(() => {
      this.updateCobType();
    });

    // 🔥 Calcula uma vez ao iniciar
    this.updateCobType();
  }

  public initDefectsTable() {
    const defaultDefects = [
      { name: 'FULL_BLACK', ratio: 1 },
      { name: 'FULL_SOUR', ratio: 1 },
      { name: 'DRIED_CHERRY', ratio: 1 },
      { name: 'FUNGUS_DAMAGE', ratio: 1 },
      { name: 'FOREIGN_MATTER', ratio: 1 },
      { name: 'SEVERE_INSECT_DAMAGE', ratio: 5 },
      { name: 'PARTIAL_BLACK', ratio: 3 },
      { name: 'PARTIAL_SOUR', ratio: 3 },
      { name: 'PARCHMENT', ratio: 5 },
      { name: 'FLOATER', ratio: 5 },
      { name: 'IMMATURE_UNRIPE', ratio: 5 },
      { name: 'WITHERED', ratio: 5 },
      { name: 'SHELL', ratio: 5 },
      { name: 'BROKEN_CHIPPED_CUT', ratio: 5 },
      { name: 'HULL_HUSK', ratio: 5 },
      { name: 'SLIGHT_INSECT_DAMAGE', ratio: 10 },
    ];

    if (this.formArray.length === 0) {
      defaultDefects.forEach((defect) =>
        this.formArray.push(
          this.fb.group({
            name: [defect.name],
            ratio: [defect.ratio],
            defectCount: [0],
            fullDefectCount: [0],
          })
        )
      );
    }
  }
  updateFullDefect(index: number): void {
    const defectGroup = this.formArray.at(index) as FormGroup;
    const count = defectGroup.get('defectCount')?.value || 0;
    const ratio = defectGroup.get('ratio')?.value || 1;
    const result = Math.floor(count / ratio);
    defectGroup.get('fullDefectCount')?.setValue(result, { emitEvent: false });
    this.updateCobType();
  }

  updateCobType(): void {
    const defects = this.formArray.value;

    const hasValue = defects.some(
      (d: any) => d.defectCount > 0 || d.fullDefectCount > 0
    );

    if (!hasValue) {
      this.resetCobtype();
      return;
    }

    this.cobtype = this.cobTypeService.getCobType(defects);
    this.cobtypeChange.emit(this.cobtype);
    this.totalGreenDefectsChange.emit(this.calcularTotalGeral());
    this.tdg300Change.emit(this.calcularTGD300g());
  }

  calcularTotalGeral(): number {
    return this.formArray.controls.reduce((acc, control) => {
      return acc + (control.get('fullDefectCount')?.value || 0);
    }, 0);
  }

  calcularTGD300g(): number {
    return +(this.calcularTotalGeral() * (300 / 350)).toFixed(2);
  }

  resetCobtype(): void {
    this.cobtype = '';
    this.cobtypeChange.emit(this.cobtype);
    this.totalGreenDefectsChange.emit(0);
    this.tdg300Change.emit(0);
  }
}
