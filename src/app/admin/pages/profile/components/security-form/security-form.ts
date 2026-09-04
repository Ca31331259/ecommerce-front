import {
    Component,
    EventEmitter,
    Input,
    Output,
    inject
} from '@angular/core';

import { UserProfile } from '../../../../../core/models/profile/user-profile';
import { ProfileService } from '../../../../../core/services/profile/profile-service';

import {
    AdminButton,
    AdminFormCard,
    AdminFormCardFooterDirective,
    AdminInputDirective
} from '@shared/design-system-admin';

import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { SetupTwoFactorDialog } from '../setup-two-factor-dialog/setup-two-factor-dialog';



@Component({
    selector: 'app-security-form',
    standalone: true,
    imports: [
        CommonModule,
        AdminFormCard,
        AdminButton,
        AdminFormCardFooterDirective,
    ],
    templateUrl: './security-form.html',
    styleUrl: './security-form.scss'
})
export class SecurityForm {

    @Input({ required: true })
    profile!: UserProfile;

    @Input()
    saving = false;

    @Output()
    refresh = new EventEmitter<void>();

    private readonly dialog =
        inject(MatDialog);

    private readonly profileService =
        inject(ProfileService);

    configure(): void {

        const dialog = this.dialog.open(
            SetupTwoFactorDialog,
            {
                width: '650px',
                disableClose: true
            }
        );

        dialog.afterClosed().subscribe(success => {

            if (success) {

                this.refresh.emit();

            }

        });

    }

    disable(): void {

        if (!confirm(
            '¿Desea desactivar la autenticación en dos factores?'
        )) {

            return;

        }

        this.profileService
            .disableTwoFactor()
            .subscribe(() => {

                this.refresh.emit();

            });

    }

}