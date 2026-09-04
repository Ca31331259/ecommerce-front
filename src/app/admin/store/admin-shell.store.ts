import {
  Injectable,
  signal
} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminShellStore {

  private readonly _mobileSidebarOpen =
    signal(false);

  readonly mobileSidebarOpen =
    this._mobileSidebarOpen.asReadonly();

  openMobileSidebar(): void {

    this._mobileSidebarOpen.set(true);

  }

  closeMobileSidebar(): void {

    this._mobileSidebarOpen.set(false);

  }

  toggleMobileSidebar(): void {

    this._mobileSidebarOpen.update(
      open => !open
    );

  }

}