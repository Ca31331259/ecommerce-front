import {
  Component,
  Input,
  inject
} from '@angular/core';

import { AdminTabs } from './admin-tabs';

/**
 * Panel de contenido de un `admin-tabs`. Se instancia proyectado dentro de
 * `<admin-tabs>` y usa `inject(AdminTabs)` para saber si su `tabId` es el
 * tab activo — la inyección resuelve al padre por posición en el DOM
 * renderizado (donde este panel efectivamente queda anidado), no por el
 * árbol lógico de templates.
 */
@Component({
  selector: 'admin-tab-panel',
  standalone: true,
  template: `
    @if (isActive) {

    <ng-content></ng-content>

    }
  `
})
export class AdminTabPanel {

  private readonly tabs =
    inject(AdminTabs);

  @Input({ required: true })
  tabId = '';

  get isActive(): boolean {

    return this.tabs.activeTab === this.tabId;

  }

}
