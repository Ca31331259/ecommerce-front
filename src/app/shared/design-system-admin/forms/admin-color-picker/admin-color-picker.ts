import {
  Component,
  forwardRef,
  Input
} from '@angular/core';

import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

export type AdminColorPickerSize =
  | 'sm'
  | 'md'
  | 'lg';

@Component({
  selector: 'admin-color-picker',
  standalone: true,
  templateUrl: './admin-color-picker.html',
  styleUrl: './admin-color-picker.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(
        () => AdminColorPicker
      ),
      multi: true
    }
  ],
  host: {
    '[attr.size]': 'size',
    '[attr.disabled]': 'disabled ? "" : null'
  }
})
export class AdminColorPicker
  implements ControlValueAccessor {

  @Input()
  size: AdminColorPickerSize = 'md';

  value = '#000000';

  disabled = false;

  private onChange:
    (value: string) => void =
      () => {};

  private onTouched:
    () => void =
      () => {};

  writeValue(
    value: string | null
  ): void {

    this.value =
      this.normalizeColor(value);

  }

  registerOnChange(
    fn: (value: string) => void
  ): void {

    this.onChange = fn;

  }

  registerOnTouched(
    fn: () => void
  ): void {

    this.onTouched = fn;

  }

  setDisabledState(
    disabled: boolean
  ): void {

    this.disabled = disabled;

  }

  onNativeColorChange(
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;

    this.updateValue(
      input.value
    );

  }

  onTextInput(
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;

    this.value =
      input.value.toUpperCase();

    if (
      this.isValidHex(this.value)
    ) {

      this.onChange(this.value);

    }

  }

  onTextBlur(): void {

    this.value =
      this.normalizeColor(this.value);

    this.onChange(this.value);

    this.onTouched();

  }

  onColorBlur(): void {

    this.onTouched();

  }

  private updateValue(
    value: string
  ): void {

    this.value =
      this.normalizeColor(value);

    this.onChange(this.value);

  }

  private normalizeColor(
    value?: string | null
  ): string {

    if (!value) {

      return '#000000';

    }

    let color =
      value
        .trim()
        .toUpperCase();

    if (
      !color.startsWith('#')
    ) {

      color = `#${color}`;

    }

    if (
      this.isValidHex(color)
    ) {

      return color;

    }

    return '#000000';

  }

  private isValidHex(
    value: string
  ): boolean {

    return /^#[0-9A-F]{6}$/i
      .test(value);

  }

}