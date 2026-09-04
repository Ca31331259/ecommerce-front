import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output
} from '@angular/core';

export type AdminButtonVariant =
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'success'
    | 'danger';

export type AdminButtonSize =
    | 'sm'
    | 'md'
    | 'lg';

@Component({
    selector: 'admin-button',
    standalone: true,
    templateUrl: './admin-button.html',
    styleUrl: './admin-button.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminButton {

    @Input()
    variant: AdminButtonVariant = 'primary';

    @Input()
    size: AdminButtonSize = 'md';

    @Input()
    icon?: string;

    @Input()
iconOnly = false;

    @Input()
    type: 'button' | 'submit' | 'reset' = 'button';
    
@Input()
loadingText?: string;

    @Input()
    loading = false;

    @Input()
    disabled = false;

    @Input()
    fullWidth = false;

    @Output()
    readonly clicked = new EventEmitter<void>();


    @HostBinding('attr.icon-only')
get hostIconOnly(): '' | null {

    return this.iconOnly
        ? ''
        : null;

}


    @HostBinding('attr.variant')
    get hostVariant(): string {

        return this.variant;

    }

    @HostBinding('attr.size')
    get hostSize(): string {

        return this.size;

    }

    @HostBinding('attr.full-width')
    get hostFullWidth(): '' | null {

        return this.fullWidth
            ? ''
            : null;

    }

    protected onClick(): void {

        if (this.loading || this.disabled) {

            return;

        }

        this.clicked.emit();

    }

}