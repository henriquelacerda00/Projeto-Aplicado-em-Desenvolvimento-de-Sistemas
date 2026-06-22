import { NotificationService } from './../../core/services/notification.service';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MaterialModule } from '../../core/material/material.module';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from '../../components/container/container.component';
import { FormsHeaderComponent } from '../../components/forms-header/forms-header.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { GroupExtrisincComponent } from './group-extrisinc/group-extrisinc.component';
import { LegendGroupAffectiveComponent } from '../affective-form/legend-group-affective/legend-group-affective.component';

import { ChecklistItem } from './checklist-with-notes/checklist-with-notes.component';
import { ImpressionValueExtrisincComponent } from './impression-value-extrisinc/impression-value-extrisinc.component';
import { SupabaseService } from '../../core/services/supabase.service';
import { TranslateModule } from '@ngx-translate/core';
import { TreeItem } from './tree-options/tree-options.component';
import { highlightBorder } from '../../core/animations/animations';

@Component({
  selector: 'app-extrisinc-form',
  imports: [
    MaterialModule,
    CommonModule,
    ContainerComponent,
    FormsHeaderComponent,
    GroupExtrisincComponent,
    FormsModule,
    ReactiveFormsModule,
    LegendGroupAffectiveComponent,
    ImpressionValueExtrisincComponent,
    TranslateModule,
  ],
  animations: [highlightBorder],
  templateUrl: './extrisinc-form.component.html',
  styleUrls: ['./extrisinc-form.component.scss'],
})
export class ExtrisincFormComponent implements OnInit, OnChanges {
  @Input() formId?: string;
  @Input() cadastrarAnalise: boolean = false;
  @Input() sampleNumber!: string;
  @Input() initialData: any;
  @Input() isLastSample: boolean = false;
  @Output() formChange = new EventEmitter<any>();
  @Output() submitForm = new EventEmitter<void>();

  farmingItems: ChecklistItem[] = [];
  processingItems: ChecklistItem[] = [];
  tradingItems: ChecklistItem[] = [];
  certificationsItems: ChecklistItem[] = [];

  extrisincForm!: FormGroup;
  @ViewChild('formTop')
  formTop!: ElementRef<HTMLElement>;

  @ViewChild(FormsHeaderComponent)
  formsHeaderComponent!: FormsHeaderComponent;
  animationTrigger = 0;

