import { Component, input, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { TranslatePipe } from '@ngx-translate/core';

import { NavItem } from '../../models/nav-item.model';
import { NotesService } from '../../services/notes.service';
import { NoteListComponent } from '../../component/note-list/note-list.component';


@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [RouterModule, MatListModule, MatIconModule, MatChipsModule, NoteListComponent, TranslatePipe],
  templateUrl: './tags.page.html',
  styleUrl: './tags.page.css',
})
export class TagsPage {
  private router = inject(Router);
  public notesService = inject(NotesService);
  public items = input.required<NavItem[]>();

  ngOnInit() {
    if (this.notesService.notes().length === 0) {
      this.notesService.fetchNotes(false);
    }
  }

  public toggleTag(tagName: string) {
    this.notesService.toggleTagFilter(tagName);
  }

  public onRemove(tagName: string, event: Event) {
    event.stopPropagation();
    this.notesService.toggleTagFilter(tagName);
  }
}
