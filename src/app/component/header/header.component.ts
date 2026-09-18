import { Component, inject, signal, OnDestroy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { Subscription } from 'rxjs';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

import { LayoutService } from '../../services/layout.service';
import { NotesService } from '../../services/notes.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatIconModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnDestroy {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private routerSub: Subscription;

  public notesService = inject(NotesService);
  public isDesktop$ = inject(LayoutService).isDesktop$;
  public title = signal(this.getCurrentTitle());

  constructor() {
    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.title.set(this.getCurrentTitle());
      }
    });
  }

  ngOnDestroy() {
    this.routerSub.unsubscribe();
  }

  private getCurrentTitle(): string {
    return this.activatedRoute.snapshot.firstChild?.data['title'] ?? '';
  }

}