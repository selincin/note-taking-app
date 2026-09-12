import { Routes } from '@angular/router';
import { AllNotes } from './pages/all-notes/all-notes';
import { ArchivedNotes } from '../app/pages/archived-notes/archived-notes';

export const routes: Routes = [
  { path: '', redirectTo: 'notes', pathMatch: 'full' },
  { path: 'notes', component: AllNotes ,  data: { title: 'All Notes' } },
  { path: 'archived', component: ArchivedNotes, data: { title: 'Archived Notes' } },
];