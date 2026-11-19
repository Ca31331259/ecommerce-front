import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

export interface AdminTabDefinition {

  id: string;

  label: string;

  icon?: string;

}

@Component({
  selector: 'admin-tabs',
  standalone: true,
  templateUrl: './admin-tabs.html',
  styleUrl: './admin-tabs.scss'
})
export class AdminTabs {

  @Input({ required: true })
  tabs: AdminTabDefinition[] = [];

  @Input()
  activeTab = '';

  @Output()
  readonly activeTabChange =
    new EventEmitter<string>();

  selectTab(id: string): void {

    if (id === this.activeTab) {

      return;

    }

    this.activeTab = id;

    this.activeTabChange.emit(id);

  }

}
