import { Injectable } from '@angular/core';
import { TranslateParser } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class TranslateDefaultParser extends TranslateParser {
  // Recebe a chave e retorna sem alterações
  interpolate(expr: string | Function, params?: any): string {
    if (!expr) return '';
    if (typeof expr === 'function') {
      return expr(params);
    }
    return expr;
  }

  // Retorna o objeto de traduções sem alterações
  getValue(target: any, key: string): any {
    return target ? target[key] : undefined;
  }
}
