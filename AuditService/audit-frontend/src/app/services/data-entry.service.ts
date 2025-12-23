import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DataEntry } from '../models/data-entry.model';
import { CreateDataEntryRequest } from '../models/create-data-entry-request.model';

@Injectable({
    providedIn: 'root'
})
export class DataEntryService {
    private apiUrl = '/api/dataentries';

    constructor(private http: HttpClient) { }

    getAllEntries(): Observable<DataEntry[]> {
        return this.http.get<DataEntry[]>(this.apiUrl).pipe(
            catchError(this.handleError)
        );
    }

    createEntry(request: CreateDataEntryRequest): Observable<DataEntry> {
        return this.http.post<DataEntry>(this.apiUrl, request).pipe(
            catchError(this.handleError)
        );
    }

    getEntryById(id: number): Observable<DataEntry> {
        return this.http.get<DataEntry>(`${this.apiUrl}/${id}`).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse) {
        console.error('API Error:', error);
        let errorMessage = 'An error occurred';

        if (error.error instanceof ErrorEvent) {
            errorMessage = `Client Error: ${error.error.message}`;
        } else {
            errorMessage = `Server Error (${error.status}): ${error.message}`;
        }

        return throwError(() => new Error(errorMessage));
    }
}
