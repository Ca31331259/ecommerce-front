import { AdminSelectOption } from '@shared/design-system-admin/forms/admin-select/admin-select';

/**
 * Valor sentinela para "URL personalizada" en los selects de destino de botón.
 */
export const CUSTOM_LINK_VALUE = '__CUSTOM__';

/**
 * Destinos posibles para los botones del sitio (hero, nosotros, CTA, banners):
 * anclas a las secciones del storefront público + URL custom.
 *
 * Los `value` son los `id` reales de cada `<ds-section>` del público
 * (hero-banner, about, about-detail, features, gallery, branches, contact) —
 * cambiar acá si se renombra un id allá. Una sola lista compartida para no
 * tener que mantener la misma enumeración en cada editor.
 */
export const SECTION_ANCHOR_OPTIONS: AdminSelectOption[] = [

  { value: '#hero', label: 'Inicio' },

  { value: '#about', label: 'Nosotros' },

  { value: '#about-detail', label: 'Nosotros (ampliado)' },

  { value: '#features', label: 'Beneficios' },

  { value: '#gallery', label: 'Galería' },

  { value: '#branches', label: 'Sucursales' },

  { value: '#products', label: 'Productos' },

  { value: '#contact', label: 'Contacto' },

  { value: CUSTOM_LINK_VALUE, label: 'URL personalizada...' }

];
