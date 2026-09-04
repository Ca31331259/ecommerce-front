import {
  Component,
  Input
} from '@angular/core';

export type AdminFormGridColumns =
  | '1'
  | '2'
  | '3'
  | '4';

export type AdminFormGridGap =
  | 'sm'
  | 'md'
  | 'lg';

@Component({
  selector: 'admin-form-grid',
  standalone: true,
  templateUrl: './admin-form-grid.html',
  styleUrl: './admin-form-grid.scss',
  host: {
    '[attr.columns]': 'columns',
    '[attr.gap]': 'gap'
  }
})
export class AdminFormGrid {

  @Input()
  columns: AdminFormGridColumns = '2';

  @Input()
  gap: AdminFormGridGap = 'md';

}