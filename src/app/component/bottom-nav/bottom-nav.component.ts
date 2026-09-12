import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NavItem } from '../../models/nav-item.model';

@Component({
    selector: 'app-bottom-nav',
    standalone: true,
    imports: [RouterModule, MatIconModule, MatButtonModule],
    templateUrl: './bottom-nav.component.html',
    styleUrl: './bottom-nav.component.css'
})

export class BottomNavComponent {
  items = input.required<NavItem[]>();


createNote = () => {
    window.alert('Create Note button clicked!');
    //#TODO: Implement the logic to create a new note
  }
}