import {
  Component,
  forwardRef
} from '@angular/core';

import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { FEATURE_ICONS } from '@shared/icons/feature-icons';

export interface AdminIconOption {

  value: string;

  icon: string;

  label: string;

}

@Component({
  selector: 'admin-icon-picker',
  standalone: true,
  templateUrl: './admin-icon-picker.html',
  styleUrl: './admin-icon-picker.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(
        () => AdminIconPicker
      ),
      multi: true
    }
  ]
})
export class AdminIconPicker
  implements ControlValueAccessor {

  readonly icons = FEATURE_ICONS;

  value?: string;

  disabled = false;

  private onChange =
    (_: string) => { };

  private onTouched =
    () => { };

  writeValue(
    value: string | null
  ): void {

    this.value =
      value ?? undefined;

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

  select(
    value: string
  ): void {

    if (this.disabled) {

      return;

    }

    this.value = value;

    this.onChange(value);

    this.onTouched();

  }

  isSelected(
    value: string
  ): boolean {

    return this.value === value;

  }

}