  constructor(
    private formBuilder: FormBuilder,
    private supabaseService: SupabaseService,
    private notificationService: NotificationService,
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.extrisincForm.valueChanges.subscribe((value) => {
      this.formChange.emit(value);
    });
    this.supabaseService.getUserData();
    console.log('Dados do usuário:', this.supabaseService.getCurrentUser());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['sampleNumber'] || changes['initialData']) {
      this.extrisincForm.reset({}, { emitEvent: false });

      const normalizedSampleNumber =
        typeof this.sampleNumber === 'string' || typeof this.sampleNumber === 'number'
          ? String(this.sampleNumber)
          : String((this.sampleNumber as any)?.sample_number ?? (this.sampleNumber as any)?.sampleNumber ?? '');

      this.formHeader.get('sample_number')?.setValue(normalizedSampleNumber, { emitEvent: false });

      if (this.initialData) {
        this.extrisincForm.patchValue(this.initialData, { emitEvent: false });
      }

      const farming = this.createDefaultFarmingItems();
      const processing = this.createDefaultProcessingItems();
      const trading = this.createDefaultTradingItems();
      const certifications = this.createDefaultCertificationsItems();

      this.farmingItems = this.syncChecklistFromForm(farming, this.farmingMap, 'farming');
      this.tradingItems = this.syncChecklistFromForm(trading, this.tradingMap, 'trading');
      this.certificationsItems = this.syncChecklistFromForm(certifications, this.certificationsMap, 'certifications');

      const syncedProcessing = this.syncChecklistFromForm(processing, this.processingMap, 'processing');
      this.processingItems = this.syncTreesFromForm(syncedProcessing);

      this.applyMode();

      setTimeout(() => {
        this.formTop?.nativeElement.scrollIntoView({ behavior: 'smooth' });
        this.animationTrigger++;
      }, 100);
    }
  }

  public impressionOfQualityItems = [
    { number: 1, description: 'EXTREMELY LOW' },
    { number: 2, description: 'VERY LOW' },
    { number: 3, description: 'MODERATELY LOW' },
    { number: 4, description: 'SLIGHTLY LOW' },
    { number: 5, description: 'NEITHER HIGH NOR LOW' },
    { number: 6, description: 'SLIGHTLY HIGH' },
    { number: 7, description: 'MODERATELY HIGH' },
    { number: 8, description: 'VERY HIGH' },
    { number: 9, description: 'EXTREMELY HIGH' },
  ];

  private initForm() {
    this.extrisincForm = this.formBuilder.group({
      header: this.formBuilder.group({
        // name: ['', [Validators.required]],
        // date: ['', [Validators.required]],
        // purpose: ['', [Validators.required]],
        sample_number: [{ value: '' }, Validators.required],
      }),
      farming: this.formBuilder.group({
        farm_country: [false],
        farm_country_notes: [''],
        farm_region: [false],
        farm_region_notes: [''],
        farm_name_of_farm: [false],
        farm_name_of_farm_notes: [''],
        farm_name_of_producer: [false],
        farm_name_of_producer_notes: [''],
        farm_species: [false],
        farm_species_notes: [''],
        farm_variety: [false],
        farm_variety_notes: [''],
        farm_harvest_date: [false],
        farm_harvest_date_notes: [''],
        farm_other: [false],
        farm_other_notes: [''],
      }),
      processing: this.formBuilder.group({
        process_name_of_processor: [false],
        process_name_of_processor_notes: [''],
        process_wet_mill: [false],
        process_dry_mill: [false],
        processingTree: this.formBuilder.group({
          process_fruit_dried: [false],
          process_mucilage_dried: [false],
          process_parchment_dried: [false],
          process_seed_dried: [false],
          process_other: [false],
          process_other_notes: [''],
        }),
        fermentationTree: this.formBuilder.group({
          process_lactic: [false],
          process_anaerobic: [false],
          process_carbonic_maceration: [false],
          process_multiple_fermentations: [false],
          process_co_fermentation: [false],
        }),
      }),
      trading: this.formBuilder.group({
        trading_size_grade: [false],
        trading_size_grade_notes: [''],
        trading_other_grade: [false],
        trading_other_grade_notes: [''],
        trading_ico_number: [false],
        trading_ico_number_notes: [''],
        trading_other: [false],
        trading_other_notes: [''],
      }),
      certifications: this.formBuilder.group({
        certific_c4: [false],
        certific_fair_trade: [false],
        certific_organic: [false],
        certific_rainforest_alliance: [false],
        certific_geographical_indication: [false],
        certific_geographical_indication_notes: [''],
        certific_abic: [false],
        certific_abic_notes: [''],
        certific_other: [false],
        certific_other_notes: [''],
      }),
      impression_of_value: [null],
    });
  }

  get formHeader() {
    return this.extrisincForm.get('header') as FormGroup;
  }

  get formFarming() {
    return this.extrisincForm.get('farming') as FormGroup;
  }

  get formProcessing() {
    return this.extrisincForm.get('processing') as FormGroup;
  }

  get formTrading() {
    return this.extrisincForm.get('trading') as FormGroup;
  }

  get formCertifications() {
    return this.extrisincForm.get('certifications') as FormGroup;
  }

  get formProcessingTree() {
    return this.extrisincForm.get('processingTree') as FormGroup;
  }

  get formFermentationTree() {
    return this.extrisincForm.get('fermentationTree') as FormGroup;
  }

  get impressionOfValueControl() {
    return this.extrisincForm.get('impression_of_value') as FormGroup;
  }

  private farmingMap: Record<string, { checked: string; notes?: string }> = {
    Country: { checked: 'farm_country', notes: 'farm_country_notes' },
    Region: { checked: 'farm_region', notes: 'farm_region_notes' },
    'Name of Farm or Co-op': {
      checked: 'farm_name_of_farm',
      notes: 'farm_name_of_farm_notes',
    },
    'Name of Producer(s)': {
      checked: 'farm_name_of_producer',
      notes: 'farm_name_of_producer_notes',
    },
    Species: { checked: 'farm_species', notes: 'farm_species_notes' },
    'Variety or Varieties': {
      checked: 'farm_variety',
      notes: 'farm_variety_notes',
    },
    'Harvest Date/Year': {
      checked: 'farm_harvest_date',
      notes: 'farm_harvest_date_notes',
    },
    Other: { checked: 'farm_other', notes: 'farm_other_notes' },
  };

  private processingMap: Record<string, { checked: string; notes?: string }> = {
    'Name of Processor(s)': {
      checked: 'process_name_of_processor',
      notes: 'process_name_of_processor_notes',
    },
    'Wet Mill / Station': {
      checked: 'process_wet_mill',
      notes: 'process_wet_mill_notes',
    },
    'Dry Mill': {
      checked: 'process_dry_mill',
      notes: 'process_dry_mill_notes',
    },
  };

  private tradingMap: Record<string, { checked: string; notes?: string }> = {
    'Size Grade': {
      checked: 'trading_size_grade',
      notes: 'trading_size_grade_notes',
    },
    'Other Grade': {
      checked: 'trading_other_grade',
      notes: 'trading_other_grade_notes',
    },
    'Dry Mill': {
      checked: 'trading_dry_mill',
      notes: 'trading_dry_mill_notes',
    },
    'ICO Number': {
      checked: 'trading_ico_number',
      notes: 'trading_ico_number_notes',
    },
    Other: { checked: 'trading_other', notes: 'trading_other_notes' },
  };

  private certificationsMap: Record<string, { checked: string; notes?: string }> = {
    '4C': { checked: 'certific_c4' },
    'Fair Trade': { checked: 'certific_fair_trade' },
    Organic: { checked: 'certific_organic' },
    'Rainforest Alliance': { checked: 'certific_rainforest_alliance' },
    'Geographical Indication': {
      checked: 'certific_geographical_indication',
      notes: 'certific_geographical_indication_notes',
    },
    ABIC: { checked: 'certific_abic', notes: 'certific_abic_notes' },
    Other: { checked: 'certific_other', notes: 'certific_other_notes' },
  };

  private mapChecklistToForm(
    items: ChecklistItem[],
    map: Record<string, { checked: string; notes?: string }>,
  ): Record<string, any> {
    const result: Record<string, any> = {};

    const traverse = (list: any[]) => {

      for (const item of list) {

        const itemLabel = item.label || item.name;

        if (!itemLabel) {
          console.warn('Item sem label ou name encontrado:', item);
          continue;
        }

        let mapEntry = map[itemLabel];

        if (!mapEntry) {
          const foundKey = Object.keys(map).find(
            (k) => k.replace(/\s+/g, '').toLowerCase() === itemLabel.replace(/\s+/g, '').toLowerCase(),
          );
          if (foundKey) mapEntry = map[foundKey];
        }

        if (mapEntry) {
          result[mapEntry.checked] = item.checked ? 1 : 0;
          if (mapEntry.notes) {
            result[mapEntry.notes] = item.notes ?? null;
          }
        } else {
          console.warn(`Label/Name não mapeado: "${itemLabel}"`);
        }

        if (item.subItems && item.subItems.length > 0) {
          traverse(item.subItems);
        }
        if (item.children && item.children.length > 0) {
          traverse(item.children);
        }
      }
    };

    traverse(items);
    return result;
  }

  onFarmingUpdate(items: ChecklistItem[]) {
    this.extrisincForm.get('farming')?.patchValue(this.mapChecklistToForm(items, this.farmingMap));
  }

  onProcessingUpdate(items: ChecklistItem[]) {
    this.processingItems = items;


    const flatData = this.mapChecklistToForm(items, this.processingMap);


    const pTreeItem = items.find((i) => i.hasTree && i.label.toLowerCase().includes('process'));
    const fTreeItem = items.find((i) => i.hasTree && i.label.toLowerCase().includes('ferment'));


    const getTreeValues = (treeData: TreeItem[] | undefined) => {
      const values: any = {};
      if (!treeData) return values;

      const fillValues = (nodes: TreeItem[]) => {
        nodes.forEach((node) => {
          const fieldName = this.mapTreeNameToField(node.name);
          if (fieldName) {
            values[fieldName] = node.checked ? 1 : 0;
            if (node.allowNotes) {
              values[`${fieldName}_notes`] = node.notes || '';
            }
          }

          if (node.children && node.children.length > 0) {
            fillValues(node.children);
          }
        });
      };
      fillValues(treeData);
      return values;
    };


    const pTreeValues = getTreeValues(pTreeItem?.subItems);
    const fTreeValues = getTreeValues(fTreeItem?.subItems);


    this.extrisincForm.get('processing')?.patchValue(
      {
        ...flatData,
        processingTree: pTreeValues,
        fermentationTree: fTreeValues,
      },
      { emitEvent: false },
    );

    this.formChange.emit(this.extrisincForm.value);
  }

  private mapTreeNameToField(name: string): string | null {

    if (name.includes('TYPE_OF_PROCESSING.FRUIT_DRIED')) return 'process_fruit_dried';
    if (name.includes('TYPE_OF_PROCESSING.MUCIMAGE_DRIED')) return 'process_mucilage_dried';
    if (name.includes('TYPE_OF_PROCESSING.PARCHMENT_DRIED')) return 'process_parchment_dried';
    if (name.includes('TYPE_OF_PROCESSING.SEED_DRIED')) return 'process_seed_dried';
    if (name.includes('TYPE_OF_PROCESSING.OTHER')) return 'process_other';

    if (name.includes('TYPE_OF_FERMENTATION.LACTIC')) return 'process_lactic';
    if (name.includes('TYPE_OF_FERMENTATION.ANAEROBIC')) return 'process_anaerobic';
    if (name.includes('TYPE_OF_FERMENTATION.CARBONIC_MACERATION')) return 'process_carbonic_maceration';
    if (name.includes('TYPE_OF_FERMENTATION.MULTIPLE_FERMENTATIONS')) return 'process_multiple_fermentations';
    if (name.includes('TYPE_OF_FERMENTATION.CO_FERTILIZATION')) return 'process_co_fermentation';

    return null;
  }

  onTradingUpdate(items: ChecklistItem[]) {
    this.extrisincForm.get('trading')?.patchValue(this.mapChecklistToForm(items, this.tradingMap));
  }

  onCertificationsUpdate(items: ChecklistItem[]) {
    this.extrisincForm.get('certifications')?.patchValue(this.mapChecklistToForm(items, this.certificationsMap));
  }

  onImpressionValueUpdate(value: string | number | null) {
    if (!this.extrisincForm.contains('impression_of_value')) {
      console.warn('Campo impression_of_value não existe no formulário');
      return;
    }

    this.extrisincForm.patchValue({ impression_of_value: value ?? null }, { emitEvent: true });
  }

  onSubmit() {
    this.submitForm.emit();
  }

  private createDefaultFarmingItems(): ChecklistItem[] {
    return [
      { label: 'Country', checked: false, notes: '', allowNotes: true },
      { label: 'Region', checked: false, notes: '' },
      { label: 'Name of Farm or Co-op', checked: false, notes: '' },
      { label: 'Name of Producer(s)', checked: false, notes: '' },
      { label: 'Species', checked: false, notes: '' },
      { label: 'Variety or Varieties', checked: false, notes: '' },
      { label: 'Harvest Date/Year', checked: false, notes: '' },
      { label: 'Other', checked: false, notes: '' },
    ];
  }

  private createDefaultProcessingTree(): TreeItem[] {
    return [
      {
        name: 'EXTRISINC_FORM.PROCESSING.TYPE_OF_PROCESSING.TITLE',
        children: [
          { name: 'EXTRISINC_FORM.PROCESSING.TYPE_OF_PROCESSING.FRUIT_DRIED', checked: false },
          { name: 'EXTRISINC_FORM.PROCESSING.TYPE_OF_PROCESSING.MUCIMAGE_DRIED', checked: false },
          { name: 'EXTRISINC_FORM.PROCESSING.TYPE_OF_PROCESSING.PARCHMENT_DRIED', checked: false },
          { name: 'EXTRISINC_FORM.PROCESSING.TYPE_OF_PROCESSING.SEED_DRIED', checked: false },
          { name: 'EXTRISINC_FORM.PROCESSING.TYPE_OF_PROCESSING.OTHER', checked: false, allowNotes: true },
        ],
      },
    ];
  }

  private createDefaultFermentationTree(): TreeItem[] {
    return [
      {
        name: 'EXTRISINC_FORM.PROCESSING.TYPE_OF_FERMENTATION.TITLE',
        children: [
          { name: 'EXTRISINC_FORM.PROCESSING.TYPE_OF_FERMENTATION.LACTIC', checked: false },
          { name: 'EXTRISINC_FORM.PROCESSING.TYPE_OF_FERMENTATION.ANAEROBIC', checked: false },
          { name: 'EXTRISINC_FORM.PROCESSING.TYPE_OF_FERMENTATION.CARBONIC_MACERATION', checked: false },
          { name: 'EXTRISINC_FORM.PROCESSING.TYPE_OF_FERMENTATION.MULTIPLE_FERMENTATIONS', checked: false },
          { name: 'EXTRISINC_FORM.PROCESSING.TYPE_OF_FERMENTATION.CO_FERTILIZATION', checked: false },
        ],
      },
    ];
  }

  private createDefaultProcessingItems(): ChecklistItem[] {
    return [
      { label: 'Name of Processor(s)', checked: false, notes: '' },
      { label: 'Wet Mill / Station', checked: false, allowNotes: false },
      { label: 'Dry Mill', checked: false, allowNotes: false },
      {
        label: 'Type of processing:',
        checked: false,
        hasTree: true,
        subItems: this.createDefaultProcessingTree(),
      },
      {
        label: 'Type of fermentation:',
        checked: false,
        hasTree: true,
        subItems: this.createDefaultFermentationTree(),
      },
    ];
  }

  private createDefaultTradingItems(): ChecklistItem[] {
    return [
      { label: 'Size Grade', checked: false, notes: '' },
      { label: 'Other Grade', checked: false, notes: '' },
      { label: 'Dry Mill', checked: false, notes: '' },
      { label: 'ICO Number', checked: false, notes: '' },
      { label: 'Other', checked: false, notes: '' },
    ];
  }

  private createDefaultCertificationsItems(): ChecklistItem[] {
    return [
      { label: '4C', checked: false, allowNotes: false },
      { label: 'Fair Trade', checked: false, allowNotes: false },
      { label: 'Organic', checked: false, allowNotes: false },
      { label: 'Rainforest Alliance', checked: false, allowNotes: false },
      { label: 'Geographical Indication', checked: false, notes: '' },
      { label: 'ABIC', checked: false, notes: '' },
      { label: 'Other', checked: false, notes: '' },
    ];
  }

  private syncChecklistFromForm(
    items: ChecklistItem[],
    map: Record<string, { checked: string; notes?: string }>,
    formGroupName: string,
  ): ChecklistItem[] {
    const formGroup = this.extrisincForm.get(formGroupName);
    if (!formGroup) return items;

    return items.map((item) => {
      const mapEntry = map[item.label];
      if (!mapEntry) return item;

      return {
        ...item,
        checked: !!formGroup.get(mapEntry.checked)?.value,
        notes: mapEntry.notes ? (formGroup.get(mapEntry.notes)?.value ?? '') : item.notes,
      };
    });
  }

  private syncTreesFromForm(items: ChecklistItem[]): ChecklistItem[] {
    return items.map((item) => {
      if (!item.hasTree || !item.subItems) return item;

      const groupName = item.label.toLowerCase().includes('process') ? 'processingTree' : 'fermentationTree';
      const groupValues = this.extrisincForm.get(`processing.${groupName}`)?.value;

      if (groupValues) {
        const updateNodes = (nodes: TreeItem[]) => {
          nodes.forEach((node) => {
            const fieldName = this.mapTreeNameToField(node.name);
            if (fieldName && groupValues[fieldName] !== undefined) {
              node.checked = groupValues[fieldName] === 1;
              if (node.allowNotes) node.notes = groupValues[`${fieldName}_notes`] || '';
            }
            if (node.children) updateNodes(node.children);
          });
        };
        updateNodes(item.subItems);
      }
      return item;
    });
  }

  private applyMode() {

    this.formHeader.enable({ emitEvent: false });

    if (this.cadastrarAnalise) {
      this.formFarming.enable({ emitEvent: false });
      this.formProcessing.enable({ emitEvent: false });
      this.formTrading.enable({ emitEvent: false });
      this.formCertifications.enable({ emitEvent: false });
      this.impressionOfValueControl?.disable({ emitEvent: false });
      return;
    }

    this.formFarming.disable({ emitEvent: false });
    this.formProcessing.disable({ emitEvent: false });
    this.formTrading.disable({ emitEvent: false });
    this.formCertifications.disable({ emitEvent: false });
    this.impressionOfValueControl?.enable({ emitEvent: false });
  }
}
