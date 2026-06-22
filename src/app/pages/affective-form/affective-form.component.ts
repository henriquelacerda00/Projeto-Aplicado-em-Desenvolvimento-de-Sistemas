import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../core/material/material.module';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from '../../components/container/container.component';
import { FormsHeaderComponent } from '../../components/forms-header/forms-header.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LegendGroupAffectiveComponent } from './legend-group-affective/legend-group-affective.component';
import { GroupAffectiveComponent } from './group-affective/group-affective.component';
import { DefectsAffectiveComponent } from './defects-affective/defects-affective.component';
import { NotificationService } from '../../core/services/notification.service';
import { CuppingScoreService } from '../../core/services/cupping-score.service';
import { SupabaseService } from '../../core/services/supabase.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { PageEvent } from '@angular/material/paginator';
import { LoadingService } from '../../core/services/loading.service';
import { environment } from '../../../environments/environment.development';


@Component({
  selector: 'app-affective-form',
  imports: [
    MaterialModule,
    CommonModule,
    ContainerComponent,
    FormsHeaderComponent,
    LegendGroupAffectiveComponent,
    FormsModule,
    ReactiveFormsModule,
    GroupAffectiveComponent,
    DefectsAffectiveComponent,
    TranslateModule
  ],
  templateUrl: './affective-form.component.html',
  styleUrls: ['./affective-form.component.scss'],
})
export class AffectiveFormComponent implements OnInit {
  private url = environment.supabaseUrl;

  isLoading: boolean = false;
  affectiveForm!: FormGroup;
  @ViewChild(MatStepper) stepper!: MatStepper;
  @ViewChild('formheader') formheader!: ElementRef;
  samples: any[] = [];
  sessionId!: string | null;

  fragranceSampleIndex = 0;
  aromaSampleIndex = 0;
  beverageSampleIndex = 0;
  animationTrigger = 0;


  fragranceData: Record<number, any> = {};
  aromaData: Record<number, any> = {};
  beverageData: Record<number, any> = {};

  fragranceSent = false;
  aromaSent = false;

  impressionOfQualityItems = [
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

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private notificationService: NotificationService,
    private cuppingScoreService: CuppingScoreService,
    private route: ActivatedRoute,
    public loading: LoadingService,
    private router: Router
  ) {
    this.sessionId = this.route.snapshot.paramMap.get('session_id');
    this.affectiveForm = this.fb.group({
      header: this.fb.group({
        sample_number: ['', [Validators.required]],
      }),
      fragrance: this.fb.group({ form_type: ['Affective'], value: [null], notes: [''] }),
      aroma: this.fb.group({ form_type: ['Affective'], value: [null], notes: [''] }),
      flavor: this.fb.group({ value: [null], notes: [''] }),
      aftertaste: this.fb.group({ value: [null], notes: [''] }),
      acidity: this.fb.group({ value: [null], notes: [''] }),
      sweetness: this.fb.group({ value: [null], notes: [''] }),
      mouthfeel: this.fb.group({ value: [null], notes: [''] }),
      overall: this.fb.group({ value: [null], notes: [''] }),
      defects: this.fb.group({
        non_uniform_cups: this.fb.array(Array(5).fill(false).map(() => this.fb.control(false))),
        defective_cups: this.fb.array(Array(5).fill(false).map(() => this.fb.control(false))),
        defects_any: this.fb.array(Array(3).fill(false).map(() => this.fb.control(false))),
      }),
    });
  }

  async ngOnInit() {
    if (!this.sessionId) return;
    this.samples = await this.supabaseService.getSamplesBySession(this.sessionId);
    if (this.samples.length > 0) {
      this.updateHeader(this.samples[0].sample_number);
    }
  }

