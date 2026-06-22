import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingSignal = signal(false);

  show() {
    this.loadingSignal.set(true);
  }

  hide() {
    this.loadingSignal.set(false);
  }

  isLoading() {
    return this.loadingSignal();
  }

  loading = this.loadingSignal.asReadonly(); // opcional: para bind com Signal diretamente
}