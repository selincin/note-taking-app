import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { toSignal } from '@angular/core/rxjs-interop';

import { LayoutService } from '../../services/layout.service';
import { NotesService } from '../../services/notes.service';
import { NoteListComponent } from '../../component/note-list/note-list.component';
import { filter, map, startWith } from 'rxjs/operators';


@Component({
  selector: 'app-all-notes',
  standalone: true,
  imports: [NoteListComponent, MatIconModule, MatDividerModule, MatButtonModule, CommonModule, RouterModule],
  templateUrl: './all-notes.page.html',
  styleUrl: './all-notes.page.css',
})
export class AllNotes {
  private layoutService = inject(LayoutService);
  private notesService = inject(NotesService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  public notes = this.notesService.notes;
  public loading = this.notesService.loading;
  public isHandset$ = this.layoutService.isHandset$;
  public isTablet$ = this.layoutService.isTablet$;
  public isDesktop$ = this.layoutService.isDesktop$;

  // signal that tracks whether a child route (a selected note) is currently active
  public hasSelectedNote = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute.firstChild != null),
      startWith(this.activatedRoute.firstChild != null)
    ),
    { initialValue: false }
  );

  public ngOnInit(): void {
    this.notesService.getNotes();
  }

  public goBack(): void {
    this.router.navigate(['/notes']);
  }
}

