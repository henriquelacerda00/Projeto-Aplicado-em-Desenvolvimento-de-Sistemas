import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { ContainerComponent } from '../../../components/container/container.component';
import { MaterialModule } from '../../../core/material/material.module';
import { LoadingService } from '../../../core/services/loading.service';
import { NotificationService } from '../../../core/services/notification.service';
import { SupabaseService } from '../../../core/services/supabase.service';
import { ExtrisincFormComponent } from '../extrisinc-form.component';

@Component({
  selector: 'app-extrisinc-session-page',
  standalone: true,
  imports: [CommonModule, ContainerComponent, MaterialModule, MatPaginatorModule, ExtrisincFormComponent , ],
  templateUrl: './extrisinc-session-page.component.html',
  styleUrl: './extrisinc-session-page.component.scss',
})
export class ExtrisincSessionPageComponent implements OnInit {
  sessionId!: string;
  samples: any[] = [];
  currentSampleIndex = 0;
  currentPageIndex = 0;

  currentFormValue: any = null;
  currentExtrisincData: any = undefined;

  constructor(
    private activatedroute: ActivatedRoute,
    private supabase: SupabaseService,
    private notification: NotificationService,
    public loading: LoadingService,
    private router: Router
  ) {}

  async ngOnInit() {
    try {
      this.loading.show();

      this.sessionId = this.activatedroute.snapshot.paramMap.get('session_id') ?? '';
      if (!this.sessionId) {
        throw new Error('Sessão não encontrada');
      }

      const user = await this.supabase.getCurrentUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const sessionSamples = await this.supabase.getSamplesBySession(this.sessionId);
      const extrisincForms = await this.supabase.getExtrisincFormsBySession(this.sessionId);

      this.samples = sessionSamples.map((sample: any) => {
        const extrisincForm = extrisincForms.find((f: any) => Number(f.session_sample_id) === Number(sample.id));

        return {
          ...sample,
          extrisincForm,
        };
      });

      if (!this.samples.length) {
        this.notification.warning('Nenhuma amostra encontrada para esta sessão.');
      }

      this.updateCurrentSampleData();
    } catch (err: any) {
      console.error(err);
      this.notification.error(err?.message || 'Erro ao carregar formulário extrínseco');
    } finally {
      this.loading.hide();
    }
  }

  get currentSample() {
    return this.samples[this.currentSampleIndex] ?? null;
  }

  get currentSampleNumber(): string | null {
    return this.currentSample?.sample_number ?? null;
  }

  get isLastSample(): boolean {
    return this.currentPageIndex === this.samples.length - 1;
  }

  onSamplePageChange(event: PageEvent): void {
    // salva o estado da amostra atual antes de trocar de página
    if (this.samples[this.currentSampleIndex]) {
      this.samples[this.currentSampleIndex].extrisincForm = {
        ...this.samples[this.currentSampleIndex].extrisincForm,
        ...this.currentFormValue,
      };
    }

    this.currentSampleIndex = event.pageIndex;
    this.currentPageIndex = event.pageIndex;

    if (this.samples[this.currentSampleIndex]) {
      this.updateCurrentSampleData();
    }
  }

