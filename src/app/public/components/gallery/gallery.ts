import {
  Component,
  HostListener,
  Input,
  OnDestroy,
  signal
} from '@angular/core';
import { DsSection } from '../../../shared/design-system/layout/ds-section';
import { DsContainer } from '../../../shared/design-system/layout/ds-container';
import { DsSectionHeader } from '../../../shared/design-system/layout/ds-section-header';
import { DsHeaderBadgeDirective } from '../../../shared/design-system/layout/ds-section-header/directives/ds-header-badge.directive';
import { DsBadge } from '../../../shared/design-system/atoms/ds-badge';
import { DsCard } from '../../../shared/design-system/atoms/ds-card';
import { DsEmptyDescriptionDirective, DsEmptyIconDirective, DsEmptyState, DsEmptyTitleDirective } from '../../../shared/design-system/molecules/ds-empty-state';
import { DsImagePlaceholder } from '../../../shared/design-system/atoms/ds-image-placeholder';



@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [
    DsSection,
    DsContainer,

    DsSectionHeader,
    DsHeaderBadgeDirective,

    DsBadge,

    DsCard,

    DsEmptyState,
    DsEmptyIconDirective,
    DsEmptyTitleDirective,
    DsEmptyDescriptionDirective,

    DsImagePlaceholder
  ],
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss'
})
export class Gallery implements OnDestroy {

  @Input()
  gallery: any[] = [];

  readonly selectedIndex =
    signal<number | null>(null);


  ngOnDestroy(): void {

    document.body.style.overflow =
      '';

  }

  /*==========================================================
  SELECTED ITEM
  ==========================================================*/

  get selectedItem(): any | null {

    const index =
      this.selectedIndex();

    if (index === null) {
      return null;
    }

    return (
      this.gallery[index] ??
      null
    );

  }

  /*==========================================================
  LIGHTBOX
  ==========================================================*/

  openItem(index: number): void {

    if (
      index < 0 ||
      index >= this.gallery.length
    ) {
      return;
    }

    this.selectedIndex.set(index);

    document.body.style.overflow =
      'hidden';

  }

  closeItem(): void {

    this.selectedIndex.set(null);

    document.body.style.overflow =
      '';

  }

  previous(): void {

    const index =
      this.selectedIndex();

    if (
      index === null ||
      this.gallery.length <= 1
    ) {
      return;
    }

    this.selectedIndex.set(
      index === 0
        ? this.gallery.length - 1
        : index - 1
    );

  }

  next(): void {

    const index =
      this.selectedIndex();

    if (
      index === null ||
      this.gallery.length <= 1
    ) {
      return;
    }

    this.selectedIndex.set(
      (index + 1) %
      this.gallery.length
    );

  }

  /*==========================================================
  KEYBOARD
  ==========================================================*/

  @HostListener(
    'document:keydown.escape'
  )
  onEscape(): void {

    if (
      this.selectedIndex() !== null
    ) {

      this.closeItem();

    }

  }

  @HostListener(
    'document:keydown.arrowleft'
  )
  onArrowLeft(): void {

    if (
      this.selectedIndex() !== null
    ) {

      this.previous();

    }

  }

  @HostListener(
    'document:keydown.arrowright'
  )
  onArrowRight(): void {

    if (
      this.selectedIndex() !== null
    ) {

      this.next();

    }

  }

}