import { Component, inject } from "@angular/core";
import { AdminToastService } from "../admin-toast.service";

@Component({
    selector: 'admin-toast',
    standalone: true,
    templateUrl: './admin-toast.html',
    styleUrl: './admin-toast.scss'
})
export class AdminToast {

    protected readonly service =
        inject(AdminToastService);

    protected readonly toasts =
        this.service.toasts;

    protected remove(id: number): void {

        this.service.remove(id);

    }

}