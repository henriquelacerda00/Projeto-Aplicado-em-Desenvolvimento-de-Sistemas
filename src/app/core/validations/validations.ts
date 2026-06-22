import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { FormControl, FormGroupDirective, NgForm } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";

export class FormValidations {
  static senhasIguaisValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const senha = group.get('senha')?.value;
  const confirmar = group.get('confirmarSenha')?.value;

  return senha === confirmar ? null : { senhasDiferentes: true };
};
}

/**
 * ErrorStateMatcher personalizado para o campo de confirmação de senha.
 * Ativa o estado de erro se o controle foi tocado E (o próprio controle é inválido OU o formulário pai tem o erro 'senhasDiferentes').
 */
export class ConfirmPasswordErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const passwordsMismatch = form?.hasError('senhasDiferentes');
    return !!(control && control.invalid && (control.dirty || control.touched) || (passwordsMismatch && control?.touched));
  }
}
