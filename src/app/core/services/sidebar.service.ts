import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  private sidebarVisible$ = new BehaviorSubject<boolean>(true);

  sidebarVisible = this.sidebarVisible$.asObservable();

  toggle() {
    this.sidebarVisible$.next(!this.sidebarVisible$.value);
  }

  open() {
    this.sidebarVisible$.next(true);
  }

  close() {
    this.sidebarVisible$.next(false);
  }
}
