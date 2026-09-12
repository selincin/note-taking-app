import { Component, inject } from '@angular/core';
import { SidebarNavComponent } from '../component/sidebar-nav/sidebar-nav.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutService } from '../services/layout.service';
import { NAV_ITEMS } from '../models/nav-item.model';
import { BottomNavComponent } from '../component/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarNavComponent, BottomNavComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private layoutService = inject(LayoutService);
  public navItems = NAV_ITEMS;

  isHandset$ = this.layoutService.isHandset$;
}
