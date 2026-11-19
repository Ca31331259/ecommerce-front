import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  SiteConfigService
} from '../../../core/services/site-config/site-config-service';

import {
  GalleryUploadEvent,
  SiteConfig as SiteConfigModel,
  TenantAbout,
  TenantAboutMilestone,
  TenantAboutStat,
  TenantAboutTeamMember,
  TenantAboutValue,
  TenantBanner,
  TenantBranch,
  TenantFeature,
  TenantGallery,
  TenantHome,
  TenantSection,
  TenantSettings,
  TenantTheme,
  UploadType
} from '../../../core/models/site-config';

import {
  CompanyForm
} from '../../components/company-form/company-form';

import {
  ThemeForm
} from '../../components/theme-form/theme-form';

import {
  HomeForm
} from '../../components/home-form/home-form';

import {
  BannerEditor
} from '../../components/banner-editor/banner-editor';

import {
  FeatureEditor
} from '../../components/feature-editor/feature-editor';

import {
  GalleryEditor
} from '../../components/gallery-editor/gallery-editor';

import {
  SectionEditor
} from '../../components/section-editor/section-editor';

import {
  AboutForm
} from '../../components/about-form/about-form';

import {
  AboutValueEditor
} from '../../components/about-value-editor/about-value-editor';

import {
  AboutMilestoneEditor
} from '../../components/about-milestone-editor/about-milestone-editor';

import {
  AboutTeamEditor
} from '../../components/about-team-editor/about-team-editor';

import {
  AboutStatEditor
} from '../../components/about-stat-editor/about-stat-editor';

import {
  BranchEditor
} from '../../components/branch-editor/branch-editor';

import {
  RouterLink
} from '@angular/router';

import {
  AdminBreadcrumb,
  AdminBreadcrumbItem,
  AdminEmptyState,
  AdminLoader,
  AdminPage,
  AdminTabDefinition,
  AdminTabPanel,
  AdminTabs,
  AdminToolbar
} from '@shared/design-system-admin';
import { AdminToastService } from '@shared/design-system-admin/feedback/admin-toast.service';
import { finalize, Observable } from 'rxjs';


@Component({
  selector: 'app-site-config',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,

    AdminPage,
    AdminToolbar,
    AdminLoader,
    AdminEmptyState,

    AdminBreadcrumb,
    AdminBreadcrumbItem,
    AdminTabs,
    AdminTabPanel,
    CompanyForm,
    HomeForm,
    ThemeForm,

    BannerEditor,
    FeatureEditor,
    GalleryEditor,
    SectionEditor,

    AboutForm,
    AboutValueEditor,
    AboutMilestoneEditor,
    AboutTeamEditor,
    AboutStatEditor,

    BranchEditor
  ],
  templateUrl: './site-config.html',
  styleUrl: './site-config.scss'
})
export class SiteConfig implements OnInit {

  /* ======================================================
   * DEPENDENCIES
   * ====================================================== */

  private readonly service =
    inject(SiteConfigService);


  /* ======================================================
   * STATE
   * ====================================================== */

  readonly loading =
    signal(true);

  readonly data =
    signal<SiteConfigModel | null>(null);

  readonly saving =
    signal(false);


  readonly hasChanges =
    signal(false);

  private readonly toast = inject(AdminToastService);


  /* ======================================================
   * TABS
   * ====================================================== */

  readonly tabs: AdminTabDefinition[] = [

    {
      id: 'general',
      label: 'General',
      icon: 'fa-solid fa-gear'
    },

    {
      id: 'home',
      label: 'Página principal',
      icon: 'fa-solid fa-house'
    },

    {
      id: 'about',
      label: 'Nosotros',
      icon: 'fa-solid fa-people-group'
    },

    {
      id: 'content',
      label: 'Contenido',
      icon: 'fa-solid fa-box-open'
    },

    {
      id: 'sections',
      label: 'Secciones',
      icon: 'fa-solid fa-puzzle-piece'
    }

  ];


