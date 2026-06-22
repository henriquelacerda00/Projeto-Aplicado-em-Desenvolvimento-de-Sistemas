import { inject, PLATFORM_ID, Provider } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { isPlatformServer } from '@angular/common';
import { Observable, of } from 'rxjs';

export class TranslateUniversalLoader implements TranslateLoader {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  getTranslation(lang: string): Observable<any> {
    if (isPlatformServer(this.platformId)) {
      const fs = require('fs');    // só no server
      const path = require('path'); // só no server
      const filePath = path.join(process.cwd(), 'dist/browser/assets/i18n', `${lang}.json`);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      return of(data);
    } else {
      return this.http.get(`/assets/i18n/${lang}.json`);
    }
  }
}

export const provideTranslate = (): Provider[] => [
  {
    provide: 'TRANSLATE_LOADER',
    useClass: TranslateUniversalLoader
  }
];