  loadSample(stepIndex: number, newSampleIndex: number) {
    if (!this.samples?.length) return;

    // 🔥 1. SALVAR AMOSTRA ATUAL (em memória)
    if (stepIndex === 0) {
      const current = this.samples[this.fragranceSampleIndex];
      if (current) this.fragranceData[current.id] = this.fragranceForm.getRawValue();
      this.fragranceSampleIndex = newSampleIndex;
    }
    if (stepIndex === 1) {
      const current = this.samples[this.aromaSampleIndex];
      if (current) this.aromaData[current.id] = this.aromaForm.getRawValue();
      this.aromaSampleIndex = newSampleIndex;
    }
    if (stepIndex === 2) {
      const current = this.samples[this.beverageSampleIndex];
      if (current) {
        this.beverageData[current.id] = {
          flavor: this.flavorForm.getRawValue(),
          aftertaste: this.aftertasteForm.getRawValue(),
          acidity: this.acidityForm.getRawValue(),
          sweetness: this.sweetnessForm.getRawValue(),
          mouthfeel: this.mouthfeelForm.getRawValue(),
          overall: this.overallForm.getRawValue(),
          defects: this.defectsForm.getRawValue()
        };
      }
      this.beverageSampleIndex = newSampleIndex;
    }

    const newSample = this.samples[newSampleIndex];
    if (!newSample) return;

    // 📥 2. CARREGAR DADOS SALVOS (da memória)
    if (stepIndex === 0) {
      const saved = this.fragranceData[newSample.id];
      if (saved) {
        this.fragranceForm.patchValue(saved, { emitEvent: true });
      } else {
        this.fragranceForm.reset({ form_type: 'Affective', value: null, notes: '' }, { emitEvent: true });
      }
    }
    if (stepIndex === 1) {
      const saved = this.aromaData[newSample.id];
      if (saved) {
        this.aromaForm.patchValue(saved, { emitEvent: true });
      } else {
        this.aromaForm.reset({ form_type: 'Affective', value: null, notes: '' }, { emitEvent: true });
      }
    }
    if (stepIndex === 2) {
      const saved = this.beverageData[newSample.id];
      const empty = { value: null, notes: '' };
      if (saved) {
        this.flavorForm.patchValue(saved.flavor || empty, { emitEvent: true });
        this.aftertasteForm.patchValue(saved.aftertaste || empty, { emitEvent: true });
        this.acidityForm.patchValue(saved.acidity || empty, { emitEvent: true });
        this.sweetnessForm.patchValue(saved.sweetness || empty, { emitEvent: true });
        this.mouthfeelForm.patchValue(saved.mouthfeel || empty, { emitEvent: true });
        this.overallForm.patchValue(saved.overall || empty, { emitEvent: true });
        this.defectsForm.patchValue(saved.defects || {}, { emitEvent: true });
      } else {
        this.flavorForm.reset(empty, { emitEvent: true });
        this.aftertasteForm.reset(empty, { emitEvent: true });
        this.acidityForm.reset(empty, { emitEvent: true });
        this.sweetnessForm.reset(empty, { emitEvent: true });
        this.mouthfeelForm.reset(empty, { emitEvent: true });
        this.overallForm.reset(empty, { emitEvent: true });
        this.defectsForm.reset({}, { emitEvent: true });
      }
    }
    this.updateHeader(newSample.sample_number);
  }

  async updateHeader(sampleNumber: number) {
    this.formHeader.patchValue({ sample_number: sampleNumber });
  }

  onStepChange(event: StepperSelectionEvent) {
    const previous = event.previouslySelectedIndex;
    const next = event.selectedIndex;
    if (next === 1 && !this.fragranceSent) { this.stepper.selectedIndex = previous; return; }
    if (next === 2 && !this.aromaSent) { this.stepper.selectedIndex = previous; return; }
    this.loadSample(next, 0);
  }

  onFragrancePageChange(event: PageEvent) { this.loadSample(0, event.pageIndex); this.scrollToTop(); }
  onAromaPageChange(event: PageEvent) { this.loadSample(1, event.pageIndex); this.scrollToTop(); }
  onBeveragePageChange(event: PageEvent) { this.loadSample(2, event.pageIndex); this.scrollToTop(); }
  private scrollToTop() {
    setTimeout(() => {
      this.formheader?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.animationTrigger++;
    }, 0);
  }

  get formHeader() { return this.affectiveForm.get('header') as FormGroup; }
  get fragranceForm() { return this.affectiveForm.get('fragrance') as FormGroup; }
  get aromaForm() { return this.affectiveForm.get('aroma') as FormGroup; }
  get flavorForm() { return this.affectiveForm.get('flavor') as FormGroup; }
  get aftertasteForm() { return this.affectiveForm.get('aftertaste') as FormGroup; }
  get acidityForm() { return this.affectiveForm.get('acidity') as FormGroup; }
  get sweetnessForm() { return this.affectiveForm.get('sweetness') as FormGroup; }
  get mouthfeelForm() { return this.affectiveForm.get('mouthfeel') as FormGroup; }
  get overallForm() { return this.affectiveForm.get('overall') as FormGroup; }
  get defectsForm() { return this.affectiveForm.get('defects') as FormGroup; }

