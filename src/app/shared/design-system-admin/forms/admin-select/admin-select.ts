import {
    Component,
    forwardRef,
    Input
} from '@angular/core';

import {
    CommonModule
} from '@angular/common';

import {
    ControlValueAccessor,
    NG_VALUE_ACCESSOR
} from '@angular/forms';

export interface AdminSelectOption<T = any> {

    value: T;

    label: string;

}

export type AdminSelectSize =
    | 'sm'
    | 'md'
    | 'lg';

@Component({
    selector: 'admin-select',
    standalone: true,
    imports: [
        CommonModule
    ],
    templateUrl: './admin-select.html',
    styleUrl: './admin-select.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(
                () => AdminSelect
            ),
            multi: true
        }
    ],
    host: {
        '[attr.size]': 'size',
        '[attr.disabled]': 'disabled ? "" : null'
    }
})
export class AdminSelect
    implements ControlValueAccessor {

    @Input()
    options: ReadonlyArray<AdminSelectOption> = [];

    value: unknown = null;

    @Input()
    placeholder = 'Seleccionar...';

    @Input()
    allowEmpty = false;

    @Input()
    size: AdminSelectSize = 'md';

    //value: any = null;

    disabled = false;

    private onChange =
        (_: any) => { };

    private onTouched =
        () => { };

    writeValue(
        value: any
    ): void {

        this.value = value;

    }

    registerOnChange(
        fn: any
    ): void {

        this.onChange = fn;

    }

    registerOnTouched(
        fn: any
    ): void {

        this.onTouched = fn;

    }

    setDisabledState(
        disabled: boolean
    ): void {

        this.disabled = disabled;

    }

    onSelectionChange(event: Event): void {

        const index = (event.target as HTMLSelectElement).selectedIndex;

        if (this.allowEmpty) {

            if (index === 0) {

                this.value = null;

                this.onChange(null);

                return;

            }

        }

        const option =
            this.options[
            this.allowEmpty
                ? index - 1
                : index
            ];

        this.value = option.value;

        this.onChange(option.value);

    }

    onBlur(): void {

        this.onTouched();

    }

}