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
import { AdminButton, AdminFormCard, AdminFormCardActionsDirective, AdminFormPreview, AdminSaveBar, AdminSaveBarState } from '@shared/design-system-admin';
import { AdminSwitch } from '@shared/design-system-admin/forms/admin-switch/admin-switch';
import { AdminIconPicker } from '@shared/design-system-admin/forms/admin-icon-picker/admin-icon-picker';
import { TenantFeature } from '../../../core/models/site-config';

@Component({
  selector: 'app-feature-editor',
  standalone: true,
  imports: [

    CommonModule,
    FormsModule,
    AdminSection,
    AdminFormCard,
    AdminFormGrid,
    AdminField,
    AdminFormPreview,
    AdminButton,
    AdminSwitch,
    AdminSaveBar,
    AdminSectionActionsDirective,
    AdminIconPicker,
    AdminFormCardActionsDirective,
    AdminInputDirective,
    AdminTextareaDirective


  ],
  templateUrl: './feature-editor.html',
  styleUrl: './feature-editor.scss'
})
export class FeatureEditor {

  @Input({ required: true })
  features: TenantFeature[] = [];

  @Output()
  readonly create =
    new EventEmitter<void>();

  @Output()
  readonly save =
    new EventEmitter<TenantFeature>();

  @Output()
  readonly delete =
    new EventEmitter<TenantFeature>();

    saveState: AdminSaveBarState = 'clean';
    
  /*======================================================
  CREATE
  ======================================================*/

  createFeature(): void {

    this.create.emit();

  }

  /*======================================================
  SAVE
  ======================================================*/

  saveFeature(
    feature: TenantFeature
  ): void {

    this.save.emit(feature);

  }

  /*======================================================
  DELETE
  ======================================================*/

  deleteFeature(
    feature: TenantFeature
  ): void {

    this.delete.emit(feature);

  }
  

}