import {
  Component,
  computed,
  inject
} from '@angular/core';
import { HeroBanner } from '../../components/hero-banner/hero-banner';
import { TenantStore } from '../../../core/store/tenant.store';
import { Features } from '../../components/features/features';
import { About } from '../../components/about/about';
import { BannerCarousel } from '../../components/baner-carousel/banner-carousel';
import { Gallery } from '../../components/gallery/gallery';
import { Cta } from '../../components/cta/cta';
import { Contact } from '../../components/contact/contact';
import { AboutDetail } from '../../components/about-detail/about-detail';
import { Branches } from '../../components/branches/branches';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroBanner,
    Features,
    About,
    AboutDetail,
    BannerCarousel,
    Gallery,
    Cta,
    Contact,
    Branches
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

  private readonly store =
    inject(TenantStore);

  readonly site =
    computed(() => this.store.site());

  readonly home =
    computed(() => this.site()?.home);

  readonly settings =
    computed(() => this.site()?.settings);

  readonly features =
    computed(() => this.site()?.features ?? []);

  readonly banners =
    computed(() => this.site()?.banners ?? []);

  readonly gallery =
    computed(() => this.site()?.gallery ?? []);

  readonly sections =
    computed(() => this.site()?.sections ?? []);

  readonly about =
    computed(() => this.site()?.about);

  readonly aboutValues =
    computed(() => this.site()?.aboutValues ?? []);

  readonly aboutMilestones =
    computed(() => this.site()?.aboutMilestones ?? []);

  readonly aboutTeam =
    computed(() => this.site()?.aboutTeam ?? []);

  readonly aboutStats =
    computed(() => this.site()?.aboutStats ?? []);

  readonly branches =
    computed(() => this.site()?.branches ?? []);

  isEnabled(section: string): boolean {
 
    return this.sections().some(
      (      item: { section: string; enabled: any; }) =>
        item.section === section &&
        item.enabled
    );

  }

}