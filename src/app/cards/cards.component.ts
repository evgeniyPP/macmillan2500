import { Component, OnInit, Input } from '@angular/core';
import { IWord } from '../word';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css'],
})
export class CardsComponent {
  @Input() words: IWord[];

  public showAnswer(id: number): void {
    const word = this.words.find((w) => w.id === id);
    word.showAnswer = true;
  }
}
