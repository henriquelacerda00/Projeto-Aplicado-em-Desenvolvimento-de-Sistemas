import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../core/material/material.module';
import { FormsHeaderComponent } from '../../components/forms-header/forms-header.component';
import { ContainerComponent } from '../../components/container/container.component';
import { ColorsPhysicalComponent } from './colors-physical/colors-physical.component';
import { PhysicalDefect, TablePhysicalComponent } from './table-physical/table-physical.component';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { NotificationService } from '../../core/services/notification.service';
import { PhysicalAssessment } from '../../core/types/tables.interface';
import { SupabaseService } from '../../core/services/supabase.service';
import { TranslateModule } from '@ngx-translate/core';
import { SidebarService } from '../../core/services/sidebar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../core/services/loading.service';



@Component({
  selector: 'app-physical-assessments',
  imports: [
    MaterialModule,
    FormsHeaderComponent,
    ContainerComponent,
    ColorsPhysicalComponent,
    TablePhysicalComponent,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    CommonModule
  ],
  templateUrl: './physical-assessments.component.html',
  styleUrl: './physical-assessments.component.scss',
})
export class PhysicalAssessmentsComponent implements OnInit {
  isLoading = false;

  physicalForm!: FormGroup;
  drawerOpened = false;
  @ViewChild(TablePhysicalComponent) table!: TablePhysicalComponent;
  @ViewChild('formheader') formheader: ElementRef | undefined;
  private sampleNumber!: string | null;
  private sessionId!: string | null;
  private user!: any;
  private date: string = new Date().toLocaleString('pt-BR');
  sampleFormData: { [sampleId: number]: any } = {};
  samples: any[] = [];
  currentSampleIndex = 0;
  animationTrigger = 0;

  constructor(
    private formBuilder: FormBuilder,
    private supabaseService: SupabaseService,
    private notificationService: NotificationService,
    private sidebarService: SidebarService,
    private route: ActivatedRoute,
    public loading : LoadingService,
    private router : Router
  ) {
    this.sampleNumber = this.route.snapshot.paramMap.get('sample_id')
    this.sessionId = this.route.snapshot.paramMap.get('session_id')
    

    this.physicalForm = this.formBuilder.group({
      header: this.formBuilder.group({
        sample_number: [this.sampleNumber, Validators.required],
        name: ['', Validators.required],
        date: [this.date, Validators.required],
        // purpose: ['', Validators.required],
      }),
      colors: this.formBuilder.group({
        'Blue Grenn': [false],
        'Bluish-Green': [false],
        Green: [false],
        Greenish: [false],
        'Yellow-Green': [false],
        'Pable Yellow': [false],
        Yellowish: [false],
        Brownish: [false],
      }),
      table: this.formBuilder.array([]),
      moisture: [null, Validators.required], // se for número, null ou 0
      totalGreenDefects: [0], // inicializa com zero
      cobtype: [''], // string vazio
      tdg_300: [0],
    });

  }
  async ngOnInit(): Promise<void> {
    this.sidebarService.sidebarVisible.subscribe(visible => {
      this.drawerOpened = visible;
    });

    this.supabaseService.getCurrentUser().then(user => {
      this.user = user;
      if (this.user) {
        this.physicalForm.patchValue({
          header: {
            name: this.user.user_metadata?.full_name ?? '',
          },
        });
      }
    });

    this.sessionId = this.route.snapshot.paramMap.get('session_id')!;
    await this.loadSamples();

  }

  async loadSamples() {
    if (!this.sessionId) return;

    this.samples = await this.supabaseService.getSamplesBySession(this.sessionId);

    if (this.samples.length > 0) {
      this.setCurrentSample(0);
    }

    console.log('Samples carregadas:', this.samples);
  }