  get isLastSample(): boolean {
    const total = this.samples.length;
    const step = this.stepper?.selectedIndex || 0;
    if (step === 0) return this.fragranceSampleIndex === total - 1;
    if (step === 1) return this.aromaSampleIndex === total - 1;
    if (step === 2) return this.beverageSampleIndex === total - 1;
    return false;
  }

  async sendBulkData(groupName: 'Fragrance' | 'Aroma' | 'Beverage') {
    const TOTAL_STEPS = 3;

    this.isLoading = true;
    this.loading.show();

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

      if (groupName === 'Fragrance') {
        const current = this.samples[this.fragranceSampleIndex];
        if (current) dataMap[current.id] = this.fragranceForm.getRawValue();
      }

      if (groupName === 'Aroma') {
        const current = this.samples[this.aromaSampleIndex];
        if (current) dataMap[current.id] = this.aromaForm.getRawValue();
      }

      if (groupName === 'Beverage') {
        const current = this.samples[this.beverageSampleIndex];
        if (current) {
          dataMap[current.id] = {
            flavor: this.flavorForm.getRawValue(),
            aftertaste: this.aftertasteForm.getRawValue(),
            acidity: this.acidityForm.getRawValue(),
            sweetness: this.sweetnessForm.getRawValue(),
            mouthfeel: this.mouthfeelForm.getRawValue(),
            overall: this.overallForm.getRawValue(),
            defects: this.defectsForm.getRawValue()
          };
        }
      }

      const allPayloads: any[] = [];

      for (const sample of this.samples) {
        const savedData = dataMap[sample.id];
        if (!savedData) continue;

        let convertedData: any = {};

        if (groupName === 'Fragrance' || groupName === 'Aroma') {
          const prefix = groupName.toLowerCase();
          convertedData[`${prefix}_slider_value`] = savedData.value;
          convertedData[`${prefix}_notes`] = savedData.notes;
        } else {
          const nonUniformCount =
            savedData.defects.non_uniform_cups?.filter((v: boolean) => v).length ?? 0;

          const defectiveCount =
            savedData.defects.defective_cups?.filter((v: boolean) => v).length ?? 0;

          const defectsAny = savedData.defects.defects_any || [];

          convertedData = {
            flavor_slider: savedData.flavor.value,
            flavor_aftertaste_notes: savedData.flavor.notes,
            aftertaste_slider: savedData.aftertaste.value,
            acidity_slider: savedData.acidity.value,
            notes_acidity: savedData.acidity.notes,
            sweetness_slider: savedData.sweetness.value,
            notes_sweetness: savedData.sweetness.notes,
            mouthfeel_slider: savedData.mouthfeel.value,
            notes_mouthfeel: savedData.mouthfeel.notes,
            overall_slider: savedData.overall.value,
            overall_notes: savedData.overall.notes,
            non_uniform_cups: nonUniformCount,
            defective_cups: defectiveCount,
            moldy: defectsAny[0] ? 1 : 0,
            phenolic: defectsAny[1] ? 1 : 0,
            potato: defectsAny[2] ? 1 : 0
          };
        }

        allPayloads.push({
          user_id: user.id,
          name: user.user_metadata?.['full_name'] || 'Unknown',
          purpose: await this.supabaseService.getSessionName(this.sessionId!) || 'Unknown',
          sample_number: String(sample.sample_number),
          date: new Date().toISOString().split('T')[0],
          form_type: 'Affective',
          session_sample_id: sample.id,
          ...convertedData
        });
      }

      if (allPayloads.length > 0) {
        await this.supabaseService.insertData(tableName, allPayloads);
      }

      const currentStepIndex = this.stepper.selectedIndex;

      if (groupName === 'Fragrance') {
        this.fragranceSent = true;
      }

      if (groupName === 'Aroma') {
        this.aromaSent = true;
      }

      if (currentStepIndex < TOTAL_STEPS - 1) {
        this.stepper.next();
        setTimeout(() => {
          this.formheader?.nativeElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }, 0);
      } else {
        this.router.navigate(['/minha-sessao']);
      }

      this.notificationService.success(`✅ ${groupName} enviado com sucesso!`);

    } catch (error) {
      console.error(error);
      this.notificationService.error(`❌ Erro ao enviar ${groupName}`);
    } finally {
      this.isLoading = false;
      this.loading.hide();

      const { data, error } = await this.supabaseService.getSession();

      if (!error && data?.session) {
        await fetch(`${environment.supabaseUrl}/functions/v1/consolidate_session_forms`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.session.access_token}`
          },
          body: JSON.stringify({ session_id: this.sessionId })
        });
      }
    }
  }


}