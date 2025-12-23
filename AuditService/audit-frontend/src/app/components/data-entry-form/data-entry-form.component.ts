import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DataEntryService } from '../../services/data-entry.service';
import { CreateDataEntryRequest } from '../../models/create-data-entry-request.model';

@Component({
    selector: 'app-data-entry-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './data-entry-form.component.html',
    styleUrls: ['./data-entry-form.component.css']
})
export class DataEntryFormComponent {
    @Output() entryCreated = new EventEmitter<void>();

    entryForm: FormGroup;
    isSubmitting = false;
    successMessage = '';
    errorMessage = '';

    constructor(
        private fb: FormBuilder,
        private dataEntryService: DataEntryService
    ) {
        this.entryForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            description: ['']
        });
    }

    onSubmit(): void {
        if (this.entryForm.invalid) {
            this.entryForm.markAllAsTouched();
            return;
        }

        this.isSubmitting = true;
        this.successMessage = '';
        this.errorMessage = '';

        const request: CreateDataEntryRequest = this.entryForm.value;

        this.dataEntryService.createEntry(request).subscribe({
            next: (response) => {
                this.successMessage = 'Data entry created successfully!';
                this.entryForm.reset();
                this.isSubmitting = false;
                this.entryCreated.emit();

                setTimeout(() => {
                    this.successMessage = '';
                }, 3000);
            },
            error: (error) => {
                this.errorMessage = error.message || 'Failed to create data entry. Please try again.';
                this.isSubmitting = false;
            }
        });
    }

    getFieldError(fieldName: string): string {
        const field = this.entryForm.get(fieldName);
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
            name: 'Name',
            description: 'Description'
        };
        return labels[fieldName] || fieldName;
    }
}
