import { Component, OnInit, signal } from '@angular/core';
import { MaterialModule } from '../../core/material/material.module';
import { ContainerComponent } from "../container/container.component";
import { SupabaseService } from '../../core/services/supabase.service';
import { User } from '../../core/types/type';
import { Form, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '../../core/services/notification.service';
import { LoadingService } from '../../core/services/loading.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-dados-usuario',
  imports: [MaterialModule, ContainerComponent, FormsModule, ReactiveFormsModule, CommonModule],
  standalone: true,
  templateUrl: './dados-usuario.component.html',
  styleUrl: './dados-usuario.component.scss'
})
export class DadosUsuarioComponent implements OnInit {
  dadosUsuario!: User | null;
  form!: FormGroup;
  isEditing = false;

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  constructor(
    private supabaseService: SupabaseService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    public loading: LoadingService
  ) {
    this.form = this.formBuilder.group({
      email: [{ value: '', disabled: true }, Validators.email],
      name: [{ value: '', disabled: true },],
      password: [{ value: '', disabled: true },],
      confirmPassword: [{ value: '', disabled: true },],
    });
  }

  async ngOnInit() {
    this.loading.show();

    try {
      this.dadosUsuario = await this.supabaseService.getUserData() as User | null;
      console.log(this.dadosUsuario);

      this.form.patchValue({
        email: this.dadosUsuario?.email ?? '',
        name: this.dadosUsuario?.full_name ?? '',
        password: '',
        confirmPassword: '',

      });
    } catch {
      this.notificationService.error('Erro ao buscar dados do usuário.');
    } finally {
      this.loading.hide();
    }
  }

  editarPerfil() {
    this.isEditing = true;
    this.form.enable();
  }

  async salvarAlteracoes() {
    if (this.form.invalid || !this.dadosUsuario) return;

    const fullName = this.form.get('name')?.value;
    const email = this.form.get('email')?.value;
    const password = this.form.get('password')?.value;
    const confirmPassword = this.form.get('confirmPassword')?.value;

    if (password && password !== confirmPassword) {
      this.notificationService.error('As senhas não coincidem.');
      return;
    }

    const nomeMudou = fullName !== this.dadosUsuario.full_name;
    const emailMudou = email !== this.dadosUsuario.email;
    const senhaMudou = !!password;

    if (!nomeMudou && !emailMudou && !senhaMudou) {
      this.notificationService.info('Nenhuma alteração foi detectada.');
      return;
    }

    this.loading.show();

    const sucesso = await this.supabaseService.updateUserProfile(
      nomeMudou ? fullName : undefined,
      emailMudou ? email : undefined,
      senhaMudou ? password : undefined
    );

    if (!sucesso) {
      this.loading.hide();
      this.notificationService.error('Falha ao atualizar o perfil.');
      return;
    }

    // 🔄 fonte da verdade = AUTH
    this.dadosUsuario = await this.supabaseService.getUserData() as User | null;

    this.form.patchValue({
      email: this.dadosUsuario?.email,
      name: this.dadosUsuario?.full_name,
      password: '',
      confirmPassword: '',
    });

    this.form.disable();
    this.isEditing = false;
    this.loading.hide();

    if (emailMudou) {
      this.notificationService.info(
        'Confirme o novo email pelo link enviado.'
      );
    }

    this.notificationService.success('Perfil atualizado com sucesso!');
  }



  async recarregarDadosUsuario() {
    this.loading.show();

    try {
      this.dadosUsuario = await this.supabaseService.getUserData() as User | null;
      console.log(this.dadosUsuario)

      this.form.patchValue({
        email: this.dadosUsuario?.email ?? '',
        name: this.dadosUsuario?.full_name ?? '',
        password: '',
        confirmPassword: '',
      });

    } catch {
      this.notificationService.error('Erro ao recarregar os dados do usuário.');
    } finally {
      this.loading.hide();
    }
  }



}
