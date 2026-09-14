import { Routes } from '@angular/router';
import { AllNotes } from './pages/all-notes/all-notes.page';
import { ArchivedNotes } from './pages/archived-notes/archived-notes.page';
import { NoteDetailComponent } from './component/note-detail/note-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: 'notes', pathMatch: 'full' },
    {
    path: 'notes',
    component: AllNotes,
    data: { title: 'All notes' },
    children: [
      { path: ':id', 
        component: NoteDetailComponent,
      },
    ],
  },
  { path: 'archived', component: ArchivedNotes, data: { title: 'Archived Notes' } },
];