import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminSection, AdminSectionActionsDirective } from '../../../shared/design-system-admin/layout/admin-section';

import { AdminFormGrid } from '../../../shared/design-system-admin/forms/admin-form-grid';
import { AdminField } from '../../../shared/design-system-admin/forms/admin-field';

import { AdminInputDirective } from '../../../shared/design-system-admin/forms/admin-input';
import { AdminTextareaDirective } from '../../../shared/design-system-admin/forms/admin-textarea';
import { AdminButton, AdminFormCard, AdminFormCardActionsDirective, AdminSaveBar } from '@shared/design-system-admin';
import { AdminSwitch } from '@shared/design-system-admin/forms/admin-switch/admin-switch';
import { AdminIconPicker } from '@shared/design-system-admin/forms/admin-icon-picker/admin-icon-picker';
import { TenantAboutValue } from '../../../core/models/site-config';

@Component({
  selector: 'app-about-value-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdminSection,
    AdminFormCard,
    AdminFormGrid,
    AdminField,
    AdminButton,
    AdminSwitch,
    AdminSaveBar,
    AdminSectionActionsDirective,
    AdminIconPicker,
    AdminFormCardActionsDirective,
    AdminInputDirective,
    AdminTextareaDirective
  ],
  templateUrl: './about-value-editor.html',
  styleUrl: './about-value-editor.scss'
})
export class AboutValueEditor {

  @Input({ required: true })
  values: TenantAboutValue[] = [];

  @Output()
  readonly create =
    new EventEmitter<void>();

  @Output()
  readonly save =
    new EventEmitter<TenantAboutValue>();

  @Output()
  readonly delete =
    new EventEmitter<TenantAboutValue>();


  createValue(): void {

    this.create.emit();

  }

  saveValue(
    value: TenantAboutValue
  ): void {

    this.save.emit(value);

  }

  deleteValue(
    value: TenantAboutValue
  ): void {

    this.delete.emit(value);

  }

}
