import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

import { debounceTime, filter, map, startWith } from 'rxjs/operators';

import { LayoutService } from '../../services/layout.service';
import { NotesService } from '../../services/notes.service';
import { NoteListComponent } from '../../component/note-list/note-list.component';
import { EmptyNoteStateComponent } from '../../component/empty-note-state/empty-note-state.component';

@Component({
  selector: 'app-all-notes',
  standalone: true,
  imports: [NoteListComponent, MatIconModule, MatDividerModule, MatButtonModule, CommonModule, RouterModule, EmptyNoteStateComponent],
  templateUrl: './all-notes.page.html',
  styleUrl: './all-notes.page.css',
})
export class AllNotes {
  constructor() {
    toObservable(this.notesService.searchTerm)
      .pipe(
        debounceTime(800),
        filter(term => term.trim().length >= 3)
      )
      .subscribe(term => {
        this.notesService.addRecentSearch(term);
      });
  }

  private layoutService = inject(LayoutService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  
  public notesService = inject(NotesService);
  public archived = input<boolean>(false);
  public notes = this.notesService.filteredNotes;
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
    this.notesService.fetchNotes(false);
  }

  public goBack(): void {
    this.router.navigate(['/notes']);
  }
}

