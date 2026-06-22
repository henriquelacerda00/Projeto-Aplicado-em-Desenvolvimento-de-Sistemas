import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../core/material/material.module';
import { TreeOptionsComponent, TreeItem } from '../tree-options/tree-options.component';
import { TranslateModule } from '@ngx-translate/core';

export interface ChecklistItem {
  label: string;
  checked: boolean;
  notes?: string;
  allowNotes?: boolean;
  hasTree?: boolean;
  treeData?: TreeItem[];   // ← se quiser passar manualmente
  subItems?: TreeItem[];
}

@Component({
  selector: 'app-checklist-with-notes',
  standalone: true,
  imports: [MaterialModule, CommonModule, ReactiveFormsModule, TreeOptionsComponent, TranslateModule],
  templateUrl: './checklist-with-notes.component.html',
  styleUrls: ['./checklist-with-notes.component.scss'],
})
export class ChecklistWithNotesComponent implements OnInit, OnChanges {
  @Input() title: string = '';
  @Input() group: string = '';
  @Input() items: ChecklistItem[] = [];
  @Output() valueChange = new EventEmitter<ChecklistItem[]>();

  // --- suas árvores fixas ---
  processingTreeData: TreeItem[] = [
    {
      name: 'EXTRISINC_FORM.PROCESSING.TYPE_OF_PROCESSING.TITLE',
      children: [
        { name: 'EXTRISINC_FORM.PROCESSING.TYPE_OF_PROCESSING.FRUIT_DRIED', allowNotes: false },
        { name: 'EXTRISINC_FORM.PROCESSING.TYPE_OF_PROCESSING.MUCIMAGE_DRIED', allowNotes: false },
        {
          name: 'EXTRISINC_FORM.PROCESSING.TYPE_OF_PROCESSING.PARCHMENT_DRIED',
          allowNotes: false,
        },
        { name: 'EXTRISINC_FORM.PROCESSING.TYPE_OF_PROCESSING.SEED_DRIED', allowNotes: false },
        { name: 'EXTRISINC_FORM.PROCESSING.TYPE_OF_PROCESSING.OTHER', allowNotes: true },
      ],
    },
  ];

  fermentationTreeData: TreeItem[] = [
    {
      name: 'EXTRISINC_FORM.PROCESSING.TYPE_OF_FERMENTATION.TITLE',
      children: [
        { name: 'EXTRISINC_FORM.PROCESSING.TYPE_OF_FERMENTATION.LACTIC', allowNotes: false },
        { name: 'EXTRISINC_FORM.PROCESSING.TYPE_OF_FERMENTATION.ANAEROBIC', allowNotes: false },
        { name: 'EXTRISINC_FORM.PROCESSING.TYPE_OF_FERMENTATION.CARBONIC_MACERATION', allowNotes: false },
        { name: 'EXTRISINC_FORM.PROCESSING.TYPE_OF_FERMENTATION.MULTIPLE_FERMENTATIONS', allowNotes: false },
        { name: 'EXTRISINC_FORM.PROCESSING.TYPE_OF_FERMENTATION.CO_FERTILIZATION', allowNotes: false },
      ],
    },
  ];

  formGroup!: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Só reconstruímos o formulário se a lista de itens mudar de tamanho ou se for a primeira carga
    // Isso evita que o formulário seja destruído enquanto você digita nas notas
    if (changes['items']) {
      const current = changes['items'].currentValue;
      const previous = changes['items'].previousValue;

      if (!previous || current.length !== previous.length || this.isNewSample(current, previous)) {
        this.buildForm();
      } else {
        // Se for apenas atualização de valores, usamos patchValue para não perder o foco
        this.itemsArray.patchValue(current, { emitEvent: false });
      }
    }
  }

  // Função auxiliar para detectar se realmente mudamos de amostra (pelo label do primeiro item, por exemplo)
  private isNewSample(current: any[], previous: any[]): boolean {
    if (!current || !previous || current.length === 0) return true;
    // Se o label ou o estado inicial mudou drasticamente, consideramos nova amostra
    return current[0].label !== previous[0].label;
  }

  private buildForm() {
    this.formGroup = this.formBuilder.group({
      itemsArray: this.formBuilder.array(
        this.items.map(item => this.createChecklistItem(item))
      )
    });
  }

  private createChecklistItem(item: ChecklistItem): FormGroup {
    let subItems: TreeItem[] = item.subItems ?? [];

    // 🔥 Preenche automático se o item tiver árvore mas não veio com subItems
    if (item.hasTree && subItems.length === 0) {
      if (item.label.toLowerCase().includes('process')) {
        subItems = this.processingTreeData;
      } else if (item.label.toLowerCase().includes('ferment')) {
        subItems = this.fermentationTreeData;
      }
    }

    return this.formBuilder.group({
      label: [item.label],
      checked: [item.checked],
      notes: [item.notes || ''],
      allowNotes: [item.allowNotes ?? true],
      hasTree: [item.hasTree ?? false],
      subItems: [subItems],
    });
  }

  get itemsArray() {
    return this.formGroup.get('itemsArray') as FormArray;
  }

  isTreeItem(index: number): boolean {
    return this.itemsArray.at(index).get('hasTree')?.value;
  }

  isNotesVisible(index: number): boolean {
    const item = this.itemsArray.at(index);
    return item.get('checked')?.value && item.get('allowNotes')?.value;
  }

  private mapToChecklistItems(): ChecklistItem[] {
    return this.itemsArray.controls.map(control => ({
      label: control.get('label')?.value,
      checked: control.get('checked')?.value,
      notes: control.get('notes')?.value,
      allowNotes: control.get('allowNotes')?.value,
      hasTree: control.get('hasTree')?.value,
      subItems: control.get('subItems')?.value,
    }));
  }

  onCheckboxChange(i: number) {
    const itemGroup = this.itemsArray.at(i);
    if (!itemGroup.get('checked')?.value) {
      itemGroup.get('notes')?.setValue('');
    }
    this.valueChange.emit(this.mapToChecklistItems());
  }

  onNotesChange(i: number) {

    this.valueChange.emit(this.mapToChecklistItems());
  }

  onTreeUpdate(i: number, treeData: TreeItem[]) {
    const itemGroup = this.itemsArray.at(i);
    itemGroup.get('subItems')?.setValue(treeData);

    this.valueChange.emit(this.mapToChecklistItems());
  }
  getTranslationKey(group: string, label: string): string {
    if (!group || !label) return '';

    const normalize = (text: string) =>
      text
        .toUpperCase()
        .trim()
        .replace(/\s|\/|,|-|\(|\)|\./g, '_') // troca espaços e símbolos por "_"
        .replace(/_+/g, '_')
        .replace(/_$/, '');

    return `EXTRISINC_FORM.${normalize(group)}.${normalize(label)}`;
  }
}
