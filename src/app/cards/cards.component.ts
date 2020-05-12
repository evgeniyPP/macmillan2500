import { Component, Input } from '@angular/core';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { IWord } from '../word';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css'],
})
export class CardsComponent {
  @Input() words: IWord[];
  public checkIcon = faCheck;
  public timesIcon = faTimes;

  public showAnswer(id: number): void {
    this.word(id).showAnswer = true;
  }

  public correctAnswer(id: number): void {
    this.word(id).correct = true;
  }

  public incorrectAnswer(id: number): void {
    this.word(id).incorrect = true;
  }

  private word(id: number): IWord {
    return this.words.find((w) => w.id === id);
  }
}
