import {
    Component,
    Input
} from '@angular/core';

import {
    CommonModule
} from '@angular/common';

@Component({
    selector: 'admin-form-preview',
    standalone: true,
    imports: [
        CommonModule
    ],
    templateUrl: './admin-form-preview.html',
    styleUrl: './admin-form-preview.scss'
})
export class AdminFormPreview {

    @Input({ required: true })
    title!: string;

    @Input()
    description = '';

    @Input({ required: true })
    image!: string;

    @Input()
    badge?: string;

    @Input()
    collapsible = true;

    @Input()
    expanded = false;


    togglePreview(event?: Event): void {

        event?.stopPropagation();

        this.expanded = !this.expanded;

    }

}