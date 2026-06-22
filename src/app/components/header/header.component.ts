import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MaterialModule } from '../../core/material/material.module';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import { SupabaseService } from '../../core/services/supabase.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SidebarService } from '../../core/services/sidebar.service';

@Component({
  selector: 'app-header',
  imports: [MaterialModule, CommonModule, RouterLink, TranslateModule,],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  isEnglish = true;
  isBrowser: boolean;

  constructor(private router: Router, private supabaseService: SupabaseService, private translate: TranslateService, @Inject(PLATFORM_ID) private platformId: Object, private sidebarService: SidebarService) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    // Configura idiomas
    this.translate.addLangs(['en', 'pt']);
    this.translate.setDefaultLang('en');

    if (this.isBrowser) {
      const lang = localStorage.getItem('lang') || 'pt';
      this.translate.use(lang);
    }
  }
  showHeader = false;

  // isHiddenRoute(): boolean {
  //   const hiddenRoutes = ['/login', '/cadastro', '/recuperar-senha', '/alterar-senha', '/cadastro-realizado'];

  //   return hiddenRoutes.includes(this.router.url);
  // }

  ngOnInit() {
    if (this.isBrowser) {
      const lang = localStorage.getItem('lang')
      if (lang === 'pt') {
        this.isEnglish = false;
        this.translate.use(lang);
      } else {
        this.translate.use('en');
      }
    }


    this.router.events.subscribe(() => {
      const hiddenRoutes = ['/login', '/cadastro', '/recuperar-senha', '/alterar-senha', '/cadastro-realizado'];

      this.showHeader = !hiddenRoutes.includes(this.router.url) && !this.router.url.includes('login');
    });
  }

  toggleLanguage(isChecked: boolean) {
    const lang = isChecked ? 'en' : 'pt';
    this.isEnglish = isChecked;
    this.translate.use(lang);        // 🔹 muda o idioma global
    localStorage.setItem('lang', lang); // salva para persistência
  }

  onMenuClick() {
    this.sidebarService.toggle();
  }


  logout() {
    this.supabaseService
      .signOut()
      .then(({ error }) => {
        if (error) {
          console.error('Erro ao fazer logout:', error);
        } else {
          console.log('Logout feito com sucesso');
          this.router.navigate(['/login']);
        }
      })
      .catch((error) => {
        console.error('Erro ao desconectar:', error);
      });
  }
}
