import { EditarSessionComponent } from './pages/session/editar-session/editar-session.component';
import { GerenciarSessoesComponent } from './pages/session/gerenciar-sessao/gerenciar-sessoes.component';
import { Routes } from '@angular/router';
// import { CadastroComponent } from './components/cadastro/cadastro.component';
import { LoginComponent } from './components/login/login.component';
import { CadastroRealizadoComponent } from './pages/cadastro-realizado/cadastro-realizado.component';
import { HomeComponent } from './pages/home/home.component';
import { RecuperarSenhaComponent } from './pages/recuperar-senha/recuperar-senha.component';
import { AlterarSenhaComponent } from './components/alterar-senha/alterar-senha.component';
import { isAuthenticated } from './core/guards/authenticated.guard';
import { AuthCallbackComponent } from './components/call-back/call-back.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DadosUsuarioComponent } from './components/dados-usuario/dados-usuario.component';
import { CadastrarSessaoComponent } from './pages/session/cadastrar-sessao/cadastrar-sessao.component';
import { MinhaSessaoComponent } from './pages/session/minha-sessao/minha-sessao.component';
import { isLoggedIn } from './core/guards/guard-routes.guard';
import { RoleGuard } from './core/guards/role-guards';

export const routes: Routes = [
  // Rota padrão → login
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  // ROTAS PÚBLICAS (fora do layout)
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [isLoggedIn],
  },
  {
    path: 'cadastro-realizado',
    component: CadastroRealizadoComponent,
  },
  {
    path: 'auth/callback',
    component: AuthCallbackComponent,
  },
  {
    path: 'recuperar-senha',
    component: RecuperarSenhaComponent,
  },
  {
    path: 'alterar-senha',
    component: AlterarSenhaComponent,
  },
  {
    path: 'nao-autorizado',
    loadComponent: () =>
      import('./components/nao-autorizado/nao-autorizado.component').then((m) => m.NaoAutorizadoComponent),
  },
  {
    path: '',
    canActivate: [isAuthenticated],
    component: LayoutComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'profile',
        component: DadosUsuarioComponent,
      },
      {
        path: 'cadastrar-sessao',
        component: CadastrarSessaoComponent,
        canActivate: [RoleGuard],
        data: { roles: ['P'] },
      },
      {
        path: 'minha-sessao',
        component: MinhaSessaoComponent,
        canActivate: [RoleGuard],
        data: { roles: ['P', 'Q'] },
      },
      {
        path: 'physical-assessments/:session_id',
        loadComponent: () =>
          import('./pages/physical-assessments/physical-assessments.component').then(
            (m) => m.PhysicalAssessmentsComponent,
          ),
      },
      {
        path: 'size-table/:session_id',
        loadComponent: () => import('./pages/size-table/size-table.component').then((m) => m.SizeTableComponent),
      },
      {
        path: 'descriptive-form/:session_id',
        loadComponent: () =>
          import('./pages/descriptive-form/descriptive-form.component').then((m) => m.DescriptiveFormComponent),
      },
      {
        path: 'affective-form/:session_id',
        loadComponent: () =>
          import('./pages/affective-form/affective-form.component').then((m) => m.AffectiveFormComponent),
      },
      {
        path: 'extrisinc-form/:session_id',
        loadComponent: () =>
          import('./pages/extrisinc-form/extrisinc-session-page/extrisinc-session-page.component').then(
            (m) => m.ExtrisincSessionPageComponent,
          ),
      },
      {
        path: 'minhas-analises',
        loadComponent: () =>
          import('./pages/minhas-analises/minhas-analises.component').then((m) => m.MinhasAnalisesComponent),
      },
      {
        path: 'gerenciar-sessoes',
        loadComponent: () =>
          import('./pages/session/gerenciar-sessao/gerenciar-sessoes.component').then(
            (m) => m.GerenciarSessoesComponent,
          ),
        data: { roles: ['P'] },
        canActivate: [RoleGuard],
      },
      {
        path: 'editar-sessao/:session_id',
        loadComponent: () =>
          import('./pages/session/editar-session/editar-session.component').then((m) => m.EditarSessionComponent),
      },
    ],
  },

  // 404 OPCIONAL
  // { path: '**', redirectTo: 'home' }
];