  markDirty(): void {

    this.hasChanges.set(true);

  }


  /* ======================================================
   * LIFECYCLE
   * ====================================================== */

  ngOnInit(): void {

    this.load();

  }


  /* ======================================================
   * LOAD
   * ====================================================== */

  private load(): void {

    this.loading.set(true);

    this.service
      .get()
      .subscribe({

        next: (site) => {

          this.data.set(site);

          this.loading.set(false);

        },

        error: () => {

          this.loading.set(false);
          this.toast.error(
            'Error en el servicio.'
          );
        }

      });

  }


  /* ======================================================
   * SETTINGS
   * ====================================================== */

  saveSettings(
    settings: TenantSettings
  ): void {

    this.executeSave(

      this.service.saveSettings(settings),

      savedSettings => {

        this.data.update(site => {

          if (!site) {

            return site;

          }

          return {

            ...site,

            settings: savedSettings

          };

        });

      }

    );

  }

  /* ======================================================
   * HOME
   * ====================================================== */

  saveHome(
    home: TenantHome
  ): void {

    this.executeSave(

      this.service.saveHome(home),

      savedHome => {

        this.data.update(site => {

          if (!site) {

            return site;

          }

          return {

            ...site,

            home: savedHome

          };

        });

      }

    );

  }

  uploadBanner(
    banner: TenantBanner,
    file: File
  ): void {

    this.service
      .upload(
        file,
        'BANNER'
      )
      .subscribe({

        next: (res) => {

          banner.imageUrl = res.url;
          this.toast.success(
            'Cambios guardados correctamente.'
          );
        }

      });

  }


  /* ======================================================
   * THEME
   * ====================================================== */

  saveTheme(
    theme: TenantTheme
  ): void {

    this.executeSave(

      this.service.saveTheme(theme),

      savedTheme => {

        this.data.update(site => {

          if (!site) {

            return site;

          }

          return {

            ...site,

            theme: savedTheme

          };

        });

      }

    );

  }
  /* ======================================================
 * LOGO
 * ====================================================== */

  uploadLogo(
    file: File
  ): void {

    this.executeUpload(

      file,

      'LOGO',

      url => {

        this.data.update(site => {

          if (!site) {

            return site;

          }

          return {

            ...site,

            theme: {

              ...site.theme,

              logo_url: url

            }

          };

        });

      }

    );

  }
  /* ======================================================
   * HERO IMAGE
   * ====================================================== */

  uploadHero(
    file: File
  ): void {

    this.executeUpload(

      file,

      'HERO',

      url => {

        this.data.update(site => {

          if (!site) {

            return site;

          }

          return {

            ...site,

            home: {

              ...site.home,

              heroImage: url

            }

          };

        });

      }

    );

  }
  /* ======================================================
   * HERO BACKGROUND IMAGE
   * ====================================================== */
  uploadHeroBackground(
    file: File
  ): void {

    this.executeUpload(

      file,

      'HERO_BACKGROUND',

      url => {

        this.data.update(site => {

          if (!site) {

            return site;

          }

          return {

            ...site,

            home: {

              ...site.home,

              heroBackgroundImage: url

            }

          };

        });

      }

    );

  }

  /* ======================================================
   * HERO BACKGROUND VIDEO
   * ====================================================== */

  uploadHeroVideo(
    file: File
  ): void {

    this.executeUpload(

      file,

      'HERO_VIDEO',

      url => {

        this.data.update(site => {

          if (!site) {

            return site;

          }

          return {

            ...site,

            home: {

              ...site.home,

              heroBackgroundVideo: url

            }

          };

        });

      }

    );

  }

  /* ======================================================
   * ABOUT IMAGE
   * ====================================================== */

  uploadAbout(
    file: File
  ): void {

    this.executeUpload(

      file,

      'ABOUT',

      url => {

        this.data.update(site => {

          if (!site) {

            return site;

          }

          return {

            ...site,

            home: {

              ...site.home,

              aboutImage: url

            }

          };

        });

      }

    );

  }

