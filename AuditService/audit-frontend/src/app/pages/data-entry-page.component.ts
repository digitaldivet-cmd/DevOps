import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataEntryFormComponent } from '../components/data-entry-form/data-entry-form.component';
import { DataEntryListComponent } from '../components/data-entry-list/data-entry-list.component';

@Component({
    selector: 'app-data-entry-page',
    standalone: true,
    imports: [CommonModule, DataEntryFormComponent, DataEntryListComponent],
    template: `
    <div class="service-section">
      <div class="section-header">
        <h2>📁 Data Entry Service</h2>
      </div>
      <section class="form-section">
        <app-data-entry-form (entryCreated)="onEntryCreated()"></app-data-entry-form>
      </section>

      <section class="list-section">
        <app-data-entry-list></app-data-entry-list>
      </section>
    </div>
  `,
    styles: [`
    .service-section { margin-top: 2rem; }
    .section-header { text-align: center; margin-bottom: 2rem; }
    .section-header h2 { 
      color: white; font-size: 2rem; font-weight: 700; margin: 0;
      text-shadow: 0 2px 10px rgba(0,0,0,0.3);
    }
  `]
})
export class DataEntryPageComponent {
    @ViewChild(DataEntryListComponent) listComponent!: DataEntryListComponent;

    onEntryCreated(): void {
        if (this.listComponent) {
            this.listComponent.refresh();
        }
    }
}
