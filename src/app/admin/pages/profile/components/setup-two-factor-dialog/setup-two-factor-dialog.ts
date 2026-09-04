import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    inject,
    signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef
} from '@angular/material/dialog';

import {
    AdminButton,
    AdminField
} from '@shared/design-system-admin';

import { finalize } from 'rxjs';

import { ProfileService } from '../../../../../core/services/profile/profile-service';
import { TwoFactorSetup } from '../../../../../core/models/profile/two-factor-setup';
import { OtpInputComponent } from '@shared/components/otp-input/otp-input';

@Component({
    selector: 'app-setup-two-factor-dialog',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatDialogModule,
        AdminButton,
        AdminField,
        OtpInputComponent
    ],
    templateUrl: './setup-two-factor-dialog.html',
    styleUrl: './setup-two-factor-dialog.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SetupTwoFactorDialog
    implements OnInit {

    private readonly profileService =
        inject(ProfileService);

    readonly dialogRef =
        inject(MatDialogRef<SetupTwoFactorDialog>);

    readonly loading =
        signal(true);

    readonly enabling =
        signal(false);

    readonly setup =
        signal<TwoFactorSetup | null>(null);

    code = '';

    ngOnInit(): void {

        this.profileService
            .setupTwoFactor()
            .pipe(
                finalize(() => {

                    this.loading.set(false);

                })
            )
            .subscribe(setup => {

                this.setup.set(setup);

            });

    }

    activate(): void {

        if (!this.code.trim()) {

            return;

        }

        this.enabling.set(true);

        this.profileService
            .enableTwoFactor({
                code: this.code
            })
            .pipe(
                finalize(() => {

                    this.enabling.set(false);

                })
            )
            .subscribe(() => {

                this.dialogRef.close(true);

            });

    }

    close(): void {

        this.dialogRef.close(false);

    }

}