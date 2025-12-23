import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataEntryService } from '../../services/data-entry.service';
import { DataEntry } from '../../models/data-entry.model';

@Component({
    selector: 'app-data-entry-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './data-entry-list.component.html',
    styleUrls: ['./data-entry-list.component.css']
})
export class DataEntryListComponent implements OnInit {
    entries: DataEntry[] = [];
    isLoading = false;
    errorMessage = '';

    constructor(
        private dataEntryService: DataEntryService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.loadEntries();
    }

    loadEntries(): void {
        this.isLoading = true;
        this.errorMessage = '';

        this.dataEntryService.getAllEntries().subscribe({
            next: (data) => {
                this.entries = data;
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (error) => {
                console.error('Error loading data entries:', error);
                this.errorMessage = error.message || 'Failed to load data entries. Please try again.';
                this.isLoading = false;
                this.entries = [];
                this.cdr.detectChanges();
            }
        });
    }

    refresh(): void {
        this.loadEntries();
    }

    formatDate(date: Date): string {
        return new Date(date).toLocaleString();
    }
}
