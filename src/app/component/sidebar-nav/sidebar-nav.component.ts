import { Component, input, inject } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { filter, map, startWith } from 'rxjs';

import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

import { NavItem } from '../../models/nav-item.model';
import { NotesService } from '../../services/notes.service';

@Component({
  selector: 'app-sidebar-nav',
  standalone: true,
  imports: [RouterModule, MatListModule, MatIconModule, MatChipsModule],
  templateUrl: './sidebar-nav.component.html',
  styleUrl: './sidebar-nav.component.css'
})

export class SidebarNavComponent {
  logoPath = 'assets/logos/logo.png';

  private router = inject(Router);
  public notesService = inject(NotesService);
  public items = input.required<NavItem[]>();

  public showTags = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => !this.router.url.startsWith('/archived')),
      startWith(!this.router.url.startsWith('/archived'))
    ),
    { initialValue: true }
  );

  public toggleTag(tagName: string) {
    this.notesService.toggleTagFilter(tagName);
    this.router.navigate(['/notes']);
  }

  public onRemove(tagName: string, event: Event) {
    event.stopPropagation();
    this.notesService.toggleTagFilter(tagName);
  }
}
