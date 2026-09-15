import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon'

import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-empty-archived-state',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './empty-archived-state.component.html',
  styleUrl: './empty-archived-state.component.css',
})
export class EmptyArchivedStateComponent { 
    constructor(
    private router: Router,
  ) { }


  public navigateToAllNotes() {
    this.router.navigate(['/notes']);
  }
}
