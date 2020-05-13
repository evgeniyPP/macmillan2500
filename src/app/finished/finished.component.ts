import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-finished',
  templateUrl: './finished.component.html',
  styleUrls: ['./finished.component.scss'],
})
export class FinishedComponent {
  constructor(private router: Router) {}

  moveOn() {
    const newWords = JSON.parse(localStorage.getItem('incorrect')) || [];

    if (!newWords) {
      return false;
    }

    localStorage.setItem('newWords', JSON.stringify(newWords));
    localStorage.removeItem('incorrect');
    localStorage.removeItem('page');
    this.router.navigate(['/']);
  }

  download() {
    this.router.navigate(['/']);
  }
}
