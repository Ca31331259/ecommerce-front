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



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroBanner,
    Features,
    About,
    BannerCarousel,
    Gallery,
    Cta,
    Contact
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

  isEnabled(section: string): boolean {
 
    return this.sections().some(
      (      item: { section: string; enabled: any; }) =>
        item.section === section &&
        item.enabled
    );

  }

}