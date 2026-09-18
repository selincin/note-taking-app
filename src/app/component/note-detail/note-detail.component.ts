import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';

import { Note } from '../../models/note.model';
import { NotesService } from '../../services/notes.service';
import { RelativeDatePipe } from '../../pipes/relative-date-pipe';
import { LayoutService } from '../../services/layout.service';
import { MatDialog } from '@angular/material/dialog';
import { NotesDialogComponent } from '../dialogs/notes-dialog/notes-dialog.component';

@Component({
  selector: 'app-note-detail',
  imports: [
    CommonModule,
    MatChipsModule,
    MatIconModule,
    RelativeDatePipe,
    MatDividerModule,
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule
  ],
  templateUrl: './note-detail.component.html',
  styleUrl: './note-detail.component.css',
})

export class NoteDetailComponent {
  private route = inject(ActivatedRoute);
  private notesService = inject(NotesService);
  private router = inject(Router);
  private location = inject(Location);
  private paramSub?: Subscription;
  private layoutService = inject(LayoutService);
  private currentId = signal<string | undefined>(undefined);
  public note = computed(() =>
    this.notesService.notes().find(n => n.id === this.currentId())
  );
  public loading = signal(true);
  public readonly dialog = inject(MatDialog);
  public isDesktop$ = this.layoutService.isDesktop$;


  ngOnInit() {
    this.paramSub = this.route.paramMap.subscribe(async (params) => {
      const id = params.get('id');

      if (!id) {
        this.loading.set(false);
        return;
      }

      this.currentId.set(id);

      if (!this.notesService.notes().some(n => n.id === id)) {
        await this.notesService.getNoteById(id);
      }

      this.loading.set(false);
    });
  }

  ngOnDestroy() {
    this.paramSub?.unsubscribe();
  }

  public toggleArchive(note: Note) {
    this.notesService.toggleArchive(note);
    if (note.archived) {
      this.router.navigate(['/archived']);
    } else {
      this.router.navigate(['/notes']);
    }
  }

  public goBack(): void {
    this.location.back();
  }

  public onDelete(note: Note) {
    this.notesService.deleteNote(note.id);
    this.router.navigate(['/notes']);
  }

  // edit and create new note
  public openDialog(note?: Note) {
    const dialogRef = this.dialog.open(NotesDialogComponent, {
      data: { note }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
      }
    });
  }
}
