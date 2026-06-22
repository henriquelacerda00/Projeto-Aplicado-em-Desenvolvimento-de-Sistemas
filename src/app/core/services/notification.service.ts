import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private toastr: ToastrService) {}

  success(message: string) {
    this.toastr.success(message, 'Sucesso');
  }

  error(message: string) {
    this.toastr.error(message, 'Erro');
  }

  warning(message: string) {
    this.toastr.warning(message, 'Atenção');
  }

  info(message: string) {
    this.toastr.info(message, 'Info');
  }

}