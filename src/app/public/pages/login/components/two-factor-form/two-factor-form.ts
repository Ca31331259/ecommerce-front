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
import { OtpInputComponent } from '@shared/components/otp-input/otp-input';

@Component({
    selector: 'app-two-factor-form',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        OtpInputComponent
    ],
    templateUrl: './two-factor-form.html',
    styleUrl: './two-factor-form.scss'
})
export class TwoFactorForm {

    @Input()
    loading = false;

    @Output()
    verify = new EventEmitter<string>();

    @Output()
    cancel = new EventEmitter<void>();

    code = '';

    submit(): void {

        if (this.code.length !== 6) {
            return;
        }

        this.verify.emit(this.code);

    }

}