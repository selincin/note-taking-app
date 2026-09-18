import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { filter, map, startWith } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';

import { NoteListComponent } from '../../component/note-list/note-list.component';
import { EmptyArchivedStateComponent } from '../../component/empty-archived-state/empty-archived-state.component';
import { EmptyNoteStateComponent } from '../../component/empty-note-state/empty-note-state.component';
import { NotesService } from '../../services/notes.service';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-archived-notes',
  standalone: true,
  imports: [NoteListComponent, CommonModule, MatIconModule, MatDividerModule, MatButtonModule, RouterModule, EmptyNoteStateComponent, EmptyArchivedStateComponent, TranslatePipe],
  templateUrl: './archived-notes.page.html',
  styleUrl: './archived-notes.page.css',
})
export class ArchivedNotes {
  private layoutService = inject(LayoutService);
  private notesService = inject(NotesService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  public notes = this.notesService.filteredNotes;
  public loading = this.notesService.loading;
  public isHandset$ = this.layoutService.isHandset$;
  public isDesktop$ = this.layoutService.isDesktop$;

  public ngOnInit(): void {
    this.notesService.getArchivedNotes();
  }

  public hasSelectedNote = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute.firstChild != null),
      startWith(this.activatedRoute.firstChild != null)
    ),
    { initialValue: false }
  );

  public goBack(): void {
    this.router.navigate(['/notes']);
  }


}
