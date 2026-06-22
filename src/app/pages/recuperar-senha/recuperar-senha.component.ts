import { Component, model } from '@angular/core';

import { MaterialModule } from '../../core/material/material.module';
import { ContainerComponent } from '../../components/container/container.component';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../core/services/notification.service';
import { LoadingComponent } from '../../components/loading/loading.component';
import { LoadingService } from '../../core/services/loading.service';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../core/services/supabase.service';

@Component({
  selector: 'app-recuperar-senha',
  imports: [
    MaterialModule,
    ContainerComponent,
    RouterLink,
    FormsModule,
    LoadingComponent,
    CommonModule,
  ],
  templateUrl: './recuperar-senha.component.html',
  styleUrl: './recuperar-senha.component.scss',
})
export class RecuperarSenhaComponent {
  email = model('');

  constructor(
    private router: Router,
    private supabaseService: SupabaseService,
    private notificationService: NotificationService,
    public loadingService: LoadingService
  ) {}

  async onSubmit() {
    this.loadingService.show(); // 👈 mostra antes de tudo

    try {
      await this.supabaseService.recuperarSenha(this.email());
      this.notificationService.success(
        'Email de recuperação enviado com sucesso!'
      );
      this.email.set('');
    } catch (error) {
      this.notificationService.error('Erro ao enviar e-mail de recuperação.');
      console.error(error);
    } finally {
      this.loadingService.hide(); // 👈 sempre esconde no final
    }
  }
}
