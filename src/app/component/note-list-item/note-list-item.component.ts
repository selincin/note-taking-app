import { Component } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-note-list-item',
  imports: [MatChipsModule],
  templateUrl: './note-list-item.component.html',
  styleUrl: './note-list-item.component.css',
})
export class NoteListItemComponent {}
