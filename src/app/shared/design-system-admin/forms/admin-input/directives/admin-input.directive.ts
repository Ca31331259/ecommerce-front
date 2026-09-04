import {
  Directive,
  HostBinding,
  Input
} from '@angular/core';

export type AdminInputSize =
  | 'sm'
  | 'md'
  | 'lg';

@Directive({
  selector: `
    input[adminInput],
    input[adminInput][type="text"],
    input[adminInput][type="email"],
    input[adminInput][type="number"],
    input[adminInput][type="url"],
    input[adminInput][type="password"]
  `,
  standalone: true
})
export class AdminInputDirective {

  @Input()
  size: AdminInputSize = 'md';

  @HostBinding('class.admin-input')
  readonly cssClass = true;

  @HostBinding('attr.size')
  get hostSize(): string {

    return this.size;

  }

}