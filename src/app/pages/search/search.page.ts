import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { NotesService } from '../../services/notes.service';
import { NoteListComponent } from '../../component/note-list/note-list.component';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, filter } from 'rxjs';

@Component({
  selector: 'app-search',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    NoteListComponent
  ],
  templateUrl: './search.page.html',
  styleUrl: './search.page.css',
})
export class SearchPage {
  constructor() {
    toObservable(this.notesService.searchTerm)
      .pipe(
        debounceTime(800),
        filter(term => term.trim().length >= 3)
      )
      .subscribe(term => {
        this.notesService.addRecentSearch(term);
      });
  }
  
  public notesService = inject(NotesService);


  ngOnInit(): void {
    this.notesService.fetchNotes(false);
  }
}
