import { Component, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-empty-note-state',
  standalone: true,
  imports: [MatButton, MatIcon],
  templateUrl: './empty-note-state.component.html',
  styleUrl: './empty-note-state.component.css',
})
export class EmptyNoteStateComponent {
  iconPath = 'assets/logos/notes-icon.svg';
  showStickyNote = input<boolean>(true);
}
