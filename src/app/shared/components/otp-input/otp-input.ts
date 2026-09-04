import {
    AfterViewInit,
    Component,
    ElementRef,
    forwardRef,
    QueryList,
    ViewChildren
} from '@angular/core';

import {
    ControlValueAccessor,
    FormsModule,
    NG_VALUE_ACCESSOR
} from '@angular/forms';

import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-otp-input',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule
    ],
    templateUrl: './otp-input.html',
    styleUrl: './otp-input.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => OtpInputComponent),
            multi: true
        }
    ]
})
export class OtpInputComponent
    implements ControlValueAccessor, AfterViewInit {

    @ViewChildren('digit')
    inputs!: QueryList<ElementRef<HTMLInputElement>>;

    digits = ['', '', '', '', '', ''];

    disabled = false;

    private onChange = (_: string) => {};
    private onTouched = () => {};

    ngAfterViewInit(): void {

        queueMicrotask(() => {

            this.focus(0);

        });

    }

    writeValue(value: string | null): void {

        this.digits = ['', '', '', '', '', ''];

        if (!value) {
            return;
        }

        value
            .substring(0, 6)
            .split('')
            .forEach((char, index) => {

                this.digits[index] = char;

            });

    }

    registerOnChange(fn: any): void {

        this.onChange = fn;

    }

    registerOnTouched(fn: any): void {

        this.onTouched = fn;

    }

    setDisabledState(disabled: boolean): void {

        this.disabled = disabled;

    }

    onInput(
        event: Event,
        index: number
    ): void {

        const input = event.target as HTMLInputElement;

        let value = input.value.replace(/\D/g, '');

        if (!value) {

            this.digits[index] = '';

            this.emit();

            return;

        }

        value = value.charAt(0);

        this.digits[index] = value;

        input.value = value;

        if (index < 5) {

            this.focus(index + 1);

        }

        this.emit();

    }

    onKeyDown(
        event: KeyboardEvent,
        index: number
    ): void {

        if (event.key !== 'Backspace') {
            return;
        }

        if (this.digits[index]) {

            this.digits[index] = '';

            this.emit();

            return;

        }

        if (index > 0) {

            this.focus(index - 1);

        }

    }

    onPaste(
        event: ClipboardEvent
    ): void {

        event.preventDefault();

        const text = event.clipboardData
            ?.getData('text')
            .replace(/\D/g, '')
            .substring(0, 6);

        if (!text) {
            return;
        }

        this.digits = ['', '', '', '', '', ''];

        text.split('').forEach((char, index) => {

            this.digits[index] = char;

        });

        this.emit();

        this.focus(
            Math.min(text.length, 5)
        );

    }

    private emit(): void {

        this.onTouched();

        this.onChange(
            this.digits.join('')
        );

    }

    private focus(index: number): void {

        const input =
            this.inputs.get(index);

        input?.nativeElement.focus();

        input?.nativeElement.select();

    }

}