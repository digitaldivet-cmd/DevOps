import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditLogService } from '../../services/audit-log.service';
import { AuditLog } from '../../models/audit-log.model';

@Component({
    selector: 'app-audit-log-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './audit-log-list.component.html',
    styleUrls: ['./audit-log-list.component.css']
})
export class AuditLogListComponent implements OnInit {
    logs: AuditLog[] = [];
    isLoading = false;
    errorMessage = '';

    constructor(
        private auditLogService: AuditLogService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.loadLogs();
    }

    loadLogs(): void {
        this.isLoading = true;
        this.errorMessage = '';

        this.auditLogService.getAllLogs().subscribe({
            next: (data) => {
                this.logs = data;
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (error) => {
                console.error('Error loading audit logs:', error);
                this.errorMessage = error.message || 'Failed to load audit logs. Please try again.';
                this.isLoading = false;
                this.logs = [];
                this.cdr.detectChanges();
            }
        });
    }

    refresh(): void {
        this.loadLogs();
    }

    formatDate(date: Date): string {
        return new Date(date).toLocaleString();
    }
}