  onExtrisincChange(value: any) {
    this.currentFormValue = value;

    // opcional, mas melhor: já mantém sincronizado em tempo real
    if (this.samples[this.currentSampleIndex]) {
      this.samples[this.currentSampleIndex].extrisincForm = {
        ...this.samples[this.currentSampleIndex].extrisincForm,
        ...value,
      };
    }
  }
  private updateCurrentSampleData() {
    const dbData = this.currentSample?.extrisincForm;

    if (!dbData) {
      this.currentExtrisincData = undefined;
      this.currentFormValue = null;
      return;
    }

    this.currentExtrisincData = {
      header: {
        sample_number: dbData.sample_number ?? '',
      },
      farming: {
        farm_country: !!dbData.farm_country,
        farm_country_notes: dbData.farm_country_notes ?? '',
        farm_region: !!dbData.farm_region,
        farm_region_notes: dbData.farm_region_notes ?? '',
        farm_name_of_farm: !!dbData.farm_name_of_farm,
        farm_name_of_farm_notes: dbData.farm_name_of_farm_notes ?? '',
        farm_name_of_producer: !!dbData.farm_name_of_producer,
        farm_name_of_producer_notes: dbData.farm_name_of_producer_notes ?? '',
        farm_species: !!dbData.farm_species,
        farm_species_notes: dbData.farm_species_notes ?? '',
        farm_variety: !!dbData.farm_variety,
        farm_variety_notes: dbData.farm_variety_notes ?? '',
        farm_harvest_date: !!dbData.farm_harvest_date,
        farm_harvest_date_notes: dbData.farm_harvest_date_notes ?? '',
        farm_other: !!dbData.farm_other,
        farm_other_notes: dbData.farm_other_notes ?? '',
      },
      processing: {
        process_name_of_processor: !!dbData.process_name_of_processor,
        process_name_of_processor_notes: dbData.process_name_of_processor_notes ?? '',
        process_wet_mill: !!dbData.process_wet_mill,
        process_dry_mill: !!dbData.process_dry_mill,
        processingTree: {
          process_fruit_dried: !!dbData.process_fruit_dried,
          process_mucilage_dried: !!dbData.process_mucilage_dried,
          process_parchment_dried: !!dbData.process_parchment_dried,
          process_seed_dried: !!dbData.process_seed_dried,
          process_other: !!dbData.process_other,
          process_other_notes: dbData.process_other_notes ?? '',
        },
        fermentationTree: {
          process_lactic: !!dbData.process_lactic,
          process_anaerobic: !!dbData.process_anaerobic,
          process_carbonic_maceration: !!dbData.process_carbonic_maceration,
          process_multiple_fermentations: !!dbData.process_multiple_fermentations,
          process_co_fermentation: !!dbData.process_co_fermentation,
        },
      },
      trading: {
        trading_size_grade: !!dbData.trading_size_grade,
        trading_size_grade_notes: dbData.trading_size_grade_notes ?? '',
        trading_other_grade: !!dbData.trading_other_grade,
        trading_other_grade_notes: dbData.trading_other_grade_notes ?? '',
        trading_ico_number: !!dbData.trading_ico_number,
        trading_ico_number_notes: dbData.trading_ico_number_notes ?? '',
        trading_other: !!dbData.trading_other,
        trading_other_notes: dbData.trading_other_notes ?? '',
      },
      certifications: {
        certific_c4: !!dbData.certific_c4,
        certific_fair_trade: !!dbData.certific_fair_trade,
        certific_organic: !!dbData.certific_organic,
        certific_rainforest_alliance: !!dbData.certific_rainforest_alliance,
        certific_geographical_indication: !!dbData.certific_geographical_indication,
        certific_geographical_indication_notes: dbData.certific_geographical_indication_notes ?? '',
        certific_abic: !!dbData.certific_abic,
        certific_abic_notes: dbData.certific_abic_notes ?? '',
        certific_other: !!dbData.certific_other,
        certific_other_notes: dbData.certific_other_notes ?? '',
      },
      impression_of_value: dbData.impression_of_value ?? [null],
    };

    this.currentFormValue = this.currentExtrisincData;
  }

  async onSubmitAll() {
    try {
      this.loading.show();

      const user = await this.supabase.getCurrentUser();
      if (!user) throw new Error('Usuário não autenticado');

      const userId = user.id;
      const tipoUsuario = user.user_metadata?.['tipoUsuario']?.trim()?.toUpperCase();

      const payloads: any[] = [];

      for (const sample of this.samples) {
        const data = sample.extrisincForm;

        if (!data) continue;

        if (tipoUsuario === 'Q') {
          payloads.push({
            session_id: sample.session_id,
            session_sample_id: sample.id,
            qgrader_id: userId,
            extrisinc_form_id: sample.extrisincForm?.id,
            sample_number: data.header?.sample_number ?? null,
            impression_of_value: data.impression_of_value ?? null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }

        // if (tipoUsuario === 'P') {
        //   payloads.push({
        //     user_id: userId,
        //     sample_number: data.header?.sample_number ?? null,
        //     session_id: sample.session_id,
        //     session_sample_id: sample.id,
        //     ...data.farming,
        //     ...data.processing,
        //     ...data.trading,
        //     ...data.certifications,
        //     ...data.processing?.processingTree,
        //     ...data.processing?.fermentationTree,
        //   });
        // }
      }

      if (!payloads.length) {
        throw new Error('Nenhuma amostra para enviar');
      }

      const table = tipoUsuario === 'Q' ? 'extrisinc_analysis' : 'extrisinc_forms';

      console.log('Enviando TODAS:', payloads);

      await this.supabase.insertData(table, payloads);

      this.notification.success('Todas as amostras enviadas com sucesso!');
      this.router.navigate(['/minha-sessao']);
    } catch (err: any) {
      console.error(err);
      this.notification.error(err?.message || 'Erro ao enviar dados');
    } finally {
      this.loading.hide();

    }
  }
}
