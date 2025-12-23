import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditLogFormComponent } from '../components/audit-log-form/audit-log-form.component';
import { AuditLogListComponent } from '../components/audit-log-list/audit-log-list.component';

@Component({
    selector: 'app-audit-page',
    standalone: true,
    imports: [CommonModule, AuditLogFormComponent, AuditLogListComponent],
    template: `
    <div class="service-section">
      <div class="section-header">
        <h2>🔒 Audit Service</h2>
      </div>
      <section class="form-section">
        <app-audit-log-form (logCreated)="onLogCreated()"></app-audit-log-form>
      </section>

      <section class="list-section">
        <app-audit-log-list></app-audit-log-list>
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
export class AuditPageComponent {
    @ViewChild(AuditLogListComponent) listComponent!: AuditLogListComponent;

    onLogCreated(): void {
        if (this.listComponent) {
            this.listComponent.refresh();
        }
    }
}
