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
import { TenantAboutMilestone } from '../../../core/models/site-config';

@Component({
  selector: 'app-about-milestone-editor',
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
    AdminInputDirective,
    AdminTextareaDirective
  ],
  templateUrl: './about-milestone-editor.html',
  styleUrl: './about-milestone-editor.scss'
})
export class AboutMilestoneEditor {

  @Input({ required: true })
  milestones: TenantAboutMilestone[] = [];

  @Output()
  readonly create =
    new EventEmitter<void>();

  @Output()
  readonly save =
    new EventEmitter<TenantAboutMilestone>();

  @Output()
  readonly delete =
    new EventEmitter<TenantAboutMilestone>();


  createMilestone(): void {

    this.create.emit();

  }

  saveMilestone(
    milestone: TenantAboutMilestone
  ): void {

    this.save.emit(milestone);

  }

  deleteMilestone(
    milestone: TenantAboutMilestone
  ): void {

    this.delete.emit(milestone);

  }

}
