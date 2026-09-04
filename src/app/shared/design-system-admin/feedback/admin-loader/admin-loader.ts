import {
  Component,
  Input
} from '@angular/core';

export type AdminLoaderVariant =
  | 'page'
  | 'section'
  | 'inline';

export type AdminLoaderSize =
  | 'sm'
  | 'md'
  | 'lg';

@Component({
  selector: 'admin-loader',
  standalone: true,
  templateUrl: './admin-loader.html',
  styleUrl: './admin-loader.scss',
  host: {
    '[attr.variant]': 'variant',
    '[attr.size]': 'size'
  }
})
export class AdminLoader {

  @Input()
  variant: AdminLoaderVariant = 'section';

  @Input()
  size: AdminLoaderSize = 'md';

  @Input()
  label = 'Cargando...';

  @Input()
  description?: string;

}