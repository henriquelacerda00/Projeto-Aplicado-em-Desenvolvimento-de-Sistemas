import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../core/material/material.module';
import { SupabaseService } from '../../../core/services/supabase.service';
import { NotificationService } from '../../../core/services/notification.service';
import { LoadingService } from '../../../core/services/loading.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gerenciar-sessoes',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './gerenciar-sessoes.component.html',
  styleUrls: ['./gerenciar-sessoes.component.scss'],
})
export class GerenciarSessoesComponent implements OnInit {
  activeSessions: any[] = [];
  inactiveSessions: any[] = [];
  displayedColumns: string[] = ['name', 'samplesCount', 'status', 'createdAt', 'actions'];
  selectedTab: 'active' | 'inactive' = 'active';

  constructor(
    private supabaseService: SupabaseService,
    private notificationService: NotificationService,
    public loading: LoadingService,
    private router: Router,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadSessions();
  }

  async loadSessions(): Promise<void> {
    this.loading.show();

    try {
      const [active, inactive] = await Promise.all([
        this.supabaseService.listActiveSessionsWithSamples(),
        this.supabaseService.listInactiveSessionsWithSamples(),
      ]);

      this.activeSessions = active ?? [];
      this.inactiveSessions = inactive ?? [];
    } catch (error) {
      console.error(error);
      this.notificationService.error('Erro ao carregar sessões');
    } finally {
      this.loading.hide();
    }
  }

  async inactivate(session: any): Promise<void> {
    if (!session?.id) {
      this.notificationService.error('Sessão inválida');
      return;
    }

    this.loading.show();

    try {
      await this.supabaseService.inactivateSession(session.id);
      this.notificationService.success('Sessão inativada com sucesso');
      await this.loadSessions();
    } catch (error) {
      console.error(error);
      this.notificationService.error('Erro ao inativar sessão');
    } finally {
      this.loading.hide();
    }
  }

  async reactivate(session: any): Promise<void> {
    if (!session?.id) {
      this.notificationService.error('Sessão inválida');
      return;
    }

    this.loading.show();

    try {
      await this.supabaseService.reactivateSession(session.id);
      this.notificationService.success('Sessão reativada com sucesso');
      await this.loadSessions();
    } catch (error) {
      console.error(error);
      this.notificationService.error('Erro ao reativar sessão');
    } finally {
      this.loading.hide();
    }
  }

  editSession(session: any): void {
    if (!session?.id) {
      this.notificationService.error('Sessão inválida para edição');
      return;
    }

    this.router.navigate(['/editar-sessao', session.id]);
  }

  get filteredSessions(): any[] {
    return this.selectedTab === 'active'
      ? this.activeSessions
      : this.inactiveSessions;
  }
}
