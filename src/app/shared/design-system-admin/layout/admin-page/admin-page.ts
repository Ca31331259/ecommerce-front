import {
  Component,
  Input
} from '@angular/core';

export type AdminPageWidth =
  | 'md'
  | 'lg'
  | 'xl'
  | 'full';

@Component({
  selector: 'admin-page',
  standalone: true,
  templateUrl: './admin-page.html',
  styleUrl: './admin-page.scss',
  host: {
    '[attr.width]': 'width',
    '[attr.padded]': 'padded ? "" : null'
  }
})
export class AdminPage {

  @Input()
  width: AdminPageWidth = 'xl';

  @Input()
  padded = true;

}