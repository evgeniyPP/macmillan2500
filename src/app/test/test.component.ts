import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IWord } from '../word';
import { DataService } from './../data.service';
import { StorageService } from './../storage.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
})
export class TestComponent implements OnInit {
  public cardsCount: number;
  public wordsLength: number;
  public page: number;
  public completed: number;
  private answersCounter = 0;

  constructor(
    private router: Router,
    private storageService: StorageService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.page = +this.storageService.get('page') || 1;
    this.cardsCount =
      (this.dataService.getOneBundle(this.page) &&
        this.dataService.getOneBundle(this.page).length) ||
      0;
    this.wordsLength = this.dataService.getAllWords().length;
    this.completed = this.countCompleted();
  }

  public nextPage() {
    if (this.answersCounter !== this.cardsCount) {
      return;
    }

    this.page++;
    this.answersCounter = 0;

    this.storageService.set('page', this.page + '');
    this.completed = this.countCompleted();

    if (this.page >= this.wordsLength) {
      return this.router.navigate(['/finished']);
    }

    window.scrollTo(0, 0);
  }

  public onNewAnswer(data?: IWord) {
    this.answersCounter++;

    if (!data) {
      return;
    }

    const { id, word, translation } = data;

    const incorrectWords = this.dataService.getIncorrectWords();

    if (incorrectWords.length && incorrectWords.find((w) => w.id === id)) {
      return;
    }

    incorrectWords.push({
      id,
      word,
      translation,
    });

    this.dataService.setIncorrectWordsFromArray(incorrectWords);
  }

  private countCompleted(): number {
    return Math.floor((this.page * 100) / this.wordsLength);
  }

  public isBtnDisabled(): boolean {
    return this.answersCounter !== this.cardsCount;
  }
}
