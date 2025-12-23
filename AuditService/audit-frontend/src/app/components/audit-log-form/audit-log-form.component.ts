import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuditLogService } from '../../services/audit-log.service';
import { CreateAuditLogRequest } from '../../models/create-audit-log-request.model';

@Component({
    selector: 'app-audit-log-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './audit-log-form.component.html',
    styleUrls: ['./audit-log-form.component.css']
})
export class AuditLogFormComponent {
    @Output() logCreated = new EventEmitter<void>();

    auditForm: FormGroup;
    isSubmitting = false;
    successMessage = '';
    errorMessage = '';

    constructor(
        private fb: FormBuilder,
        private auditLogService: AuditLogService
    ) {
        this.auditForm = this.fb.group({
            action: ['', [Validators.required, Validators.minLength(2)]],
            entityType: ['', [Validators.required, Validators.minLength(2)]],
            entityId: ['', Validators.required],
            userId: ['', Validators.required],
            details: ['']
        });
    }

    onSubmit(): void {
        if (this.auditForm.invalid) {
            this.auditForm.markAllAsTouched();
            return;
        }

        this.isSubmitting = true;
        this.successMessage = '';
        this.errorMessage = '';

        const request: CreateAuditLogRequest = this.auditForm.value;

        this.auditLogService.createLog(request).subscribe({
            next: (response) => {
                this.successMessage = 'Audit log created successfully!';
                this.auditForm.reset();
                this.isSubmitting = false;
                this.logCreated.emit();

                // Clear success message after 3 seconds
                setTimeout(() => {
                    this.successMessage = '';
                }, 3000);
            },
            error: (error) => {
                this.errorMessage = 'Failed to create audit log. Please try again.';
                console.error('Error creating audit log:', error);
                this.isSubmitting = false;
            }
        });
    }

    getFieldError(fieldName: string): string {
        const field = this.auditForm.get(fieldName);
        if (field?.touched && field?.errors) {
            if (field.errors['required']) {
                return `${this.getFieldLabel(fieldName)} is required`;
            }
            if (field.errors['minlength']) {
                return `${this.getFieldLabel(fieldName)} must be at least ${field.errors['minlength'].requiredLength} characters`;
            }
        }
        return '';
    }

    private getFieldLabel(fieldName: string): string {
        const labels: { [key: string]: string } = {
            action: 'Action',
            entityType: 'Entity Type',
            entityId: 'Entity ID',
            userId: 'User ID',
            details: 'Details'
        };
        return labels[fieldName] || fieldName;
    }
}
