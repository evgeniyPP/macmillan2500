import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  constructor(private router: Router, private dataService: DataService) {}

  public restart() {
    this.dataService.restart();

    if (this.router.url === '/') {
      window.location.reload();
    } else {
      this.router.navigate(['/']).then(() => window.location.reload());
    }
  }
}
