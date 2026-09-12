import { Component } from '@angular/core';
import { NoteListItemComponent } from '../note-list-item/note-list-item.component';

@Component({
  selector: 'app-note-list',
  imports: [NoteListItemComponent],
  templateUrl: './note-list.component.html',
  styleUrl: './note-list.component.css',
})
export class NoteListComponent {}
