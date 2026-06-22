import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../../../core/material/material.module';
import { StepComponent } from '../../../components/step/step.component';

import { SupabaseService } from '../../../core/services/supabase.service';
import { NotificationService } from '../../../core/services/notification.service';
import { LoadingService } from '../../../core/services/loading.service';
import { ContainerComponent } from '../../../components/container/container.component';

@Component({
  selector: 'app-editar-session',
  standalone: true,
  imports: [CommonModule, MaterialModule, StepComponent, ContainerComponent],
  templateUrl: './editar-session.component.html',
  styleUrl: './editar-session.component.scss',
})
export class EditarSessionComponent implements OnInit {
  @ViewChild(StepComponent)
  step!: StepComponent;

  sessionId!: string;
  isLoading = false;

  initialSessionData: {
    sessionName: string;
    qgraders: string[];
    samples: string[];
    extrisincForms: Record<string, any>;
  } | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private supabaseService: SupabaseService,
    private notification: NotificationService,
    public loading: LoadingService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.sessionId = this.route.snapshot.paramMap.get('session_id')!;

    if (!this.sessionId) {
      this.notification.error('Sessão não encontrada.');
      this.router.navigate(['/']);
      return;
    }

    await this.loadSessionData();
  }

  get canSubmit(): boolean {
    return !!this.step && this.step.isLastStep && this.step.isLastSample;
  }

  submit(): void {
    if (this.step) {
      this.step.emitSubmit();
    }
  }

  private async loadSessionData(): Promise<void> {
    this.loading.show();

    try {
      const session = await this.supabaseService.getSessionById(this.sessionId);
      const sessionSamples = await this.supabaseService.getSamplesBySession(this.sessionId);
      const qgraders = await this.supabaseService.getAllSessionQGradersEmails(this.sessionId);
      const extrisincFormsRows = await this.supabaseService.getExtrisincFormsBySession(this.sessionId);

      const extrisincFormsMap: Record<string, any> = {};

      for (const row of extrisincFormsRows) {
        const sampleNumber = String(row.sample_number);

        // mantém apenas o registro mais recente se houver duplicata
        const current = extrisincFormsMap[sampleNumber];
        if (
          current &&
          current._meta?.created_at &&
          row.created_at &&
          new Date(current._meta.created_at).getTime() > new Date(row.created_at).getTime()
        ) {
          continue;
        }

        extrisincFormsMap[sampleNumber] = {
          _meta: {
            id: row.id,
            created_at: row.created_at,
            session_sample_id: row.session_sample_id,
          },
          header: {
            sample_number: sampleNumber,
          },
          farming: {
            farm_country: !!row.farm_country,
            farm_country_notes: row.farm_country_notes ?? '',
            farm_region: !!row.farm_region,
            farm_region_notes: row.farm_region_notes ?? '',
            farm_name_of_farm: !!row.farm_name_of_farm,
            farm_name_of_farm_notes: row.farm_name_of_farm_notes ?? '',
            farm_name_of_producer: !!row.farm_name_of_producer,
            farm_name_of_producer_notes: row.farm_name_of_producer_notes ?? '',
            farm_species: !!row.farm_species,
            farm_species_notes: row.farm_species_notes ?? '',
            farm_variety: !!row.farm_variety,
            farm_variety_notes: row.farm_variety_notes ?? '',
            farm_harvest_date: !!row.farm_harvest_date,
            farm_harvest_date_notes: row.farm_harvest_date_notes ?? '',
            farm_other: !!row.farm_other,
            farm_other_notes: row.farm_other_notes ?? '',
          },
          processing: {
            process_name_of_processor: !!row.process_name_of_processor,
            process_name_of_processor_notes: row.process_name_of_processor_notes ?? '',
            process_wet_mill: !!row.process_wet_mill,
            process_dry_mill: !!row.process_dry_mill,
            processingTree: {
              process_fruit_dried: !!row.process_fruit_dried,
              process_mucilage_dried: !!row.process_mucilage_dried,
              process_parchment_dried: !!row.process_parchment_dried,
              process_seed_dried: !!row.process_seed_dried,
              process_other: !!row.process_other,
              process_other_notes: row.process_other_notes ?? '',
            },
            fermentationTree: {
              process_lactic: !!row.process_lactic,
              process_anaerobic: !!row.process_anaerobic,
              process_carbonic_maceration: !!row.process_carbonic_maceration,
              process_multiple_fermentations: !!row.process_multiple_fermentations,
              process_co_fermentation: !!row.process_co_fermentation,
            },
          },
          trading: {
            trading_size_grade: !!row.trading_size_grade,
            trading_size_grade_notes: row.trading_size_grade_notes ?? '',
            trading_other_grade: !!row.trading_other_grade,
            trading_other_grade_notes: row.trading_other_grade_notes ?? '',
            trading_ico_number: !!row.trading_ico_number,
            trading_ico_number_notes: row.trading_ico_number_notes ?? '',
            trading_other: !!row.trading_other,
            trading_other_notes: row.trading_other_notes ?? '',
          },
          certifications: {
            certific_c4: !!row.certific_c4,
            certific_fair_trade: !!row.certific_fair_trade,
            certific_organic: !!row.certific_organic,
            certific_rainforest_alliance: !!row.certific_rainforest_alliance,
            certific_geographical_indication: !!row.certific_geographical_indication,
            certific_geographical_indication_notes: row.certific_geographical_indication_notes ?? '',
            certific_abic: !!row.certific_abic,
            certific_abic_notes: row.certific_abic_notes ?? '',
            certific_other: !!row.certific_other,
            certific_other_notes: row.certific_other_notes ?? '',
          },
        };
      }

      this.initialSessionData = {
        sessionName: session.name,
        qgraders,
        samples: (sessionSamples ?? []).map((sample: any) => String(sample.sample_number)),
        extrisincForms: extrisincFormsMap,
      };
    } catch (error) {
      console.error(error);
      this.notification.error('Erro ao carregar sessão.');
      this.router.navigate(['/']);
    } finally {
      this.loading.hide();
    }
  }

  async onUpdateSession(data: {
    sessionName: string;
    qgraders: string[];
    samples: string[];
    extrisincForms: Record<string, any>;
  }): Promise<void> {
    this.isLoading = true;
    this.loading.show();

    try {
      const userId = await this.supabaseService.getCurrentUserId();
      if (!userId) throw new Error('Usuário não autenticado');

      await this.supabaseService.updateSession(this.sessionId, {
        name: data.sessionName,
      });

      const allSessionSamples = await this.supabaseService.createMissingSessionSamples(this.sessionId, data.samples);

      const newInviteEmails = await this.supabaseService.createMissingSessionInvites(this.sessionId, data.qgraders);

      console.log('Novos convites enviados para:', newInviteEmails);

      const savePromises = Object.entries(data.extrisincForms).map(async ([sampleNumber, form]) => {
        const sessionSample = allSessionSamples.find(
          (sample: any) => String(sample.sample_number) === String(sampleNumber),
        );

        if (!sessionSample) {
          throw new Error(`session_sample não encontrado para a amostra ${sampleNumber}`);
        }

        const rawFormData = {
          ...form.farming,
          ...form.processing,
          ...form.processing.processingTree,
          ...form.processing.fermentationTree,
          ...form.trading,
          ...form.certifications,
        };

        delete rawFormData.processingTree;
        delete rawFormData.fermentationTree;

        const formData = this.supabaseService.normalizeExtrisincBooleans(rawFormData);

        const payload = {
          ...formData,
          session_id: this.sessionId,
          session_sample_id: sessionSample.id,
          sample_number: sampleNumber,
          user_id: userId,
        };

        return this.supabaseService.saveSessionExtrisincFormBySessionSample(sessionSample.id, payload);
      });

      await Promise.all(savePromises);

      this.notification.success('Sessão atualizada com sucesso!');
      this.router.navigate(['/']);
    } catch (error) {
      console.error(error);
      this.notification.error('Erro ao atualizar sessão.');
    } finally {
      this.isLoading = false;
      this.loading.hide();
    }
  }
}
