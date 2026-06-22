import { inject, PLATFORM_ID, Provider } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  DefaultMissingTranslationHandler,
  MissingTranslationHandler,
  TranslateCompiler,
  TranslateDefaultParser,
  TranslateLoader,
  TranslateParser,
  TranslateService,
  TranslateStore,
} from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { TranslateDefaultCompiler } from './translate-default-compiler';

export class TranslateBrowserLoader implements TranslateLoader {
  private http = inject(HttpClient);

  getTranslation(lang: string): Observable<any> {
    return this.http.get(`/assets/i18n/${lang}.json`);
  }
}

export const provideTranslate = (): Provider[] => [
  { provide: TranslateLoader, useClass: TranslateBrowserLoader },
  { provide: TranslateCompiler, useClass: TranslateDefaultCompiler },
  { provide: TranslateParser, useClass: TranslateDefaultParser },
  { provide: MissingTranslationHandler, useClass: DefaultMissingTranslationHandler },
  TranslateService,
  TranslateStore
];
