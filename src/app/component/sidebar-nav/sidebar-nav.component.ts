import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { NavItem } from '../../models/nav-item.model';

@Component({
  selector: 'app-sidebar-nav',
  standalone: true,
  imports: [RouterModule, MatListModule, MatIconModule],
  templateUrl: './sidebar-nav.component.html',
  styleUrl: './sidebar-nav.component.css'
})

export class SidebarNavComponent {
  logoPath = 'assets/logos/logo.png'; 
  items = input.required<NavItem[]>();
}
