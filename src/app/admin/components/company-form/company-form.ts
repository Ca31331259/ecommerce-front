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
  TenantSettings
} from '../../../core/models/site-config';

import {
  AdminButton,
  AdminField,

  AdminFormCard,

  AdminFormCardFooterDirective,

  AdminFormGrid,
  AdminInputDirective
} from '@shared/design-system-admin';
import { AdminTextareaDirective } from '@shared/design-system-admin/forms/admin-textarea';


@Component({
  selector: 'app-company-form',
  standalone: true,
  imports: [
    FormsModule,
    AdminFormCardFooterDirective,
    AdminTextareaDirective,
    AdminFormCard,
    AdminInputDirective,
    AdminFormGrid,
    AdminField,
    AdminButton
  ],
  templateUrl: './company-form.html',
  styleUrl: './company-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyForm {

  /* ======================================================
   * INPUTS
   * ====================================================== */

  @Input({
    required: true
  })
  settings!: TenantSettings;


  /* ======================================================
   * OUTPUTS
   * ====================================================== */

  @Output()
  readonly save =
    new EventEmitter<TenantSettings>();

    @Output()
dirtyChange =
    new EventEmitter<boolean>();


  /* ======================================================
   * ACTIONS
   * ====================================================== */

  saveSettings(): void {

    this.save.emit(
      this.settings
    );

  }

}