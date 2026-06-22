import { NotificationService } from './../../core/services/notification.service';
import { Component, model } from '@angular/core';
import { MaterialModule } from '../../core/material/material.module';
import { ContainerComponent } from '../container/container.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../core/services/supabase.service';

@Component({
  selector: 'app-alterar-senha',
  imports: [MaterialModule,ContainerComponent,FormsModule],
  templateUrl: './alterar-senha.component.html',
  styleUrl: './alterar-senha.component.scss'
})
export class AlterarSenhaComponent {
  password = model('')

  constructor(
    private supabaseService: SupabaseService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  async alterarSenha() {
    await this.supabaseService.updateUserPassword({password : this.password()})
    this.notificationService.success('Senha alterada com sucesso!');

    this.password.set('')
    this.router.navigate(['/login']);
  }

}
