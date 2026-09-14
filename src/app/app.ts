import { Component, inject } from '@angular/core';
import { SidebarNavComponent } from './component/sidebar-nav/sidebar-nav.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutService } from './services/layout.service';
import { NAV_ITEMS } from './models/nav-item.model';
import { BottomNavComponent } from './component/bottom-nav/bottom-nav.component';
import { HeaderComponent } from './component/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarNavComponent, BottomNavComponent, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor() { }

  private layoutService = inject(LayoutService);
  public navItems = NAV_ITEMS;
  
  isHandset$ = this.layoutService.isHandset$;
  isTablet$ = this.layoutService.isTablet$;
  isDesktop$ = this.layoutService.isDesktop$;

}
