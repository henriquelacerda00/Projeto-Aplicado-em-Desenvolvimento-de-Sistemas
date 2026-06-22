import { Injectable } from '@angular/core';
import { TranslateCompiler } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class TranslateDefaultCompiler extends TranslateCompiler {
  // Recebe a chave e retorna sem alterações
  compile(value: string, lang: string): string {
    return value;
  }

  // Recebe o objeto de traduções e retorna sem alterações
  compileTranslations(translations: any, lang: string): any {
    return translations;
  }
}
