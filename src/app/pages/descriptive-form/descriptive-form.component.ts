// descriptive-form.component.ts
import { NotificationService } from './../../core/services/notification.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from '../../components/container/container.component';
import { MaterialModule } from '../../core/material/material.module';
import { FormsHeaderComponent } from '../../components/forms-header/forms-header.component';
import { GroupDescriptiveComponent } from './group-descriptive/group-descriptive.component';
import { MouthfeelCheckboxesComponent } from './mouthfeel-checkboxes/mouthfeel-checkboxes.component';
import { SupabaseService } from '../../core/services/supabase.service';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatStepper } from '@angular/material/stepper';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { LoadingService } from '../../core/services/loading.service';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-descriptive-form',
  standalone: true,
  imports: [
    ContainerComponent,
    MaterialModule,
    CommonModule,
    ReactiveFormsModule,
    FormsHeaderComponent,
    GroupDescriptiveComponent,
    MouthfeelCheckboxesComponent,
    TranslateModule,
  ],
  templateUrl: './descriptive-form.component.html',
  styleUrls: ['./descriptive-form.component.scss'],
})
export class DescriptiveFormComponent implements OnInit {
  isLoading = false;

  private url = environment.supabaseUrl;

  @ViewChild(MatStepper) stepper!: MatStepper;
  @ViewChild('formheader') formheader: ElementRef | undefined;

  sessionId!: string | null;
  samples: any[] = [];

  fragranceSampleIndex = 0;
  aromaSampleIndex = 0;
  beverageSampleIndex = 0;
  animationTrigger = 0;

  fragranceData: Record<number, any> = {};
  aromaData: Record<number, any> = {};
  beverageData: Record<number, any> = {};

  fragranceSent = false;
  aromaSent = false;

  descriptiveForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    public loading: LoadingService,
    private router: Router
  ) {
    this.sessionId = this.route.snapshot.paramMap.get('session_id');

    this.descriptiveForm = this.fb.group({
      header: this.fb.group({
        name: ['', Validators.required],
        date: ['', Validators.required],
        purpose: ['', Validators.required],
        sample_number: ['', Validators.required],
      }),
      fragrance: this.buildAromaFragranceGroup(),
      aroma: this.buildAromaFragranceGroup(),
      flavorAfterTaste: this.buildFlavorAfterTasteGroup(),
      acidity: this.buildSimpleSliderGroup(),
      sweetness: this.buildSimpleSliderGroup(),
      mouthfeel: this.buildMouthfeelGroup(),
    });
  }

  /* ===================================================
     FORM BUILDERS
  =================================================== */
  buildAromaFragranceGroup(): FormGroup {
    return this.fb.group({
      slider_value: [0],
      notes: [''],
      floral: [false],
      fruity: [false],
      berry: [false],
      dried_fruit: [false],
      citrus_fruit: [false],
      sour: [false],
      fermented: [false],
      green_vegetative: [false],
      other: [false],
      chemical: [false],
      musty_earthy: [false],
      woody: [false],
      roasted: [false],
      cereal: [false],
      burnt: [false],
      tobacco: [false],
      nutty: [false],
      cocoa: [false],
      spice: [false],
      sweet: [false],
      vanilla: [false],
      brown_sugar: [false],
      sour_fermented: [false],
      nutty_cocoa: [false],
      vanilla_vanillin: [false],
      form_type: ['Descriptive'],
    });
  }

  buildSimpleSliderGroup(): FormGroup {
    return this.fb.group({
      slider_value: [0],
      notes: [''],
    });
  }

  buildFlavorAfterTasteGroup(): FormGroup {
    return this.fb.group({
      slider_value: [0],
      slider_value_hidden: [0],
      notes: [''],
      main_taste_salty: [false],
      main_taste_bitter: [false],
      main_taste_sour: [false],
      main_taste_umami: [false],
      main_taste_sweet: [false],
      floral: [false],
      fruity: [false],
      berry: [false],
      dried_fruit: [false],
      citrus_fruit: [false],
      sour: [false],
      fermented: [false],
      green_vegetative: [false],
      other: [false],
      chemical: [false],
      musty_earthy: [false],
      woody: [false],
      roasted: [false],
      cereal: [false],
      burnt: [false],
      tobacco: [false],
      nutty: [false],
      cocoa: [false],
      spice: [false],
      sweet: [false],
      vanilla: [false],
      brown_sugar: [false],
      sour_fermented: [false],
      nutty_cocoa: [false],
      vanilla_vanillin: [false],
    });
  }

  buildMouthfeelGroup(): FormGroup {
    return this.fb.group({
      slider_value: [0],
      notes: [''],
      rough: [false],
      smooth: [false],
      metallic: [false],
      oily: [false],
      mouth_drying: [false],
    });
  }

  /* ===================================================
     INIT
  =================================================== */
  async ngOnInit() {
    if (!this.sessionId) return;
    this.samples = await this.supabaseService.getSamplesBySession(this.sessionId);
    if (this.samples.length > 0) {
      this.updateHeader(this.samples[0].sample_number);
    }
  }

  /* ===================================================
     STEP CHANGE
  =================================================== */
  onStepChange(event: StepperSelectionEvent) {
    const previous = event.previouslySelectedIndex;
    const next = event.selectedIndex;

    // Bloqueia avanço manual se step anterior não enviado
    if (next === 1 && !this.fragranceSent) this.stepper.selectedIndex = previous;
    if (next === 2 && !this.aromaSent) this.stepper.selectedIndex = previous;

    // Reset paginator visual
    if (next === 0) this.fragranceSampleIndex = 0;
    if (next === 1) this.aromaSampleIndex = 0;
    if (next === 2) this.beverageSampleIndex = 0;

    this.loadSample(next, 0);
  }

  /* ===================================================
     PAGINATION
  =================================================== */
  onPageChange(event: PageEvent, stepIndex: number) {
    this.loadSample(stepIndex, event.pageIndex);
    setTimeout(() => {
      this.formheader?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.animationTrigger++;
    }, 0);
  }

  /* ===================================================
     CORE LOAD LOGIC
  =================================================== */
  loadSample(stepIndex: number, newSampleIndex: number) {
    const currentStepIndex = this.stepper?.selectedIndex ?? 0;

    // Salva estado atual antes de trocar
    if (this.samples.length > 0) {
      const currentSample = (() => {
        if (currentStepIndex === 0) return this.samples[this.fragranceSampleIndex];
        if (currentStepIndex === 1) return this.samples[this.aromaSampleIndex];
        if (currentStepIndex === 2) return this.samples[this.beverageSampleIndex];
      })();
      if (currentSample) {
        if (currentStepIndex === 0) this.fragranceData[currentSample.id] = this.fragranceForm.value;
        if (currentStepIndex === 1) this.aromaData[currentSample.id] = this.aromaForm.value;
        if (currentStepIndex === 2)
          this.beverageData[currentSample.id] = {
            flavorAfterTaste: this.flavorAfterTasteForm.value,
            acidity: this.acidityForm.value,
            sweetness: this.sweetnessForm.value,
            mouthfeel: this.mouthfeelForm.value,
          };
      }
    }

    // Carrega nova amostra
    const newSample = this.samples[newSampleIndex];
    if (!newSample) return;

    if (stepIndex === 0) {
      const saved = this.fragranceData[newSample.id];
      this.fragranceForm.reset(saved ?? this.buildAromaFragranceGroup().value);
      this.fragranceSampleIndex = newSampleIndex;
    }
    if (stepIndex === 1) {
      const saved = this.aromaData[newSample.id];
      this.aromaForm.reset(saved ?? this.buildAromaFragranceGroup().value);
      this.aromaSampleIndex = newSampleIndex;
    }
    if (stepIndex === 2) {
      const saved = this.beverageData[newSample.id];
      if (saved) {
        this.flavorAfterTasteForm.patchValue(saved.flavorAfterTaste);
        this.acidityForm.patchValue(saved.acidity);
        this.sweetnessForm.patchValue(saved.sweetness);
        this.mouthfeelForm.patchValue(saved.mouthfeel);
      } else {
        this.flavorAfterTasteForm.reset(this.buildFlavorAfterTasteGroup().value);
        this.acidityForm.reset(this.buildSimpleSliderGroup().value);
        this.sweetnessForm.reset(this.buildSimpleSliderGroup().value);
        this.mouthfeelForm.reset(this.buildMouthfeelGroup().value);
      }
      this.beverageSampleIndex = newSampleIndex;
    }

    this.updateHeader(newSample.sample_number);
  }

  updateHeader(sampleNumber: string) {
    this.formHeader.patchValue({ sample_number: sampleNumber });
  }

  /* ===================================================
     BULK INSERT GENÉRICO
  =================================================== */
  async sendBulkData(groupName: 'Fragrance' | 'Aroma' | 'Beverage') {
    this.isLoading = true;
    this.loading.show();

    const TOTAL_STEPS = 3;

    try {
      const user = await this.supabaseService.getCurrentUser();
      if (!user) return;

      const tableName =
        groupName === 'Fragrance'
          ? 'fragrance_data'
          : groupName === 'Aroma'
            ? 'aroma_data'
            : 'beverage_data';

      const dataMap =
        groupName === 'Fragrance'
          ? this.fragranceData
          : groupName === 'Aroma'
            ? this.aromaData
            : this.beverageData;

      // 🔹 Preenche todas as amostras do stepper para garantir envio
      this.samples.forEach(sample => {
        if (!dataMap[sample.id]) {
          if (groupName === 'Beverage') {
            dataMap[sample.id] = {
              flavorAfterTaste: this.flavorAfterTasteForm.value,
              acidity: this.acidityForm.value,
              sweetness: this.sweetnessForm.value,
              mouthfeel: this.mouthfeelForm.value,
            };
          } else {
            // Fragrance ou Aroma
            const formGroup = groupName === 'Fragrance' ? this.fragranceForm.value : this.aromaForm.value;
            dataMap[sample.id] = { ...formGroup };
          }
        }
      });

      const allPayloads: any[] = [];

      for (const sample of this.samples) {
        const savedData = dataMap[sample.id];
        if (!savedData) continue;

        let convertedData: any = {};

        if (groupName === 'Beverage') {
          ['flavorAfterTaste', 'acidity', 'sweetness', 'mouthfeel'].forEach(section => {
            Object.entries(savedData[section]).forEach(([key, value]) => {
              let dbKey = key;

              if (section === 'flavorAfterTaste') {
                if (key === 'slider_value') dbKey = 'flavor_slider';
                if (key === 'slider_value_hidden') dbKey = 'aftertaste_slider';
                if (key === 'notes') dbKey = 'flavor_aftertaste_notes';
              }
              if (section === 'acidity') {
                if (key === 'slider_value') dbKey = 'acidity_slider';
                if (key === 'notes') dbKey = 'notes_acidity';
              }
              if (section === 'sweetness') {
                if (key === 'slider_value') dbKey = 'sweetness_slider';
                if (key === 'notes') dbKey = 'notes_sweetness';
              }
              if (section === 'mouthfeel') {
                if (key === 'slider_value') dbKey = 'mouthfeel_slider';
                if (key === 'notes') dbKey = 'notes_mouthfeel';
              }

              convertedData[dbKey] = typeof value === 'boolean' ? (value ? 1 : 0) : value;
            });
          });
        } else {
          const prefix = groupName.toLowerCase();
          Object.entries(savedData).forEach(([key, value]) => {
            const dbKey = key === 'slider_value' || key === 'notes' ? `${prefix}_${key}` : key;
            convertedData[dbKey] = typeof value === 'boolean' ? (value ? 1 : 0) : value;
          });
        }

        allPayloads.push({
          user_id: user.id,
          name: user.user_metadata?.['full_name'] || 'Unknown',
          purpose: await this.supabaseService.getSessionName(this.sessionId!) || 'Unknown',
          sample_number: String(sample.sample_number),
          date: new Date().toISOString().split('T')[0],
          form_type: 'Descriptive',
          session_sample_id: sample.id,
          ...convertedData,
        });
      }

      if (allPayloads.length > 0) {
        console.log(`Enviando ${allPayloads.length} amostras para ${tableName}...`);
        const response = await this.supabaseService.insertData(tableName, allPayloads);
        if (response && (response as any).error) throw (response as any).error;
      }

      if (groupName === 'Fragrance') this.fragranceSent = true;
      if (groupName === 'Aroma') this.aromaSent = true;

      if (this.stepper.selectedIndex < TOTAL_STEPS - 1) {
        this.stepper.next();
        setTimeout(() => {
          this.formheader?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 0);
      } else {
        this.router.navigate(['/minha-sessao']);
      }

      this.notificationService.success(`✅ ${groupName} enviado com sucesso!`);

    } catch (error: any) {
      console.error(error);
      this.notificationService.error(`❌ Erro ao enviar ${groupName}`);
    } finally {
      this.isLoading = false;
      this.loading.hide();
      const { data, error } = await this.supabaseService.getSession();

      if (error || !data?.session) {
        console.error('Usuário não autenticado');
        return;
      }

      const accessToken = data.session.access_token;

      await fetch(`${this.url}/functions/v1/consolidate_session_forms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ session_id: this.sessionId })
      });
    }
  }

  /* ===================================================
     GETTERS
  =================================================== */
  get formHeader() { return this.descriptiveForm.get('header') as FormGroup; }
  get fragranceForm() { return this.descriptiveForm.get('fragrance') as FormGroup; }
  get aromaForm() { return this.descriptiveForm.get('aroma') as FormGroup; }
  get flavorAfterTasteForm() { return this.descriptiveForm.get('flavorAfterTaste') as FormGroup; }
  get acidityForm() { return this.descriptiveForm.get('acidity') as FormGroup; }
  get sweetnessForm() { return this.descriptiveForm.get('sweetness') as FormGroup; }
  get mouthfeelForm() { return this.descriptiveForm.get('mouthfeel') as FormGroup; }

  get isLastSample(): boolean {
    if (!this.samples || this.samples.length === 0) return false;
    const lastIndex = this.samples.length - 1;
    const stepIndex = this.stepper?.selectedIndex ?? 0;

    if (stepIndex === 0) return this.fragranceSampleIndex === lastIndex;
    if (stepIndex === 1) return this.aromaSampleIndex === lastIndex;
    if (stepIndex === 2) return this.beverageSampleIndex === lastIndex;

    return false;
  }
}