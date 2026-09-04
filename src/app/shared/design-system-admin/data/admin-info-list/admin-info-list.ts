import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input
} from '@angular/core';

export type AdminInfoListVariant =
  | 'default'
  | 'compact';

export type AdminInfoListDividers =
  | 'none'
  | 'rows';

@Component({
  selector: 'admin-info-list',
  standalone: true,
  templateUrl: './admin-info-list.html',
  styleUrl: './admin-info-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminInfoList {

  @Input()
  variant: AdminInfoListVariant = 'default';

  @Input()
  dividers: AdminInfoListDividers = 'rows';

  @HostBinding('attr.variant')
  get hostVariant(): AdminInfoListVariant {

    return this.variant;

  }

  @HostBinding('attr.dividers')
  get hostDividers(): AdminInfoListDividers {

    return this.dividers;

  }

}