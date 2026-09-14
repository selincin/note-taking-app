import { Component, input } from '@angular/core';
import { Note } from '../../models/note.model';
import { NoteListItemComponent } from '../note-list-item/note-list-item.component';

@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [NoteListItemComponent],
  templateUrl: './note-list.component.html',
  styleUrl: './note-list.component.css',
})
export class NoteListComponent {

  public notes = input.required<Note[]>();

}
