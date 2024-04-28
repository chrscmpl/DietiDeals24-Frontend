import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { SearchSectionComponent } from '../search/search-section/search-section.component';
import { RouterLink, Router } from '@angular/router';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'dd24-header',
  standalone: true,
  imports: [SearchSectionComponent, RouterLink, TitleCasePipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(public user: UserService, public router: Router) {}
  tabs: { name: string; url: string }[] = [
    { name: 'Home', url: 'home' },
    { name: 'Your Page', url: 'your-page' },
    { name: 'Create Auction', url: 'create-auction' },
    { name: 'Security & Privacy', url: 'your-page' },
    { name: 'Help', url: 'help' },
  ];

  get routes(): { name: string; url: string }[] {
    const ret: { name: string; url: string }[] = [];
    const route = this.router.url.replace(/^\/+|\/+$/g, '');
    let i: number = 0;
    while (i != -1) {
      let j: number = route.indexOf('/', i);
      ret.push({
        name: route
          .substring(i, j !== -1 ? j : route.length)
          .split('-')
          .join(' '),
        url: route.substring(0, j !== -1 ? j : route.length),
      });
      i = j;
    }
    return ret;
  }
}
