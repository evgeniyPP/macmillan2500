import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Output() restartClicked = new EventEmitter();

  public restart() {
    const isUserAgreed = confirm('Вы уверены? Весь ваш прогресс потеряется.');

    if (isUserAgreed) {
      this.restartClicked.emit();
    }
  }
}
