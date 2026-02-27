import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule }  from '@angular/material/sidenav';
import { MatToolbarModule }  from '@angular/material/toolbar';
import { MatListModule }     from '@angular/material/list';
import { MatIconModule }     from '@angular/material/icon';
import { MatButtonModule }   from '@angular/material/button';
import { MatSelectModule }   from '@angular/material/select';
import { MatBadgeModule }    from '@angular/material/badge';
import { MatTooltipModule }  from '@angular/material/tooltip';
import { FormsModule }       from '@angular/forms';
import { ThemeService }      from './core/services/theme';
import { FilterService }     from './core/services/filter';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, RouterLink, RouterLinkActive,
    MatSidenavModule, MatToolbarModule, MatListModule,
    MatIconModule, MatButtonModule, MatSelectModule,
    MatBadgeModule, MatTooltipModule, FormsModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  dateRange = '30';
  constructor(public theme: ThemeService, private filter: FilterService) {}

  onRangeChange() {
    this.filter.setRange(+this.dateRange);
  }
}