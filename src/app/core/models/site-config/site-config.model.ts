/* ======================================================
 * ENUMS
 * ====================================================== */

export type HeroBackgroundType =
  | 'GRADIENT'
  | 'IMAGE'
  | 'VIDEO';

export type HeroAlignment =
  | 'LEFT'
  | 'CENTER'
  | 'RIGHT';

export type HeroHeight =
  | 'SMALL'
  | 'MEDIUM'
  | 'FULLSCREEN';

export type HeroImageStyle =
  | 'NONE'
  | 'NORMAL'
  | 'ROUNDED'
  | 'CIRCLE'
  | 'FLOATING'
  | 'DEVICE_FRAME';

export type FeatureIcon =
  | 'VERIFIED'
  | 'LOCAL_SHIPPING'
  | 'SUPPORT_AGENT'
  | 'SECURITY'
  | 'STAR'
  | 'FAVORITE'
  | 'INVENTORY'
  | 'SHOPPING_BAG'
  | 'PAID'
  | 'BOLT';

export type GallerySize =
  | 'SMALL'
  | 'MEDIUM'
  | 'LARGE';

export type SiteSection =
  | 'HERO'
  | 'FEATURES'
  | 'ABOUT'
  | 'BANNERS'
  | 'PRODUCTS'
  | 'GALLERY'
  | 'CONTACT'
  | 'CTA'
  | 'FOOTER';

export type UploadType =
    | 'LOGO'
    | 'FAVICON'
    | 'HERO'
    | 'HERO_BACKGROUND'
    | 'HERO_VIDEO'
    | 'ABOUT'
    | 'BANNER'
    | 'GALLERY'
    | 'GALLERY_THUMBNAIL';


/* ======================================================
 * SETTINGS
 * ====================================================== */

export interface TenantSettings {

  id: number;

  businessName: string | null;

  slogan: string | null;

  email: string | null;

  phone: string | null;

  whatsapp: string | null;

  address: string | null;

  googleMapsUrl: string | null;

  facebook: string | null;

  instagram: string | null;

  tiktok: string | null;

  youtube: string | null;

  linkedin: string | null;

  businessHours: string | null;

  instagramUser: string | null;

  whatsappMessage: string | null;

  footerText: string | null;

}


/* ======================================================
 * HOME
 * ====================================================== */

export interface TenantHome {

  id: number;

  heroTitle: string | null;

  heroSubtitle: string | null;

  heroImage: string | null;

  aboutTitle: string | null;

  aboutText: string | null;

  aboutImage: string | null;

  ctaTitle: string | null;

  ctaText: string | null;

  ctaButtonText: string | null;

  ctaButtonLink: string | null;

  heroButtonText: string | null;

  heroButtonLink: string | null;

  aboutButtonText: string | null;

  aboutButtonLink: string | null;

  heroBackgroundType: HeroBackgroundType | null;

  heroBackgroundImage: string | null;

  heroBackgroundVideo: string | null;

  heroOverlayOpacity: number | null;

  heroAlignment: HeroAlignment | null;

  heroHeight: HeroHeight | null;

  heroImageStyle: HeroImageStyle | null;

}


/* ======================================================
 * THEME
 * ====================================================== */

export interface TenantTheme {

  id: number;

  primary_color: string | null;

  secondary_color: string | null;

  accent_color: string | null;

  text_color: string | null;

  title_color: string | null;

  logo_url: string | null;

  favicon_url: string | null;

  buttonTextColor: string | null;

  cardBackground: string | null;

  headerBackground: string | null;

  footerBackground: string | null;

  fontFamily: string | null;

  borderRadius: number | null;

}


/* ======================================================
 * BANNER
 * ====================================================== */

export interface TenantBanner {

  id: number;

  title: string | null;

  subtitle: string | null;

  imageUrl: string | null;

  buttonText: string | null;

  buttonLink: string | null;

  sortOrder: number | null;

  textColor: string | null;

  active: boolean | null;

}


/* ======================================================
 * FEATURE
 * ====================================================== */

export interface TenantFeature {

  id: number;

  title: string | null;

  description: string | null;

  icon: FeatureIcon | null;

  sortOrder: number | null;

  active: boolean | null;

}


/* ======================================================
 * GALLERY
 * ====================================================== */

export interface TenantGallery {

  id: number;

  title: string | null;

  imageUrl: string | null;

  sortOrder: number | null;

  active: boolean | null;

  size: GallerySize | null;

  thumbnailUrl: string | null;

}


/* ======================================================
 * SECTION
 * ====================================================== */

export interface TenantSection {

  id: number;

  section: SiteSection;

  sortOrden: number;

  enabled: boolean | null;

}


/* ======================================================
 * SITE CONFIG
 * ====================================================== */

export interface SiteConfig {

  settings: TenantSettings;

  home: TenantHome;

  theme: TenantTheme;

  banners: TenantBanner[];

  features: TenantFeature[];

  gallery: TenantGallery[];

  sections: TenantSection[];

}


/* ======================================================
 * UPLOAD
 * ====================================================== */

export interface UploadResponse {

  url: string;

}


/* ======================================================
 * GALLERY UPLOAD EVENT
 * ====================================================== */

export interface GalleryUploadEvent {

  file: File;

  gallery: TenantGallery;

}