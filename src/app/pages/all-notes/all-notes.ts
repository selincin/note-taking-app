import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteListComponent } from '../../component/note-list/note-list.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-all-notes',
  standalone: true,
  imports: [NoteListComponent, MatIconModule, MatDividerModule, MatButtonModule, CommonModule],
  templateUrl: './all-notes.html',
  styleUrl: './all-notes.css',
})
export class AllNotes {
  private layoutService = inject(LayoutService);

  isHandset$ = this.layoutService.isHandset$;

}
