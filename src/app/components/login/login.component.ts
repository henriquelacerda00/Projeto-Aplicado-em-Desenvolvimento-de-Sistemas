import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../core/material/material.module';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginGoogleComponent } from '../login-google/login-google.component';
import { NotificationService } from '../../core/services/notification.service';
import { LoadingService } from '../../core/services/loading.service';
import { ConfirmPasswordErrorStateMatcher, FormValidations } from '../../core/validations/validations';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/hml-services/auth.service';
import { SessionService } from '../../core/hml-services/session.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MaterialModule, RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  TypePage: boolean = false;
  loginForm!: FormGroup;
  cadastroForm!: FormGroup;
  confirmMatcher = new ConfirmPasswordErrorStateMatcher();

  private inviteToken: string | null = null;
  private processingInvite = false;

  constructor(
    private authService: AuthService,
    private sessionService: SessionService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private notification: NotificationService,
    public loadingService: LoadingService
  ) {
    this.buildForm();
  }

  async ngOnInit() {
    this.inviteToken =
      this.route.snapshot.queryParamMap.get('token') ||
      this.route.snapshot.queryParamMap.get('invite');

    if (this.inviteToken) {
      localStorage.setItem('invite_token', this.inviteToken);
      console.log('🎟️ Invite token salvo:', this.inviteToken);

      try {

        const logged =
          await this.authService.isLoggedIn();

        if (logged) {

          await this.processInviteAndRedirect();

          return;
        }

      } catch (err) {

        console.warn(
          'Não foi possível validar sessão atual no ngOnInit',
          err
        );
      }
    }
  }

  buildForm() {
    if (this.TypePage) {
      this.cadastroForm = this.formBuilder.group(
        {
          tipoUsuario: ['', [Validators.required]],
          nome: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
          senha: ['', [Validators.required, Validators.minLength(6)]],
          confirmarSenha: ['', [Validators.required, Validators.minLength(6)]],
        },
        {
          validators: FormValidations.senhasIguaisValidator,
        }
      );
    } else {
      this.loginForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        senha: ['', [Validators.required, Validators.minLength(6)]],
      });
    }
  }

  toggleForm() {
    const token = localStorage.getItem('invite_token');
    this.TypePage = !this.TypePage;
    this.buildForm();

    setTimeout(() => { }, 0);

    if (token && this.TypePage) {
      this.cadastroForm.get('tipoUsuario')?.patchValue('Q');
    }
  }

  async onSubmit() {
    this.loadingService.show();

    try {

      if (this.TypePage) {

        if (this.cadastroForm.invalid) {

          this.notification.error(
            'Preencha todos os campos corretamente!'
          );

          return;
        }

        const {
          nome,
          email,
          senha,
          confirmarSenha,
          tipoUsuario
        } = this.cadastroForm.value;

        if (senha !== confirmarSenha) {

          this.notification.error(
            'As senhas não coincidem!'
          );

          return;
        }

        await this.authService.register({
          name: nome,
          email,
          password: senha,
          role: tipoUsuario,
        });

        this.notification.success(
          'Conta criada com sucesso! Verifique seu e-mail.'
        );

        this.TypePage = false;

        this.buildForm();

        return;
      }

      // LOGIN

      if (this.loginForm.invalid) {

        this.notification.error(
          'Preencha o e-mail e senha corretamente!'
        );

        return;
      }

      const { email, senha } =
        this.loginForm.value;

      await this.authService.login(
        email,
        senha
      );

      const inviteToken =
        localStorage.getItem('invite_token');

      if (inviteToken) {

        await this.processInviteAndRedirect();

        return;
      }

      this.notification.success(
        'Bem-vindo ao CVA-DATA!'
      );

      await this.router.navigate(['/home']);

    } catch (err: any) {

      console.error(err);

      this.notification.error(
        err?.error?.message ||
        err?.message ||
        'Erro interno'
      );

    } finally {

      this.loadingService.hide();
    }
  }

  private async processInviteAndRedirect() {

    if (this.processingInvite) return;

    this.processingInvite = true;

    this.loadingService.show();

    try {

      const inviteToken =
        localStorage.getItem('invite_token');

      if (!inviteToken) {

        await this.router.navigate(['/home']);

        return;
      }

      await this.sessionService.acceptInvite(
        inviteToken
      );

      localStorage.removeItem('invite_token');

      sessionStorage.removeItem(
        'invite_processed'
      );

      this.notification.success(
        'Sessão aceita com sucesso!'
      );

      await this.router.navigate([
        '/minha-sessao'
      ]);

    } catch (err: any) {

      console.error(
        'Erro ao aceitar convite:',
        err
      );

      localStorage.removeItem(
        'invite_token'
      );

      sessionStorage.removeItem(
        'invite_processed'
      );

      this.notification.error(
        err?.error?.message ||
        err?.message ||
        'Não foi possível aceitar o convite da sessão'
      );

      await this.router.navigate(['/home']);

    } finally {

      this.processingInvite = false;

      this.loadingService.hide();
    }
  }

  get isButtonDisabled(): boolean {
    if (this.TypePage) {
      return !this.cadastroForm || this.cadastroForm.invalid;
    } else {
      return !this.loginForm || this.loginForm.invalid;
    }
  }
}