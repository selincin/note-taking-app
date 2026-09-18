import { Component, inject, input } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { NotesDialogComponent } from '../dialogs/notes-dialog/notes-dialog.component';

@Component({
  selector: 'app-empty-note-state',
  standalone: true,
  imports: [
    MatButton,
    MatIcon,
    MatButtonModule,
    MatDialogModule,
    TranslatePipe

  ],
  templateUrl: './empty-note-state.component.html',
  styleUrl: './empty-note-state.component.css',
})
export class EmptyNoteStateComponent {
  public readonly dialog = inject(MatDialog);
  public iconPath = 'assets/logos/notes-icon.svg';
  public showStickyNote = input<boolean>(true);

  public openDialog() {
    const dialogRef = this.dialog.open(NotesDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
