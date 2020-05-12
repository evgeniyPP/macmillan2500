import { Component, Input, Output, EventEmitter } from '@angular/core';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { IWord } from '../word';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css'],
})
export class CardsComponent {
  @Input() words: IWord[];
  @Output() answerEmmiter = new EventEmitter<IWord>();
  public checkIcon = faCheck;
  public timesIcon = faTimes;

  public showAnswer(id: number): void {
    this.word(id).showAnswer = true;
  }

  public correctAnswer(id: number): void {
    const word = this.word(id);

    if (word.incorrect) {
      return;
    }

    word.correct = true;
  }

  public incorrectAnswer(id: number): void {
    const word = this.word(id);

    if (word.correct || word.incorrect) {
      return;
    }

    word.incorrect = true;
    this.answerEmmiter.emit(word);
  }

  private word(id: number): IWord {
    return this.words.find((w) => w.id === id);
  }
}
