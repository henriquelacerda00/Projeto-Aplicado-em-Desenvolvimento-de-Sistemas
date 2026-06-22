import { Component, ElementRef, ViewChild } from '@angular/core';
import { MaterialModule } from '../../core/material/material.module';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from '../../components/container/container.component';
import { FormsHeaderComponent } from '../../components/forms-header/forms-header.component';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SizeElement, TableSizeComponent } from './table-size/table-size.component';

import { NotificationService } from '../../core/services/notification.service';
import { SupabaseService } from '../../core/services/supabase.service';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { LoadingService } from '../../core/services/loading.service';

@Component({
  selector: 'app-size-table',
  imports: [
    MaterialModule,
    CommonModule,
    ContainerComponent,
    FormsHeaderComponent,
    FormsHeaderComponent,
    FormsModule,
    ReactiveFormsModule,
    TableSizeComponent,
    TranslateModule
  ],
  templateUrl: './size-table.component.html',
  styleUrl: './size-table.component.scss',
})
export class SizeTableComponent {
  isLoading: boolean = false;
  @ViewChild('formheader') formheader: ElementRef | undefined;
  sizeForm!: FormGroup;
  private sampleNumber!: string | null;
  private sessionId!: string | null;
  sessionName!: string;
  samples: any[] = [];
  currentSampleIndex = 0;
  sampleFormData: { [sampleId: number]: any } = {};
  animationTrigger = 0;

  constructor(
    private formBuilder: FormBuilder,
    private supabaseService: SupabaseService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    public loading : LoadingService,
    private router : Router
  ) {
    this.sampleNumber = this.route.snapshot.paramMap.get('sample_id');
    this.sessionId = this.route.snapshot.paramMap.get('session_id');
    this.sizeForm = this.formBuilder.group({
      header: this.formBuilder.group({
        sample_number: [this.sampleNumber, Validators.required],

      }),
      weightWithoutDefects: ['', [Validators.required, Validators.min(1)]],
      sizes: this.formBuilder.array([]),
    });
  }

  async ngOnInit(): Promise<void> {
    this.sessionId = this.route.snapshot.paramMap.get('session_id');
    console.log(this.sessionId);
    this.initSizes();
    await this.loadSamples();
  }

  async loadSamples() {
    if (!this.sessionId) return;

    this.samples = await this.supabaseService.getSamplesBySession(this.sessionId);

    if (this.samples.length > 0) {
      this.setCurrentSample(0);
    }
  }

  setCurrentSample(index: number) {

    this.currentSampleIndex = index;

    const sample = this.samples[index];
    if (!sample) return;

    const savedData = this.sampleFormData[sample.id];

    if (savedData) {

      this.sizeForm.patchValue(savedData);

    } else {

      // reseta apenas campos simples
      this.sizeForm.patchValue({
        header: {
          sample_number: sample.sample_number,
          name: '',
          date: '',
          purpose: ''
        },
        weightWithoutDefects: ''
      });

      // limpa valores mas mantém estrutura
      this.sizes.controls.forEach(control => {
        control.patchValue({
          g: 0,
          percentage: 0
        });
      });
    }
  }

  get formHeader() {
    return this.sizeForm.get('header') as FormGroup;
  }

  get weightWithoutDefects() {
    return this.sizeForm.get('weightWithoutDefects') as FormControl;
  }

  get sizes(): FormArray {
    return this.sizeForm.get('sizes') as FormArray;
  }

  get isLastSample(): boolean {
    return this.samples &&
      this.samples.length > 0 &&
      this.currentSampleIndex === this.samples.length - 1;
  }

  onWeightChange(value: number) {
    this.sizeForm.get('weightWithoutDefects')?.setValue(value) || null;
  }

  onSizesChange(sizes: any[]) {
    const sizeGroups = sizes.map((sizeElement) => {
      return this.formBuilder.group({
        size: [sizeElement.size],
        g: [sizeElement.g],
        percentage: [sizeElement.percentage],
      });
    });

    this.sizeForm.setControl('sizes', this.formBuilder.array(sizeGroups));
  }

  onPageChange(event: PageEvent) {

    const currentSample = this.samples[this.currentSampleIndex];

    if (currentSample) {
      this.sampleFormData[currentSample.id] = this.sizeForm.value;
    }

    this.setCurrentSample(event.pageIndex);

    setTimeout(() => {
      this.formheader?.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      this.animationTrigger ++;
    }, 0);
  }

  private initSizes() {
    const defaultSizes = [
      '#10', '#11', '#12', '#13', '#14', '#15',
      '#16', '#17', '#18', '#19', '#20', '#21', '#22', '#23'
    ];

    if (this.sizes.length === 0) {
      defaultSizes.forEach(size => {
        this.sizes.push(
          this.formBuilder.group({
            size: [size],
            g: [0],
            percentage: [0]
          })
        );
      });
    }
  }

  async onSubmit() {
    this.isLoading = true;
    this.loading.show();


    const currentSample = this.samples[this.currentSampleIndex];

    if (currentSample) {
      this.sampleFormData[currentSample.id] = this.sizeForm.value;
    }

    if (Object.keys(this.sampleFormData).length === 0) {
      this.notificationService.error('Nenhuma amostra foi preenchida.');
      return;
    }

    const userData = await this.supabaseService.getUserData();
    const userName = userData?.full_name ?? '';
    const userId = userData?.id ?? '';


    // 🔥 BUSCA AQUI, NÃO NO NGONINIT
    const sessionName = this.sessionId ? await this.supabaseService.getSessionName(this.sessionId) : null;

    try {

      for (const [sampleId, data] of Object.entries(this.sampleFormData)) {

        const sizesData = data.sizes.reduce((acc: any, sizeElement: any) => {
          const sizeNumber = sizeElement.size.replace('#', '');
          acc[`size_${sizeNumber}_g`] = sizeElement.g;
          acc[`size_${sizeNumber}_percentage`] = sizeElement.percentage;
          return acc;
        }, {});

        const payload = {
          name: userName,                     // nome do usuário logado
          date: new Date(),                 // data atual
          purpose: sessionName ?? '',       // nome da sessão
          sample_number: data.header.sample_number,
          weight_wo_defects: data.weightWithoutDefects,
          ...sizesData,
          session_sample_id: Number(sampleId),
          user_id: userId
        };

        await this.supabaseService.insertSizeTableData(payload);
      }
      this.isLoading = false;
      this.loading.hide();

      this.notificationService.success('Todas as amostras foram salvas com sucesso!');
      this.router.navigate(['/minha-sessao']);

    } catch (error) {
      console.error(error);
      this.notificationService.error('Erro ao salvar dados.');
      this.loading.hide();
    }
  }
}
