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
  | 'ABOUT_DETAIL'
  | 'BANNERS'
  | 'PRODUCTS'
  | 'EN_PROMOCION'
  | 'MAS_VENDIDOS'
  | 'NOVEDADES'
  | 'GALLERY'
  | 'CONTACT'
  | 'CTA'
  | 'BRANCHES'
  | 'FOOTER';

export type DayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export type UploadType =
    | 'LOGO'
    | 'FAVICON'
    | 'HERO'
    | 'HERO_BACKGROUND'
    | 'HERO_VIDEO'
    | 'ABOUT'
    | 'BANNER'
    | 'GALLERY'
    | 'GALLERY_THUMBNAIL'
    | 'ABOUT_TEAM'
    | 'BRANCH';


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
 * ABOUT (Nosotros ampliado)
 * ====================================================== */

export interface TenantAbout {

  id: number;

  historyEnabled: boolean | null;

  historyTitle: string | null;

  historyText: string | null;

  missionVisionEnabled: boolean | null;

  missionTitle: string | null;

  missionText: string | null;

  visionTitle: string | null;

  visionText: string | null;

  valuesEnabled: boolean | null;

  timelineEnabled: boolean | null;

  teamEnabled: boolean | null;

  statsEnabled: boolean | null;

}

export interface TenantAboutValue {

  id: number;

  title: string | null;

  description: string | null;

  icon: FeatureIcon | null;

  sortOrder: number | null;

  active: boolean | null;

}

export interface TenantAboutMilestone {

  id: number;

  year: string | null;

  title: string | null;

  description: string | null;

  sortOrder: number | null;

  active: boolean | null;

}

export interface TenantAboutTeamMember {

  id: number;

  name: string | null;

  role: string | null;

  photoUrl: string | null;

  bio: string | null;

  sortOrder: number | null;

  active: boolean | null;

}

export interface TenantAboutStat {

  id: number;

  value: string | null;

  label: string | null;

  sortOrder: number | null;

  active: boolean | null;

}


/* ======================================================
 * SUCURSALES
 * ====================================================== */

export interface TenantBranchHours {

  /** Solo se usa localmente en el editor (no viaja al backend). */
  id?: number;

  dayOfWeek: DayOfWeek;

  /** Formato "HH:mm" o "HH:mm:ss" (el backend devuelve LocalTime como ISO). */
  opensAt: string;

  closesAt: string;

  sortOrder: number;

}

export interface TenantBranch {

  id: number;

  name: string | null;

  address: string | null;

  phone: string | null;

  whatsapp: string | null;

  email: string | null;

  googleMapsUrl: string | null;

  latitude: number | null;

  longitude: number | null;

  imageUrl: string | null;

  sortOrder: number | null;

  active: boolean | null;

  hours: TenantBranchHours[];

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

  about: TenantAbout;

  aboutValues: TenantAboutValue[];

  aboutMilestones: TenantAboutMilestone[];

  aboutTeam: TenantAboutTeamMember[];

  aboutStats: TenantAboutStat[];

  branches: TenantBranch[];

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