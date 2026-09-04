import {
  Component,
  ContentChildren,
  DoCheck,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  QueryList,
  SimpleChanges
} from '@angular/core';

import {
  AdminSaveBarMetaDirective
} from './directives/admin-save-bar-meta.directive';

export type AdminSaveBarState =
  | 'clean'
  | 'dirty'
  | 'saving'
  | 'saved'
  | 'error';

@Component({
  selector: 'admin-save-bar',
  standalone: true,
  templateUrl: './admin-save-bar.html',
  styleUrl: './admin-save-bar.scss',
  host: {
    '[attr.state]': 'state',
    '[attr.sticky]': 'sticky ? "" : null',
    '[attr.disabled]': 'disabled ? "" : null'
  }
})
export class AdminSaveBar implements OnChanges, DoCheck {

  @Input()
  state: AdminSaveBarState = 'clean';

  @Input()
  message?: string;

  @Input()
  saveLabel = 'Guardar cambios';

  @Input()
  discardLabel = 'Descartar';

  @Input()
  sticky = true;

  @Input()
  disabled = false;

  @Input()
  showDiscard = true;

  @Input({ required: true })
  model: unknown;

  private originalSnapshot = '';

private originalModel: any;

  @Output()
  readonly save = new EventEmitter<void>();

  @Output()
  readonly discard = new EventEmitter<void>();

  @ContentChildren(AdminSaveBarMetaDirective)
  readonly metadata!: QueryList<AdminSaveBarMetaDirective>;

ngOnChanges(changes: SimpleChanges): void {

    if (changes['model']) {

        const firstTime = changes['model'].firstChange;

        this.originalModel =
            structuredClone(this.model);

        this.originalSnapshot =
            this.serialize(this.model);

        if (!firstTime) {

            this.state = 'saved';

            setTimeout(() => {

                this.state = 'clean';

            }, 1200);

        } else {

            this.state = 'clean';

        }

    }

}


  ngDoCheck(): void {

    if (
      this.state === 'saving'
    ) {
      return;
    }

    const current =
      this.serialize(this.model);

    this.state =
      current === this.originalSnapshot
        ? 'clean'
        : 'dirty';

  }

  onSave(): void {

    if (
      this.disabled ||
      this.state === 'saving' ||
      this.state === 'clean'
    ) {

      return;

    }

    this.save.emit();

  }

onDiscard(): void {

  if (
    this.disabled ||
    this.state === 'saving' ||
    this.state === 'clean'
  ) {
    return;
  }

  Object.assign(
    this.model as object,
    structuredClone(this.originalModel)
  );

  this.state = 'clean';

  this.discard.emit();

}




  private serialize(value: unknown): string {

    return JSON.stringify(value);

}

  get resolvedMessage(): string {

    if (this.message) {

      return this.message;

    }

    switch (this.state) {

      case 'dirty':

        return 'Tenés cambios sin guardar';

      case 'saving':

        return 'Guardando cambios...';

      case 'saved':

        return 'Los cambios fueron guardados';

      case 'error':

        return 'No pudimos guardar los cambios';

      default:

        return 'No hay cambios pendientes';

    }

  }

}