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
import { AdminUpload, AdminUploadMetaDirective } from '../../../shared/design-system-admin/forms/admin-upload';

import { AdminInputDirective } from '../../../shared/design-system-admin/forms/admin-input';
import { AdminTextareaDirective } from '../../../shared/design-system-admin/forms/admin-textarea';
import { AdminButton, AdminFormCard, AdminFormCardActionsDirective, AdminSaveBar } from '@shared/design-system-admin';
import { AdminSwitch } from '@shared/design-system-admin/forms/admin-switch/admin-switch';
import { TenantAboutTeamMember } from '../../../core/models/site-config';

import {
  PLACEHOLDER_IMAGES,
  resolveImage
} from '@shared/placeholders';

@Component({
  selector: 'app-about-team-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdminSection,
    AdminFormCard,
    AdminFormGrid,
    AdminField,
    AdminUpload,
    AdminUploadMetaDirective,
    AdminButton,
    AdminSwitch,
    AdminSaveBar,
    AdminSectionActionsDirective,
    AdminFormCardActionsDirective,
    AdminInputDirective,
    AdminTextareaDirective
  ],
  templateUrl: './about-team-editor.html',
  styleUrl: './about-team-editor.scss'
})
export class AboutTeamEditor {

  readonly placeholder =
    PLACEHOLDER_IMAGES;

  resolveImage =
    resolveImage;

  @Input({ required: true })
  members: TenantAboutTeamMember[] = [];

  @Output()
  readonly create =
    new EventEmitter<void>();

  @Output()
  readonly save =
    new EventEmitter<TenantAboutTeamMember>();

  @Output()
  readonly delete =
    new EventEmitter<TenantAboutTeamMember>();

  @Output()
  readonly upload =
    new EventEmitter<{
      member: TenantAboutTeamMember;
      file: File;
    }>();


  createMember(): void {

    this.create.emit();

  }

  saveMember(
    member: TenantAboutTeamMember
  ): void {

    this.save.emit(member);

  }

  deleteMember(
    member: TenantAboutTeamMember
  ): void {

    this.delete.emit(member);

  }

  uploadPhoto(
    member: TenantAboutTeamMember,
    file: File
  ): void {

    this.upload.emit({
      member,
      file
    });

  }

}
