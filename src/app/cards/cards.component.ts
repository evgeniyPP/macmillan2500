import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { DataService } from './../data.service';
import { IWord } from '../word';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
})
export class CardsComponent implements OnChanges {
  @Input() page: number;
  @Output() answerSelected = new EventEmitter<IWord>();
  public words: IWord[];
  public checkIcon = faCheck;
  public timesIcon = faTimes;

  constructor(private dataService: DataService) {}

  ngOnChanges() {
    this.words = this.dataService.getOneBundle(this.page);
  }

  public showAnswer(id: number): void {
    this.word(id).showAnswer = true;
  }

  public correctAnswer(id: number): void {
    const word = this.word(id);

    if (word.incorrect) {
      return;
    }

    word.correct = true;
    this.answerSelected.emit();
  }

  public incorrectAnswer(id: number): void {
    const word = this.word(id);

    if (word.correct || word.incorrect) {
      return;
    }

    word.incorrect = true;
    this.answerSelected.emit(word);
  }

  private word(id: number): IWord {
    return this.words.find((w) => w.id === id);
  }
}