  /* ======================================================
   * BANNERS
   * ====================================================== */

  createBanner(): void {

    this.service
      .createBanner()
      .subscribe({

        next: (banner) => {

          this.data.update(site => {

            if (!site) {

              return site;

            }
            this.toast.success(
              'Cambios guardados correctamente.'
            );
            return {
              ...site,
              banners: [
                ...site.banners,
                banner
              ]
            };

          });

        }

      });

  }


  saveBanner(
    banner: TenantBanner
  ): void {

    this.service
      .updateBanner(
        banner.id,
        banner
      )
      .subscribe({

        next: (savedBanner) => {

          this.data.update(site => {

            if (!site) {

              return site;

            }
            this.toast.success(
              'Cambios guardados correctamente.'
            );
            return {
              ...site,
              banners:
                site.banners.map(item =>
                  item.id === savedBanner.id
                    ? savedBanner
                    : item
                )
            };

          });

        }

      });

  }


  deleteBanner(
    banner: TenantBanner
  ): void {

    this.service
      .deleteBanner(
        banner.id
      )
      .subscribe({

        next: () => {

          this.data.update(site => {

            if (!site) {

              return site;

            }
            this.toast.success(
              'Cambios guardados correctamente.'
            );
            return {
              ...site,
              banners:
                site.banners.filter(
                  item =>
                    item.id !== banner.id
                )
            };

          });

        }

      });

  }


  /* ======================================================
   * FEATURES
   * ====================================================== */

  createFeature(): void {

    this.service
      .createFeature()
      .subscribe({

        next: (feature) => {

          this.data.update(site => {

            if (!site) {

              return site;

            }
            this.toast.success(
              'Cambios guardados correctamente.'
            );
            return {
              ...site,
              features: [
                ...site.features,
                feature
              ]
            };

          });

        }

      });

  }


  saveFeature(
    feature: TenantFeature
  ): void {

    this.service
      .updateFeature(
        feature.id,
        feature
      )
      .subscribe({

        next: (savedFeature) => {

          this.data.update(site => {

            if (!site) {

              return site;

            }
            this.toast.success(
              'Cambios guardados correctamente.'
            );
            return {
              ...site,
              features:
                site.features.map(item =>
                  item.id === savedFeature.id
                    ? savedFeature
                    : item
                )
            };

          });

        }

      });

  }


  deleteFeature(
    feature: TenantFeature
  ): void {

    this.service
      .deleteFeature(
        feature.id
      )
      .subscribe({

        next: () => {

          this.data.update(site => {

            if (!site) {

              return site;

            }
            this.toast.success(
              'Cambios guardados correctamente.'
            );
            return {
              ...site,
              features:
                site.features.filter(
                  item =>
                    item.id !== feature.id
                )
            };

          });

        }

      });

  }


  /* ======================================================
   * GALLERY
   * ====================================================== */

  createGallery(): void {

    this.service
      .createGallery()
      .subscribe({

        next: (gallery) => {

          this.data.update(site => {

            if (!site) {

              return site;

            }
            this.toast.success(
              'Cambios guardados correctamente.'
            );
            return {
              ...site,
              gallery: [
                ...site.gallery,
                gallery
              ]
            };

          });

        }

      });

  }


  saveGallery(
    gallery: TenantGallery
  ): void {

    this.service
      .updateGallery(
        gallery.id,
        gallery
      )
      .subscribe({

        next: (savedGallery) => {

          this.data.update(site => {

            if (!site) {

              return site;

            }
            this.toast.success(
              'Cambios guardados correctamente.'
            );
            return {
              ...site,
              gallery:
                site.gallery.map(item =>
                  item.id === savedGallery.id
                    ? savedGallery
                    : item
                )
            };

          });

        }

      });

  }


