import { AfterViewInit, Component, OnInit, signal, ViewChild } from '@angular/core';
import { ContainerComponent } from "../../../components/container/container.component";
import { MaterialModule } from '../../../core/material/material.module';
import { SupabaseService } from '../../../core/services/supabase.service';
import { NotificationService } from '../../../core/services/notification.service';
import { LoadingService } from '../../../core/services/loading.service';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { CardsComponent } from "../../../components/cards/cards.component";
import { TranslateModule } from '@ngx-translate/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { RouterLink } from "@angular/router";

export interface Sessao {
  sampleNumber: string;
  physicalAssessment?: string;
  sizeTable?: string;
  affectiveForm?: string;
  descriptiveForm?: string;
  extrisincForms?: string;
}

@Component({
  selector: 'app-minha-sessao',
  imports: [ContainerComponent, MaterialModule, CommonModule, CardsComponent, TranslateModule, RouterLink],
  templateUrl: './minha-sessao.component.html',
  styleUrl: './minha-sessao.component.scss'
})
export class MinhaSessaoComponent implements OnInit {

  readonly panelOpenState = signal(false);

  sessions: any[] = [];
  pagedSessions: any[] = [];

  // paginator de sessões
  length = 0;
  pageSize = 5;
  pageIndex = 0;
  pageOptions = [1, 5, 10];

  pageEvent!: PageEvent;

  displayedColumns: string[] = [
    'sample_number',
    'physical',
    'size',
    'descriptive',
    'affective',
    'extrinsic'
  ];

  FORM_TABLES = {
    physical: 'physical_assessments',
    size: 'size_table',
    descriptive: 'descriptive_form',
    fragrance: 'fragrance_data',
    aroma: 'aroma_data',
    beverage: 'beverage_data',
    affective: 'affective_form',
    extrinsic: 'extrisinc_forms'
  };

  constructor(
    private supabase: SupabaseService,
    private notification: NotificationService,
    public loading: LoadingService
  ) { }

  async ngOnInit() {
    try {
      this.loading.show();
      const user = await this.supabase.getCurrentUser();
      if (!user) {
        this.notification.error('Usuário não autenticado');
        return;
      }

      const sentData = await this.supabase.getSentSamplesByTables(
        Object.values(this.FORM_TABLES) , user.id
      );

      this.sessions = await this.supabase.listMySessionsWithSamplesByStatus('active');

      this.sessions = this.sessions.map(session => {
        const sampleIds = session.session_samples.map((s: any) => Number(s.id));

        const hasAnyRecord = (table: string) => {
          const tableData = sentData[table] as Set<number>;
          return sampleIds.some((id: number) => tableData?.has(id));
        };

        const hasAnyRecordByType = (table: string, type: string) => {
          const tableMap = sentData[table] as Map<string, Set<number>>;
          const set = tableMap?.get(type);
          return sampleIds.some((id: number) => set?.has(id));
        };

        const hasDescriptiveRecord =
          hasAnyRecordByType(this.FORM_TABLES.fragrance, 'Descriptive') ||
          hasAnyRecordByType(this.FORM_TABLES.aroma, 'Descriptive') ||
          hasAnyRecordByType(this.FORM_TABLES.beverage, 'Descriptive');

        const hasAffectiveRecord =
          hasAnyRecordByType(this.FORM_TABLES.fragrance, 'Affective') ||
          hasAnyRecordByType(this.FORM_TABLES.aroma, 'Affective') ||
          hasAnyRecordByType(this.FORM_TABLES.beverage, 'Affective');

        return {
          ...session,
          dataSource: new MatTableDataSource(session.session_samples),

          formsStatus: {
            physical: hasAnyRecord(this.FORM_TABLES.physical),
            size: hasAnyRecord(this.FORM_TABLES.size),
            descriptive: hasDescriptiveRecord,
            affective:
              hasAnyRecord(this.FORM_TABLES.affective) ||
              hasAffectiveRecord,
          }
        };
      });

      this.length = this.sessions.length;
      this.updatePagedSessions();

    } catch (err: any) {
      this.notification.error(err?.message || 'Erro ao carregar sessões');
    } finally {
      this.loading.hide();
    }
  }

  onSessionPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagedSessions();
  }

  private updatePagedSessions() {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.pagedSessions = this.sessions.slice(start, end);
  }
}

