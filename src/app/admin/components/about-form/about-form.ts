import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  TenantAbout
} from '../../../core/models/site-config';

import {
  AdminButton,
  AdminField,
  AdminFormCard,
  AdminFormCardFooterDirective,
  AdminFormGrid
} from '@shared/design-system-admin';
import { AdminInputDirective } from '@shared/design-system-admin/forms/admin-input';
import { AdminTextareaDirective } from '@shared/design-system-admin/forms/admin-textarea';
import { AdminSwitch } from '@shared/design-system-admin/forms/admin-switch/admin-switch';

@Component({
  selector: 'app-about-form',
  standalone: true,
  imports: [
    FormsModule,

    AdminFormCard,
    AdminFormCardFooterDirective,
    AdminFormGrid,
    AdminField,
    AdminInputDirective,
    AdminTextareaDirective,
    AdminSwitch,
    AdminButton
  ],
  templateUrl: './about-form.html',
  styleUrl: './about-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutForm {

  /* ======================================================
   * INPUTS
   * ====================================================== */

  @Input({ required: true })
  about!: TenantAbout;


  /* ======================================================
   * OUTPUTS
   * ====================================================== */

  @Output()
  readonly save =
    new EventEmitter<TenantAbout>();


  /* ======================================================
   * ACTIONS
   * ====================================================== */

  saveAbout(): void {

    this.save.emit(this.about);

  }

}