  deleteGallery(
    gallery: TenantGallery
  ): void {

    this.service
      .deleteGallery(
        gallery.id
      )
      .subscribe({

        next: () => {

          this.data.update(site => {

            if (!site) {

              return site;

            }
            this.toast.success(
              'Cambios guardados correctamente.'
            );
            return {
              ...site,
              gallery:
                site.gallery.filter(
                  item =>
                    item.id !== gallery.id
                )
            };

          });

        }

      });

  }

uploadGalleryImages(
  data: {
    gallery: TenantGallery;
    image: File;
    thumbnail: File;
  }
): void {

  this.service
      .upload(data.image, 'GALLERY')
      .subscribe({

        next: image => {

          data.gallery.imageUrl = image.url;

          this.service
              .upload(data.thumbnail, 'GALLERY')
              .subscribe({

                next: thumb => {

                  data.gallery.thumbnailUrl = thumb.url;

                  this.saveGallery(data.gallery);

                },

                error: () => {

                  this.toast.error(
                    'No se pudo subir el thumbnail.'
                  );

                }

              });

        },

        error: () => {

          this.toast.error(
            'No se pudo subir la imagen.'
          );

        }

      });

}
  

  /* ======================================================
   * SECTIONS
   * ====================================================== */

  saveSection(
    section: TenantSection
  ): void {

    this.service
      .updateSection(
        section.id,
        section
      )
      .subscribe({

        next: (savedSection) => {

          this.data.update(site => {

            if (!site) {

              return site;

            }
            this.toast.success(
              'Cambios guardados correctamente.'
            );
            return {
              ...site,
              sections:
                site.sections.map(item =>
                  item.id === savedSection.id
                    ? savedSection
                    : item
                )
            };

          });

        }

      });

  }


  /* ======================================================
   * ABOUT (Nosotros ampliado)
   * ====================================================== */

  saveAbout(
    about: TenantAbout
  ): void {

    this.executeSave(

      this.service.saveAbout(about),

      savedAbout => {

        this.data.update(site => {

          if (!site) {

            return site;

          }

          return {

            ...site,

            about: savedAbout

          };

        });

      }

    );

  }


  /* -- Valores -- */

  createAboutValue(): void {

    this.service
      .createAboutValue()
      .subscribe({

        next: (value) => {

          this.data.update(site => {

            if (!site) {

              return site;

            }
            this.toast.success(
              'Cambios guardados correctamente.'
            );
            return {
              ...site,
              aboutValues: [
                ...site.aboutValues,
                value
              ]
            };

          });

        }

      });

  }


  saveAboutValue(
    value: TenantAboutValue
  ): void {

    this.service
      .updateAboutValue(
        value.id,
        value
      )
      .subscribe({

        next: (savedValue) => {

          this.data.update(site => {

            if (!site) {

              return site;

            }
            this.toast.success(
              'Cambios guardados correctamente.'
            );
            return {
              ...site,
              aboutValues:
                site.aboutValues.map(item =>
                  item.id === savedValue.id
                    ? savedValue
                    : item
                )
            };

          });

        }

      });

  }


  deleteAboutValue(
    value: TenantAboutValue
  ): void {

    this.service
      .deleteAboutValue(
        value.id
      )
      .subscribe({

        next: () => {

          this.data.update(site => {

            if (!site) {

              return site;

            }
            this.toast.success(
              'Cambios guardados correctamente.'
            );
            return {
              ...site,
              aboutValues:
                site.aboutValues.filter(
                  item =>
                    item.id !== value.id
                )
            };

          });

        }

      });

  }


  /* -- Hitos (línea de tiempo) -- */

  createAboutMilestone(): void {

    this.service
      .createAboutMilestone()
      .subscribe({

        next: (milestone) => {

          this.data.update(site => {

            if (!site) {

              return site;

            }
            this.toast.success(
              'Cambios guardados correctamente.'
            );
            return {
              ...site,
              aboutMilestones: [
                ...site.aboutMilestones,
                milestone
              ]
            };

          });

        }

      });

  }


