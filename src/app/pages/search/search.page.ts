import { Component, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { NotesService } from '../../services/notes.service';
import { NoteListComponent } from '../../component/note-list/note-list.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { LayoutService } from '../../services/layout.service';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-search',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    NoteListComponent,
    TranslatePipe
  ],
  templateUrl: './search.page.html',
  styleUrl: './search.page.css',
})
export class SearchPage {
  private layoutService = inject(LayoutService);
  private isDesktop = toSignal(this.layoutService.isDesktop$, { initialValue: false });
  private router = inject(Router); 
  public notesService = inject(NotesService);

  constructor() {
    effect(() => {
      if (this.isDesktop()) {
        this.router.navigate(['/notes']);
      }
    });
  }
  
  ngOnInit(): void {
    this.notesService.fetchNotes(false);
  }
}
