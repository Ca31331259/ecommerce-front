import {
  Component,
  Input,
  inject
} from '@angular/core';

import {
  DomSanitizer,
  SafeResourceUrl
} from '@angular/platform-browser';

import {
  DayOfWeek,
  TenantBranch,
  TenantBranchHours
} from '../../../core/models/site-config';

import {
  DsSection
} from '../../../shared/design-system/layout/ds-section';

import {
  DsContainer
} from '../../../shared/design-system/layout/ds-container';

import {
  DsSectionHeader
} from '../../../shared/design-system/layout/ds-section-header';

import {
  DsHeaderBadgeDirective
} from '../../../shared/design-system/layout/ds-section-header/directives/ds-header-badge.directive';

import {
  DsBadge
} from '../../../shared/design-system/atoms/ds-badge';

import {
  DsCard
} from '../../../shared/design-system/atoms/ds-card';

interface DayRow {
  label: string;
  hours: string;
}

const DAY_LABELS: { key: DayOfWeek; label: string }[] = [
  { key: 'MONDAY', label: 'Lunes' },
  { key: 'TUESDAY', label: 'Martes' },
  { key: 'WEDNESDAY', label: 'Miércoles' },
  { key: 'THURSDAY', label: 'Jueves' },
  { key: 'FRIDAY', label: 'Viernes' },
  { key: 'SATURDAY', label: 'Sábado' },
  { key: 'SUNDAY', label: 'Domingo' }
];

@Component({
  selector: 'app-branches',
  standalone: true,
  imports: [
    DsSection,
    DsContainer,

    DsSectionHeader,
    DsHeaderBadgeDirective,

    DsBadge,
    DsCard
  ],
  templateUrl: './branches.html',
  styleUrl: './branches.scss'
})
export class Branches {

  @Input({ required: true })
  branches: TenantBranch[] = [];

  private readonly sanitizer = inject(DomSanitizer);

  private readonly embedCache = new Map<number, SafeResourceUrl>();

  /**
   * true si la sucursal tiene un pin cargado (latitude/longitude) para
   * mostrar el mapa embebido.
   */
  hasPin(branch: TenantBranch): boolean {

    return branch.latitude != null && branch.longitude != null;

  }

  /**
   * URL del mapa embebido de OpenStreetMap centrado en el pin de la sucursal.
   * Se usa un iframe (no Leaflet) para no sumar la librería al bundle público.
   * Cacheada por branch.id porque Angular llama a los getters del template en
   * cada ciclo de detección de cambios.
   */
  mapEmbedUrl(branch: TenantBranch): SafeResourceUrl | null {

    if (!this.hasPin(branch)) {

      return null;

    }

    const cached = this.embedCache.get(branch.id);

    if (cached) {

      return cached;

    }

    const lat = branch.latitude as number;
    const lng = branch.longitude as number;

    // ~±900 m alrededor del punto.
    const d = 0.008;

    const bbox = [
      lng - d,
      lat - d,
      lng + d,
      lat + d
    ].join('%2C');

    const url =
      `https://www.openstreetmap.org/export/embed.html`
      + `?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;

    const safe = this.sanitizer.bypassSecurityTrustResourceUrl(url);

    this.embedCache.set(branch.id, safe);

    return safe;

  }


  /**
   * Prioriza el link manual (googleMapsUrl) si está cargado — puede apuntar a
   * un lugar/nombre en vez de coordenadas puras y el admin lo eligió a
   * propósito — y solo arma un link a partir de latitude/longitude si no hay
   * uno cargado.
   */
  mapLink(
    branch: TenantBranch
  ): string | null {

    if (branch.googleMapsUrl) {

      return branch.googleMapsUrl;

    }

    if (branch.latitude != null && branch.longitude != null) {

      return `https://www.google.com/maps/search/?api=1&query=${branch.latitude},${branch.longitude}`;

    }

    return null;

  }

  scheduleFor(
    branch: TenantBranch
  ): DayRow[] {

    return DAY_LABELS.map(({ key, label }) => {

      const ranges = (branch.hours ?? [])
        .filter(h => h.dayOfWeek === key)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

      return {
        label,
        hours: ranges.length
          ? ranges.map(r => this.formatRange(r)).join(' / ')
          : 'Cerrado'
      };

    });

  }

  private formatRange(
    range: TenantBranchHours
  ): string {

    return `${this.hhmm(range.opensAt)} a ${this.hhmm(range.closesAt)}`;

  }

  private hhmm(
    value: string
  ): string {

    return value ? value.substring(0, 5) : '';

  }

}