  saveAboutMilestone(
    milestone: TenantAboutMilestone
  ): void {

    this.service
      .updateAboutMilestone(
        milestone.id,
        milestone
      )
      .subscribe({

        next: (savedMilestone) => {

          this.data.update(site => {

            if (!site) {

              return site;

            }
            this.toast.success(
              'Cambios guardados correctamente.'
            );
            return {
              ...site,
              aboutMilestones:
                site.aboutMilestones.map(item =>
                  item.id === savedMilestone.id
                    ? savedMilestone
                    : item
                )
            };

          });

        }

      });

  }


  deleteAboutMilestone(
    milestone: TenantAboutMilestone
  ): void {

    this.service
      .deleteAboutMilestone(
        milestone.id
      )
      .subscribe({

        next: () => {

          this.data.update(site => {

            if (!site) {

              return site;

            }
            this.toast.success(
              'Cambios guardados correctamente.'
            );
            return {
              ...site,
              aboutMilestones:
                site.aboutMilestones.filter(
                  item =>
                    item.id !== milestone.id
                )
            };

          });

        }

      });

  }


  /* -- Equipo -- */

  createAboutTeamMember(): void {

    this.service
      .createAboutTeamMember()
      .subscribe({

        next: (member) => {

          this.data.update(site => {

            if (!site) {

              return site;

            }
            this.toast.success(
              'Cambios guardados correctamente.'
            );
            return {
              ...site,
              aboutTeam: [
                ...site.aboutTeam,
                member
              ]
            };

          });

        }

      });

  }


  saveAboutTeamMember(
    member: TenantAboutTeamMember
  ): void {

    this.service
      .updateAboutTeamMember(
        member.id,
        member
      )
      .subscribe({

        next: (savedMember) => {

          this.data.update(site => {

            if (!site) {

              return site;

            }
            this.toast.success(
              'Cambios guardados correctamente.'
            );
            return {
              ...site,
              aboutTeam:
                site.aboutTeam.map(item =>
                  item.id === savedMember.id
                    ? savedMember
                    : item
                )
            };

          });

        }

      });

  }


  deleteAboutTeamMember(
    member: TenantAboutTeamMember
  ): void {

    this.service
      .deleteAboutTeamMember(
        member.id
      )
      .subscribe({

        next: () => {

          this.data.update(site => {

            if (!site) {

              return site;

            }
            this.toast.success(
              'Cambios guardados correctamente.'
            );
            return {
              ...site,
              aboutTeam:
                site.aboutTeam.filter(
                  item =>
                    item.id !== member.id
                )
            };

          });

        }

      });

  }


  uploadAboutTeamPhoto(
    member: TenantAboutTeamMember,
    file: File
  ): void {

    this.service
      .upload(
        file,
        'ABOUT_TEAM'
      )
      .subscribe({

        next: (res) => {

          member.photoUrl = res.url;
          this.toast.success(
            'Cambios guardados correctamente.'
          );
        }

      });

  }


  /* -- Stats (números destacados) -- */

  createAboutStat(): void {

    this.service
      .createAboutStat()
      .subscribe({

        next: (stat) => {

          this.data.update(site => {

            if (!site) {

              return site;

            }
            this.toast.success(
              'Cambios guardados correctamente.'
            );
            return {
              ...site,
              aboutStats: [
                ...site.aboutStats,
                stat
              ]
            };

          });

        }

      });

  }


  saveAboutStat(
    stat: TenantAboutStat
  ): void {

    this.service
      .updateAboutStat(
        stat.id,
        stat
      )
      .subscribe({

        next: (savedStat) => {

          this.data.update(site => {

            if (!site) {

              return site;

            }
            this.toast.success(
              'Cambios guardados correctamente.'
            );
            return {
              ...site,
              aboutStats:
                site.aboutStats.map(item =>
                  item.id === savedStat.id
                    ? savedStat
                    : item
                )
            };

          });

        }

      });

  }


  deleteAboutStat(
    stat: TenantAboutStat
  ): void {

    this.service
      .deleteAboutStat(
        stat.id
      )
      .subscribe({

        next: () => {

          this.data.update(site => {

            if (!site) {

              return site;

            }
            this.toast.success(
              'Cambios guardados correctamente.'
            );
            return {
              ...site,
              aboutStats:
                site.aboutStats.filter(
                  item =>
                    item.id !== stat.id
                )
            };

          });

        }

      });

  }


