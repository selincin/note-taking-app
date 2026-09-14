import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import { Note } from '../../models/note.model';
import { RelativeDatePipe } from '../../pipes/relative-date-pipe';

@Component({
  selector: 'app-note-list-item',
  imports: [MatChipsModule, RouterModule, RelativeDatePipe, MatIconModule],
  templateUrl: './note-list-item.component.html',
  styleUrl: './note-list-item.component.css',
})
export class NoteListItemComponent {
  public note = input.required<Note>();

  public getNoteRoute(): string[] {
    return ['/notes', this.note().id];
  }
}
