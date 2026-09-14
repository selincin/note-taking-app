import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import { Subscription } from 'rxjs';

import { Note } from '../../models/note.model';
import { NotesService } from '../../services/notes.service';
import { RelativeDatePipe } from '../../pipes/relative-date-pipe';


@Component({
  selector: 'app-note-detail',
  imports: [CommonModule, MatChipsModule, MatIconModule, RelativeDatePipe],
  templateUrl: './note-detail.component.html',
  styleUrl: './note-detail.component.css',
})
export class NoteDetailComponent {
  note = signal<Note | undefined>(undefined);
  loading = signal(true);
  
  private paramSub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private notesService: NotesService
  ) { }

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
}
