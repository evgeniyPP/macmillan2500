import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  public restart() {
    localStorage.removeItem('allWords');
    localStorage.removeItem('incorrect');
    localStorage.removeItem('page');

    location.reload();
  }
}
