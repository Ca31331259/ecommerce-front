import {
  Directive,
  HostBinding,
  Input
} from '@angular/core';

export type AdminTextareaSize =
  | 'sm'
  | 'md'
  | 'lg';

@Directive({
  selector: 'textarea[adminTextarea]',
  standalone: true
})
export class AdminTextareaDirective {

  @Input()
  size: AdminTextareaSize = 'md';

  @HostBinding('class.admin-textarea')
  readonly cssClass = true;

  @HostBinding('attr.admin-size')
  get hostSize(): string {

    return this.size;

  }

}