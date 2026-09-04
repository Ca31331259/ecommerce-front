import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  ViewChild
} from '@angular/core';

import {
  TenantHome
} from '../../../core/models/site-config';

import {
  DsContainer
} from '../../../shared/design-system/layout/ds-container';

import {
  DsButton
} from '../../../shared/design-system/atoms/ds-button';
import { PLACEHOLDER_IMAGES, resolveImage } from '@shared/placeholders';


@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [
    DsContainer,
    DsButton
  ],
  templateUrl: './hero-banner.html',
  styleUrl: './hero-banner.scss'
})
export class HeroBanner implements AfterViewInit, OnChanges{

  /*==========================================================
  INPUTS
  ==========================================================*/

  @Input({
    required: true
  })
  home!: TenantHome;

  @ViewChild('heroVideo')
heroVideo?: ElementRef<HTMLVideoElement>;

isMobile = false;

@HostListener('window:resize')
onResize(): void {
  this.checkScreen();
}

ngOnInit(): void {
  this.checkScreen();
}

private checkScreen(): void {
  this.isMobile = window.innerWidth < 768;
}

ngAfterViewInit(): void {

  this.playVideo();

}

ngOnChanges(): void {
  queueMicrotask(() => this.playVideo());

}


private playVideo(): void {

  if (!this.heroVideo) {
    return;
  }

  const video = this.heroVideo.nativeElement;

  video.muted = true;
  video.defaultMuted = true;

  video.load();

  video.play().catch(err => {

    console.warn('No pudo iniciar el video', err);

  });

}


  readonly placeholder =
    PLACEHOLDER_IMAGES;

resolveImage =
    resolveImage;

  /*==========================================================
  BACKGROUND
  ==========================================================*/

  get backgroundType() {

    return (
      this.home.heroBackgroundType ??
      'GRADIENT'
    );

  }


  get heroBackgroundImage(): string {

    return this.resolveImage(

        this.home.heroBackgroundImage,

        this.placeholder.hero

    );

}


  get isGradient(): boolean {

    return (
      this.backgroundType ===
      'GRADIENT'
    );

  }


get isImageBackground(): boolean {

  return this.backgroundType === 'IMAGE';

}

  get isVideoBackground(): boolean {

    return (
      this.backgroundType === 'VIDEO' &&
      !!this.home.heroBackgroundVideo
    );

  }


  /*==========================================================
  ALIGNMENT
  ==========================================================*/

  @HostBinding('class.align-left')
  get alignLeft(): boolean {

    return (
      this.home.heroAlignment ??
      'LEFT'
    ) === 'LEFT';

  }


  @HostBinding('class.align-center')
  get alignCenter(): boolean {

    return (
      this.home.heroAlignment ===
      'CENTER'
    );

  }


  @HostBinding('class.align-right')
  get alignRight(): boolean {

    return (
      this.home.heroAlignment ===
      'RIGHT'
    );

  }


  /*==========================================================
  HEIGHT
  ==========================================================*/

  @HostBinding('class.height-small')
  get heightSmall(): boolean {

    return (
      this.home.heroHeight ===
      'SMALL'
    );

  }


  @HostBinding('class.height-medium')
  get heightMedium(): boolean {

    return (
      this.home.heroHeight ===
      'MEDIUM'
    );

  }


  @HostBinding('class.height-fullscreen')
  get heightFullscreen(): boolean {

    return (
      this.home.heroHeight ??
      'FULLSCREEN'
    ) === 'FULLSCREEN';

  }


  /*==========================================================
  IMAGE STYLE
  ==========================================================*/

  get heroImageStyle() {

    return (
      this.home.heroImageStyle ??
      'ROUNDED'
    );

  }


  /*==========================================================
  OVERLAY
  ==========================================================*/

  get overlayOpacity(): number {

    const opacity =
      Number(
        this.home.heroOverlayOpacity ??
        35
      );

    return (
      Math.min(
        Math.max(
          opacity,
          0
        ),
        100
      ) / 100
    );

  }


  /*==========================================================
  NAVIGATION
  ==========================================================*/

  openLink(): void {

    const link =
      this.home.heroButtonLink;

    if (!link) {

      return;

    }

    if (
      link.startsWith('#')
    ) {

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