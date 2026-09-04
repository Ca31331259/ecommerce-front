import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  signal
} from '@angular/core';
import { DsSection } from '../../../shared/design-system/layout/ds-section';
import { DsContainer } from '../../../shared/design-system/layout/ds-container';
import { DsButton } from '../../../shared/design-system/atoms/ds-button';
import { DsImagePlaceholder } from '../../../shared/design-system/atoms/ds-image-placeholder';



@Component({
  selector: 'app-banner-carousel',
  standalone: true,
  imports: [
    DsSection,
    DsContainer,
    DsButton,
    DsImagePlaceholder
  ],
  templateUrl: './banner-carousel.html',
  styleUrl: './banner-carousel.scss'
})
export class BannerCarousel implements OnInit, OnDestroy {

  @Input()
  banners: any[] = [];

  readonly activeIndex =
    signal(0);

  private autoplayInterval?: number;

  private readonly autoplayDelay =
    6000;

  ngOnInit(): void {

    this.startAutoplay();

  }

  ngOnDestroy(): void {

    this.stopAutoplay();

  }

  /*==========================================================
  ACTIVE BANNER
  ==========================================================*/

  get activeBanner(): any | null {

    if (!this.banners.length) {
      return null;
    }

    return (
      this.banners[this.activeIndex()] ??
      this.banners[0]
    );

  }

  /*==========================================================
  NAVIGATION
  ==========================================================*/

  previous(): void {

    if (this.banners.length <= 1) {
      return;
    }

    const index =
      this.activeIndex();

    this.activeIndex.set(
      index === 0
        ? this.banners.length - 1
        : index - 1
    );

    this.restartAutoplay();

  }

  next(): void {

    if (this.banners.length <= 1) {
      return;
    }

    this.activeIndex.update(
      index =>
        (index + 1) %
        this.banners.length
    );

    this.restartAutoplay();

  }

  goTo(index: number): void {

    if (
      index < 0 ||
      index >= this.banners.length
    ) {
      return;
    }

    this.activeIndex.set(index);

    this.restartAutoplay();

  }

  /*==========================================================
  AUTOPLAY
  ==========================================================*/

  private startAutoplay(): void {

    if (
      this.banners.length <= 1 ||
      this.autoplayInterval
    ) {
      return;
    }

    this.autoplayInterval =
      window.setInterval(
        () => {

          this.activeIndex.update(
            index =>
              (index + 1) %
              this.banners.length
          );

        },
        this.autoplayDelay
      );

  }

  private stopAutoplay(): void {

    if (!this.autoplayInterval) {
      return;
    }

    window.clearInterval(
      this.autoplayInterval
    );

    this.autoplayInterval =
      undefined;

  }

  private restartAutoplay(): void {

    this.stopAutoplay();

    this.startAutoplay();

  }

  pauseAutoplay(): void {

    this.stopAutoplay();

  }

  resumeAutoplay(): void {

    this.startAutoplay();

  }

  /*==========================================================
  ACTION
  ==========================================================*/

  openBanner(banner: any): void {

    const link =
      banner?.link;

    if (!link) {
      return;
    }

    if (link.startsWith('#')) {

      document
        .getElementById(
          link.substring(1)
        )
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

      return;

    }

    window.open(
      link,
      '_self'
    );

  }

}