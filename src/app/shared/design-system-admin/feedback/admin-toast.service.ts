import { Injectable, signal } from '@angular/core';
import { AdminToast } from './admin-toast/admin-toast.model';


@Injectable({
    providedIn: 'root'
})
export class AdminToastService {

    readonly toasts = signal<AdminToast[]>([]);

    private nextId = 1;

    success(message: string): void {

        this.show('success', message);

    }

    error(message: string): void {

        this.show('error', message);

    }

    warning(message: string): void {

        this.show('warning', message);

    }

    info(message: string): void {

        this.show('info', message);

    }

    remove(id: number): void {

        this.toasts.update(list =>
            list.filter(t => t.id !== id)
        );

    }

    private show(
        type: AdminToast['type'],
        message: string,
        duration = 3500
    ): void {

        const toast: AdminToast = {

            id: this.nextId++,

            type,

            message,

            duration

        };

        this.toasts.update(list => [...list, toast]);

        setTimeout(() => {

            this.remove(toast.id);

        }, duration);

    }

}