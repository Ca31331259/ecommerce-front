import {
  Directive,
  HostBinding,
  Input
} from '@angular/core';

export type AdminInfoItemAlign =
  | 'start'
  | 'center'
  | 'end';

@Directive({
  selector: '[adminInfoItem]',
  standalone: true
})
export class AdminInfoItem {

  @Input()
  align: AdminInfoItemAlign = 'center';

  @HostBinding('attr.admin-info-item')
  readonly hostAdminInfoItem = '';

  @HostBinding('attr.align')
  get hostAlign(): AdminInfoItemAlign {

    return this.align;

  }

}