import {
  Component,
  forwardRef,
  Input
} from '@angular/core';

import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

@Component({
  selector: 'admin-switch',
  standalone: true,
  templateUrl: './admin-switch.html',
  styleUrl: './admin-switch.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(
        () => AdminSwitch
      ),
      multi: true
    }
  ],
  host: {
    '[attr.disabled]': 'disabled ? "" : null'
  }
})
export class AdminSwitch
  implements ControlValueAccessor {

  @Input()
  label?: string;

  @Input()
  disabled = false;

  value = false;

  private onChange =
    (_: boolean) => {};

  private onTouched =
    () => {};

  writeValue(
    value: boolean | null
  ): void {

    this.value = !!value;

  }

  registerOnChange(fn: any): void {

    this.onChange = fn;

  }

  registerOnTouched(fn: any): void {

    this.onTouched = fn;

  }

  setDisabledState(
    disabled: boolean
  ): void {

    this.disabled = disabled;

  }

  toggle(): void {

    if (this.disabled) {

      return;

    }

    this.value = !this.value;

    this.onChange(this.value);

    this.onTouched();

  }

}