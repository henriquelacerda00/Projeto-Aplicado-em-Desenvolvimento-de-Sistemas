// import { NotificationService } from './../../core/services/notification.service';
// import { Component } from '@angular/core';
// import { MaterialModule } from '../../core/material/material.module';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { ConfirmPasswordErrorStateMatcher, FormValidations } from '../../core/validations/validations';
// import { ContainerComponent } from '../container/container.component';
// import { LoginGoogleComponent } from '../login-google/login-google.component';
// import { LoadingComponent } from '../loading/loading.component';
// import { LoadingService } from '../../core/services/loading.service';
// import { CommonModule } from '@angular/common';
// import { SupabaseService } from '../../core/services/supabase.service';

// @Component({
//   selector: 'app-cadastro',
//   standalone: true,
//   imports: [
//     ContainerComponent,
//     MaterialModule,
//     LoginGoogleComponent,
//     ReactiveFormsModule,
//     LoadingComponent,
//     CommonModule,
//   ],
//   templateUrl: './cadastro.component.html',
//   styleUrl: './cadastro.component.scss',
// })
// export class CadastroComponent {
//   cadastroForm!: FormGroup;
//   matcher = new ConfirmPasswordErrorStateMatcher();

//   constructor(
//     private build: FormBuilder,
//     private router: Router,
//     private supabaseService: SupabaseService,
//     public loadingService: LoadingService,
//     private notificationService: NotificationService
//   ) {
//     this.cadastroForm = this.build.group(
//       {
//         nome: ['', Validators.required],
//         email: ['', [Validators.required, Validators.email]],
//         senha: ['', [Validators.required, Validators.minLength(6)]],
//         confirmarSenha: ['', [Validators.required, Validators.minLength(6)]],
//       },
//       {
//         validators: FormValidations.senhasIguaisValidator,
//       }
//     );
//   }

//   async onSubmit() {
//     if (this.cadastroForm.invalid) {
//       this.cadastroForm.markAllAsTouched();
//       return;
//     }
//     this.loadingService.show();
//     const { nome, email, senha } = this.cadastroForm.value;

//     const { data, error } = await this.supabaseService.signUp(nome, email, senha,);

//     if (error) {
//       console.error('Erro ao cadastrar:', error.message);
//       // aqui você pode exibir uma snackbar ou alert com a mensagem
//       return;
//     }

//     if (!data || !data.user) {
//       console.warn('Cadastro iniciado, mas confirmação por e-mail pode ser necessária.');
//       // você pode informar o usuário para verificar o e-mail
//       return;
//     }
//     this.loadingService.hide();
//     // console.log('Usuário cadastrado:', data.user);
//     this.router.navigate(['/cadastro-realizado']);
//   }
// }
