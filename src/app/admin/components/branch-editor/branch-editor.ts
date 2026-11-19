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
import { AdminButton, AdminFormCard, AdminFormCardActionsDirective, AdminSaveBar } from '@shared/design-system-admin';
import { AdminSwitch } from '@shared/design-system-admin/forms/admin-switch/admin-switch';

import {
  DayOfWeek,
  TenantBranch,
  TenantBranchHours
} from '../../../core/models/site-config';

import {
  PLACEHOLDER_IMAGES,
  resolveImage
} from '@shared/placeholders';

import {
  AdminMapPicker,
  MapPosition
} from '@shared/design-system-admin/media/admin-map-picker/admin-map-picker';

interface DayDefinition {
  key: DayOfWeek;
  label: string;
}

@Component({
  selector: 'app-branch-editor',
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
    AdminMapPicker
  ],
  templateUrl: './branch-editor.html',
  styleUrl: './branch-editor.scss'
})
export class BranchEditor {

  readonly placeholder =
    PLACEHOLDER_IMAGES;

  resolveImage =
    resolveImage;

  readonly days: DayDefinition[] = [
    { key: 'MONDAY', label: 'Lunes' },
    { key: 'TUESDAY', label: 'Martes' },
    { key: 'WEDNESDAY', label: 'Miércoles' },
    { key: 'THURSDAY', label: 'Jueves' },
    { key: 'FRIDAY', label: 'Viernes' },
    { key: 'SATURDAY', label: 'Sábado' },
    { key: 'SUNDAY', label: 'Domingo' }
  ];

  @Input({ required: true })
  branches: TenantBranch[] = [];

  @Output()
  readonly create =
    new EventEmitter<void>();

  @Output()
  readonly save =
    new EventEmitter<TenantBranch>();

  @Output()
  readonly delete =
    new EventEmitter<TenantBranch>();

  @Output()
  readonly upload =
    new EventEmitter<{
      branch: TenantBranch;
      file: File;
    }>();


  /* ======================================================
   * CRUD
   * ====================================================== */

  createBranch(): void {

    this.create.emit();

  }

  saveBranch(
    branch: TenantBranch
  ): void {

    this.save.emit(branch);

  }

  deleteBranch(
    branch: TenantBranch
  ): void {

    this.delete.emit(branch);

  }

  uploadImage(
    branch: TenantBranch,
    file: File
  ): void {

    this.upload.emit({
      branch,
      file
    });

  }


  /* ======================================================
   * UBICACIÓN (mapa)
   * ====================================================== */

  setPosition(
    branch: TenantBranch,
    position: MapPosition
  ): void {

    branch.latitude = position.lat;
    branch.longitude = position.lng;

  }


  /* ======================================================
   * HORARIOS — estilo Google Business
   * ====================================================== */

  rangesForDay(
    branch: TenantBranch,
    day: DayOfWeek
  ): TenantBranchHours[] {

    return (branch.hours ?? [])
      .filter(h => h.dayOfWeek === day)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  }

  isDayOpen(
    branch: TenantBranch,
    day: DayOfWeek
  ): boolean {

    return this.rangesForDay(branch, day).length > 0;

  }

  toggleDay(
    branch: TenantBranch,
    day: DayOfWeek,
    open: boolean
  ): void {

    if (!open) {

      branch.hours = (branch.hours ?? [])
        .filter(h => h.dayOfWeek !== day);

      return;

    }

    if (this.isDayOpen(branch, day)) {
      return;
    }

    branch.hours = [
      ...(branch.hours ?? []),
      {
        dayOfWeek: day,
        opensAt: '09:00',
        closesAt: '18:00',
        sortOrder: 0
      }
    ];

  }

  addRange(
    branch: TenantBranch,
    day: DayOfWeek
  ): void {

    const existing =
      this.rangesForDay(branch, day);

    branch.hours = [
      ...(branch.hours ?? []),
      {
        dayOfWeek: day,
        opensAt: '09:00',
        closesAt: '18:00',
        sortOrder: existing.length
      }
    ];

  }

  removeRange(
    branch: TenantBranch,
    range: TenantBranchHours
  ): void {

    branch.hours = (branch.hours ?? [])
      .filter(h => h !== range);

  }

  /**
   * Comodidad tipo Google Business: copia los rangos del día indicado a
   * los otros 6 días, pisando lo que tuvieran cargado.
   */
  copyToAllDays(
    branch: TenantBranch,
    sourceDay: DayOfWeek
  ): void {

    const sourceRanges =
      this.rangesForDay(branch, sourceDay);

    const otherDays =
      this.days
        .map(d => d.key)
        .filter(key => key !== sourceDay);

    const kept = (branch.hours ?? [])
      .filter(h => h.dayOfWeek === sourceDay);

    const copies = otherDays.flatMap(day =>
      sourceRanges.map((range, index) => ({
        dayOfWeek: day,
        opensAt: range.opensAt,
        closesAt: range.closesAt,
        sortOrder: index
      }))
    );

    branch.hours = [
      ...kept,
      ...copies
    ];

  }

  timeValue(
    range: TenantBranchHours,
    field: 'opensAt' | 'closesAt'
  ): string {

    const value = range[field];

    return value ? value.substring(0, 5) : '';

  }

  setTimeValue(
    range: TenantBranchHours,
    field: 'opensAt' | 'closesAt',
    value: string
  ): void {

    range[field] = value;

  }

}
