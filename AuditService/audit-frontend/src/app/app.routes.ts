import { Routes } from '@angular/router';
import { AuditPageComponent } from './pages/audit-page.component';
import { DataEntryPageComponent } from './pages/data-entry-page.component';

export const routes: Routes = [
    { path: '', redirectTo: '/audit', pathMatch: 'full' },
    { path: 'audit', component: AuditPageComponent },
    { path: 'data-entry', component: DataEntryPageComponent }
];
