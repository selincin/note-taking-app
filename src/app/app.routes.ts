import { Routes } from '@angular/router';
import { Notes } from '../app/pages/notes/notes';
import { ArchivedNotes } from '../app/pages/archived-notes/archived-notes';

export const routes: Routes = [
  { path: '', redirectTo: 'notes', pathMatch: 'full' },
  { path: 'notes', component: Notes },
  { path: 'archived', component: ArchivedNotes},
];