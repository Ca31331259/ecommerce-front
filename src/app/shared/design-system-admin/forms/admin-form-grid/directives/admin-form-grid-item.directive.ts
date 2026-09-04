import {
  Directive,
  Input
} from '@angular/core';

export type AdminFormGridItemSpan =
  | '1'
  | '2'
  | '3'
  | '4'
  | 'full';

@Directive({
  selector: '[adminFormGridItem]',
  standalone: true,
  host: {
    '[attr.span]': 'span'
  }
})
export class AdminFormGridItemDirective {

  @Input()
  span: AdminFormGridItemSpan = '1';

}