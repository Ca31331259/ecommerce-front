import {
    Component,
    EventEmitter,
    Input,
    Output
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-expired-password-form',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule
    ],
    templateUrl: './expired-password-form.html',
    styleUrl: './expired-password-form.scss'
})
export class ExpiredPasswordForm {

    @Input()
    loading = false;

    @Output()
    changePassword = new EventEmitter<{
        newPassword: string;
    }>();

    password = '';

    confirmPassword = '';

    /* ==========================================================
     * PASSWORD VALIDATION
     * ========================================================== */

    get hasMinLength(): boolean {

        return this.password.length >= 8;

    }

    get hasUpperCase(): boolean {

        return /[A-Z]/.test(this.password);

    }

    get hasLowerCase(): boolean {

        return /[a-z]/.test(this.password);

    }

    get hasNumber(): boolean {

        return /\d/.test(this.password);

    }

    get hasSpecialCharacter(): boolean {

        return /[^A-Za-z0-9]/.test(this.password);

    }

    get passwordsMatch(): boolean {

        return this.password === this.confirmPassword
            && this.confirmPassword.length > 0;

    }

    get passwordValid(): boolean {

        return this.hasMinLength
            && this.hasUpperCase
            && this.hasLowerCase
            && this.hasNumber
            && this.hasSpecialCharacter;

    }

    get canSubmit(): boolean {

        return this.passwordValid
            && this.passwordsMatch
            && !this.loading;

    }

    submit(): void {

        if (!this.canSubmit) {
            return;
        }

        this.changePassword.emit({

            newPassword: this.password

        });

    }

}