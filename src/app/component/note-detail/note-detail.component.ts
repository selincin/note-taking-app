import { Component, inject, signal } from '@angular/core';
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
  constructor(
    private route: ActivatedRoute,
    private notesService: NotesService,
    private router: Router,
    private location: Location
  ) { }

  private paramSub?: Subscription;
  private layoutService = inject(LayoutService);
  
  note = signal<Note | undefined>(undefined);
  loading = signal(true);
  isDesktop$ = this.layoutService.isDesktop$;

  ngOnInit() {
    this.paramSub = this.route.paramMap.subscribe(async (params) => {
      const id = params.get('id');

      if (!id) {
        this.loading.set(false);
        return;
      }

      this.loading.set(true);
      const result = await this.notesService.getNoteById(id);
      this.note.set(result);
      this.loading.set(false);
    });
  }

  ngOnDestroy() {
    this.paramSub?.unsubscribe();
  }

  public toggleArchive(note: Note) {
    this.notesService.toggleArchive(note);
    if(note.archived) {
      this.router.navigate(['/notes']);
    } else {
      this.router.navigate(['/archived']);
    }
  }

  public goBack(): void {
    this.location.back();
  }

  public onEdit() {
    // deine Logik, z.B. Navigation zur Edit-Ansicht
  }

  public onDelete(note: Note) {
    this.notesService.deleteNote(note.id);
    this.router.navigate(['/notes']);
  }
}
