import { Component, inject, input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

import { NavItem } from '../../models/nav-item.model';
import { Note } from '../../models/note.model';
import { NotesDialogComponent } from '../dialogs/notes-dialog/notes-dialog.component';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.css'
})

export class BottomNavComponent {
  constructor(
    private router: Router,
  ) { }

  public readonly dialog = inject(MatDialog);
  items = input.required<NavItem[]>();

  public openDialog(note?: Note) {
    this.router.navigate(['/notes']);
    const dialogRef = this.dialog.open(NotesDialogComponent, {
      data: { note }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
      }
    });
  }
}