  /* ======================================================
   * SUCURSALES
   * ====================================================== */

  createBranch(): void {

    this.service
      .createBranch()
      .subscribe({

        next: (branch) => {

          this.data.update(site => {

            if (!site) {

              return site;

            }
            this.toast.success(
              'Cambios guardados correctamente.'
            );
            return {
              ...site,
              branches: [
                ...site.branches,
                branch
              ]
            };

          });

        }

      });

  }


  saveBranch(
    branch: TenantBranch
  ): void {

    this.service
      .updateBranch(
        branch.id,
        branch
      )
      .subscribe({

        next: (savedBranch) => {

          this.data.update(site => {

            if (!site) {

              return site;

            }
            this.toast.success(
              'Cambios guardados correctamente.'
            );
            return {
              ...site,
              branches:
                site.branches.map(item =>
                  item.id === savedBranch.id
                    ? savedBranch
                    : item
                )
            };

          });

        },

        error: () => {

          this.toast.error(
            'No se pudieron guardar los cambios.'
          );

        }

      });

  }


  deleteBranch(
    branch: TenantBranch
  ): void {

    this.service
      .deleteBranch(
        branch.id
      )
      .subscribe({

        next: () => {

          this.data.update(site => {

            if (!site) {

              return site;

            }
            this.toast.success(
              'Cambios guardados correctamente.'
            );
            return {
              ...site,
              branches:
                site.branches.filter(
                  item =>
                    item.id !== branch.id
                )
            };

          });

        }

      });

  }


  uploadBranchImage(
    branch: TenantBranch,
    file: File
  ): void {

    this.service
      .upload(
        file,
        'BRANCH'
      )
      .subscribe({

        next: (res) => {

          branch.imageUrl = res.url;
          this.toast.success(
            'Cambios guardados correctamente.'
          );
        }

      });

  }


  private startSaving(): void {

    this.saving.set(true);

  }

  private stopSaving(): void {

    this.saving.set(false);

  }

  



  /* ======================================================
 * SAVE HELPERS
 * ====================================================== */

  private executeSave<T>(
    request$: Observable<T>,
    onSuccess: (value: T) => void
  ): void {

    this.saving.set(true);

    request$
      .pipe(
        finalize(() => this.saving.set(false))
      )
      .subscribe({

        next: value => {

          onSuccess(value);

          this.hasChanges.set(false);

          this.toast.success(
            'Cambios guardados correctamente.'
          );

        },

        error: () => {

          this.toast.error(
            'No se pudieron guardar los cambios.'
          );

        }

      });

  }

  private executeUpload(
    file: File,
    type: UploadType,
    onSuccess: (url: string) => void
  ): void {

    this.saving.set(true);

    this.service
      .upload(file, type)
      .pipe(
        finalize(() => this.saving.set(false))
      )
      .subscribe({

        next: response => {

          onSuccess(response.url);

          this.toast.success(
            'Archivo actualizado correctamente.'
          );

        },

        error: () => {

          this.toast.error(
            'No se pudo subir el archivo.'
          );

        }

      });

  }

  uploadFavicon(file: File): void {

    this.executeUpload(

      file,

      'FAVICON',

      url => {

        this.data.update(site => {

          if (!site) {
            return site;
          }

          return {
            ...site,
            theme: {
              ...site.theme,
              favicon_url: url
            }
          };

        });

      }

    );

  }


saveSectionsOrder(
  sections: TenantSection[]
): void {

  this.service
    .updateSectionsOrder(sections)
    .subscribe({

      next: () => {

        this.data.update(site => {

          if (!site) {
            return site;
          }

          return {
            ...site,
            sections: [...sections]
          };

        });

        this.toast.success(
          'Orden guardado correctamente.'
        );

      }

    });

}

}