  setCurrentSample(index: number) {
    this.currentSampleIndex = index;

    const sample = this.samples[index];
    if (!sample) return;

    const savedData = this.sampleFormData[sample.id];

    if (savedData) {
      this.physicalForm.reset(savedData);
    } else {
      this.physicalForm.reset({
        header: {
          sample_number: sample.sample_number,
          name: this.user?.user_metadata?.full_name ?? '',
          date: this.date
        },
        colors: {
          'Blue Grenn': false,
          'Bluish-Green': false,
          Green: false,
          Greenish: false,
          'Yellow-Green': false,
          'Pable Yellow': false,
          Yellowish: false,
          Brownish: false,
        },
        table: this.formTable.value,
        moisture: null,
        totalGreenDefects: 0,
        tdg_300: 0,
        cobtype: ''
      });

      this.formTable.controls.forEach(control => {
        control.get('defectCount')?.setValue(0);
        control.get('fullDefectCount')?.setValue(0);
      });
    }
  }

  onPageChange(event: PageEvent) {

    const currentSample = this.samples[this.currentSampleIndex];

    if (currentSample) {
      this.sampleFormData[currentSample.id] = this.physicalForm.value;
    }

    this.setCurrentSample(event.pageIndex);

    setTimeout(() => {
      this.formheader?.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      this.animationTrigger++;
    }, 0);

  }

  get formHeader() {
    return this.physicalForm.get('header') as FormGroup;
  }

  get formColors() {
    return this.physicalForm.get('colors') as FormGroup;
  }

  get formTable() {
    return this.physicalForm.get('table') as FormArray;
  }

  get isLastSample(): boolean {
    return this.samples &&
      this.samples.length > 0 &&
      this.currentSampleIndex === this.samples.length - 1;
  }

  onCobtypeChange(value: string) {
    this.physicalForm.get('cobtype')?.setValue(value);
  }

  onTotalGreenDefectsChange(value: number) {
    this.physicalForm.get('totalGreenDefects')?.setValue(value);
  }

  onTdg300Change(value: number) {
    this.physicalForm.get('tdg_300')?.setValue(value);
  }

  private mapDefects(table: any[]): Partial<PhysicalAssessment> {
    const result: any = {};

    table.forEach((defeito: any) => {
      const name = defeito.name
        .toLowerCase()
        .replace(/[ \/]+/g, '_') // substitui qualquer sequência de espaço/barras por um único "_"
        .replace(/_+/g, '_'); // elimina underscores duplos ou triplos
      result[`dc_${name}`] = defeito.defectCount;
      result[`tc_${name}`] = defeito.fullDefectCount;
    });

    return result;
  }

  async onSubmit() {
    this.isLoading = true;
    this.loading.show();
    // 🔹 Salva também a sample atual antes de finalizar
    const currentSample = this.samples[this.currentSampleIndex];
    if (currentSample) {
      this.sampleFormData[currentSample.id] = this.physicalForm.value;
    }

    // 🔹 Verifica se existe pelo menos uma sample preenchida
    if (Object.keys(this.sampleFormData).length === 0) {
      this.notificationService.error('Nenhuma amostra foi preenchida.');
      return;
    }

    const userId = await this.supabaseService.getCurrentUserId();
    if (!userId) {
      this.notificationService.error('Usuário não logado.');
      return;
    }

    try {

      for (const [sampleId, data] of Object.entries(this.sampleFormData)) {

        const selectedColor =
          Object.entries(data.colors).find(([_, checked]) => checked)?.[0] ?? '';

        const assessment: Partial<PhysicalAssessment> = {
          name: data.header.name,
          date: new Date().toISOString().split('T')[0],
          sample_number: data.header.sample_number,
          purpose: data.header.purpose,
          color: selectedColor,
          total_green_defects: data.totalGreenDefects,
          tdg_300: data.tdg_300,
          cobtype: data.cobtype,
          moisture: data.moisture ?? '',
          ...this.mapDefects(data.table),
          user_id: userId,
          session_sample_id: Number(sampleId)
        };

        await this.supabaseService.insertPhysicalAssessment(assessment);
      }
      this.isLoading = false;
      this.loading.hide();
      this.notificationService.success('Todas as amostras foram salvas com sucesso!');
      this.router.navigate(['/minha-sessao']);
    } catch (err) {
      this.notificationService.error('Erro ao salvar avaliações.');
      console.error('Erro ao salvar avaliações:', err);
    }
  }
}
