import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray
} from '@angular/cdk/drag-drop';
import { AdminButton, AdminSection } from '@shared/design-system-admin';
import { AdminSwitch } from '@shared/design-system-admin/forms/admin-switch/admin-switch';
import { SiteSection, TenantSection } from '../../../core/models/site-config';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-section-editor',
  standalone: true,
  imports: [

    CommonModule,
    FormsModule,
    DragDropModule,

    AdminSection,
    AdminButton,
    AdminSwitch

  ],
  templateUrl: './section-editor.html',
  styleUrl: './section-editor.scss'
})
export class SectionEditor {

  readonly sectionLabels: Record<SiteSection, string> = {

    HERO: 'Hero Principal',

    FEATURES: 'Beneficios',

    ABOUT: 'Nosotros',

    BANNERS: 'Banners',

    PRODUCTS: 'Productos',

    GALLERY: 'Galería',

    CONTACT: 'Contacto',

    CTA: 'Llamado a la Acción',

    FOOTER: 'Pie de Página'

  };

  readonly sectionDescriptions: Record<SiteSection, string> = {

    HERO: 'Se muestra al ingresar al sitio.',

    FEATURES: 'Lista de beneficios destacados.',

    ABOUT: 'Información sobre la empresa.',

    BANNERS: 'Carrusel promocional.',

    PRODUCTS: 'Productos destacados.',

    GALLERY: 'Galería de imágenes.',

    CONTACT: 'Formulario y datos de contacto.',

    CTA: 'Bloque de llamada a la acción.',

    FOOTER: 'Pie de página del sitio.'

  };

  @Input({ required: true })
  sections: TenantSection[] = [];

  @Output()
  readonly save =
    new EventEmitter<TenantSection>();

  @Output()
  readonly saveOrder =
    new EventEmitter<TenantSection[]>();

  orderChanged = false;

  get heroSection(): TenantSection | undefined {

    return this.sections.find(
      section => section.section === 'HERO'
    );

  }

  get footerSection(): TenantSection | undefined {

    return this.sections.find(
      section => section.section === 'FOOTER'
    );

  }

  get movableSections(): TenantSection[] {

    return this.sections.filter(
      section =>
        section.section !== 'HERO' &&
        section.section !== 'FOOTER'
    );

  }

  saveSection(
    section: TenantSection
  ): void {

    this.save.emit(section);

  }

dropSection(
  event: CdkDragDrop<TenantSection[]>
): void {

  const movableSections = [...this.movableSections];

  moveItemInArray(
    movableSections,
    event.previousIndex,
    event.currentIndex
  );

  const hero = this.heroSection;
  const footer = this.footerSection;

  // HERO siempre primero
  if (hero) {
    hero.sortOrden = 0;
  }

  // Secciones configurables
  movableSections.forEach(
    (section, index) => {
      section.sortOrden = index + 1;
    }
  );

  // FOOTER siempre último
  if (footer) {
    footer.sortOrden = 999;
  }

  this.sections = [
    ...(hero ? [hero] : []),
    ...movableSections,
    ...(footer ? [footer] : [])
  ];

  this.orderChanged = true;

}

  saveSectionOrder(): void {

    this.saveOrder.emit(
      this.sections
    );

    this.orderChanged = false;

  }

  getSectionLabel(
    section: SiteSection
  ): string {

    return this.sectionLabels[section];

  }

  getSectionDescription(
    section: SiteSection
  ): string {

    return this.sectionDescriptions[section];

  }

}