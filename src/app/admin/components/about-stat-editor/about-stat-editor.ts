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
import { AdminButton, AdminFormCard, AdminFormCardActionsDirective, AdminSaveBar } from '@shared/design-system-admin';
import { AdminSwitch } from '@shared/design-system-admin/forms/admin-switch/admin-switch';
import { TenantAboutStat } from '../../../core/models/site-config';

@Component({
  selector: 'app-about-stat-editor',
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
    AdminFormCardActionsDirective,
    AdminInputDirective
  ],
  templateUrl: './about-stat-editor.html',
  styleUrl: './about-stat-editor.scss'
})
export class AboutStatEditor {

  @Input({ required: true })
  stats: TenantAboutStat[] = [];

  @Output()
  readonly create =
    new EventEmitter<void>();

  @Output()
  readonly save =
    new EventEmitter<TenantAboutStat>();

  @Output()
  readonly delete =
    new EventEmitter<TenantAboutStat>();


  createStat(): void {

    this.create.emit();

  }

  saveStat(
    stat: TenantAboutStat
  ): void {

    this.save.emit(stat);

  }

  deleteStat(
    stat: TenantAboutStat
  ): void {

    this.delete.emit(stat);

  }

}
