import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuditLog } from '../models/audit-log.model';
import { CreateAuditLogRequest } from '../models/create-audit-log-request.model';

@Injectable({
    providedIn: 'root'
})
export class AuditLogService {
    private apiUrl = '/api/auditlogs';

    constructor(private http: HttpClient) { }

    getAllLogs(): Observable<AuditLog[]> {
        return this.http.get<AuditLog[]>(this.apiUrl).pipe(
            catchError(this.handleError)
        );
    }

    createLog(request: CreateAuditLogRequest): Observable<AuditLog> {
        return this.http.post<AuditLog>(this.apiUrl, request).pipe(
            catchError(this.handleError)
        );
    }

    getLogById(id: number): Observable<AuditLog> {
        return this.http.get<AuditLog>(`${this.apiUrl}/${id}`).pipe(
            catchError(this.handleError)
        );
    }

    getLogsByEntityId(entityId: string): Observable<AuditLog[]> {
        return this.http.get<AuditLog[]>(`${this.apiUrl}/entity/${entityId}`).pipe(
            catchError(this.handleError)
        );
    }

    getLogsByUserId(userId: string): Observable<AuditLog[]> {
        return this.http.get<AuditLog[]>(`${this.apiUrl}/user/${userId}`).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse) {
        console.error('API Error:', error);
        let errorMessage = 'An error occurred';

        if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = `Client Error: ${error.error.message}`;
        } else {
            // Server-side error
            errorMessage = `Server Error (${error.status}): ${error.message}`;
        }

        return throwError(() => new Error(errorMessage));
    }
}
