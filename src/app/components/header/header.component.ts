import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { SearchSectionComponent } from '../search/search-section/search-section.component';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'dd24-header',
  standalone: true,
  imports: [SearchSectionComponent, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(public user: UserService, public router: Router) {}
  tabs: { name: string; url: string }[] = [
    { name: 'Home', url: 'home' },
    { name: 'Your Page', url: 'home' },
    { name: 'Create Auction', url: 'home' },
    { name: 'Security & Privacy', url: 'home' },
    { name: 'Help', url: 'home' },
  ];
}
