import { AdminIconOption } from "@shared/design-system-admin/forms/admin-icon-picker/admin-icon-picker";


export const FEATURE_ICONS: AdminIconOption[] = [

  {
    value: 'VERIFIED',
    icon: 'fa-solid fa-circle-check',
    label: 'Verificado'
  },

  {
    value: 'LOCAL_SHIPPING',
    icon: 'fa-solid fa-truck-fast',
    label: 'Envío'
  },

  {
    value: 'SUPPORT_AGENT',
    icon: 'fa-solid fa-headset',
    label: 'Soporte'
  },

  {
    value: 'SECURITY',
    icon: 'fa-solid fa-shield-halved',
    label: 'Seguridad'
  },

  {
    value: 'STAR',
    icon: 'fa-solid fa-star',
    label: 'Destacado'
  },

  {
    value: 'FAVORITE',
    icon: 'fa-solid fa-heart',
    label: 'Favorito'
  },

  {
    value: 'INVENTORY',
    icon: 'fa-solid fa-boxes-stacked',
    label: 'Stock'
  },

  {
    value: 'SHOPPING_BAG',
    icon: 'fa-solid fa-bag-shopping',
    label: 'Compras'
  },

  {
    value: 'PAID',
    icon: 'fa-solid fa-credit-card',
    label: 'Pago'
  },

  {
    value: 'BOLT',
    icon: 'fa-solid fa-bolt',
    label: 'Rápido'
  }

];

export function featureIconClass(
    value?: string | null
): string {

    return FEATURE_ICONS.find(
        i => i.value === value
    )?.icon ?? 'fa-solid fa-check';

}