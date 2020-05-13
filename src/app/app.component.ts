import { Component, OnInit } from '@angular/core';
import { IWord } from './word';
import jsonApi from './api.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private words: IWord[] = jsonApi;
  private incorrectWords: IWord[];
  private bundleSize = 24;
  private answersCounter = 0;
  public bundledWords: Array<IWord[]> = [];
  public page: number;
  public completed: number;

  constructor() {
    window.onbeforeunload = () => {
      localStorage.setItem('incorrect', JSON.stringify(this.incorrectWords));
    };
  }

  ngOnInit() {
    this.bundledWords = JSON.parse(localStorage.getItem('allWords') || 'false');

    if (!this.bundledWords) {
      const shuffledWords = this.shuffle(this.words);
      this.bundledWords = this.bundle(shuffledWords);
      localStorage.setItem('allWords', JSON.stringify(this.bundledWords));
    }

    this.page = +localStorage.getItem('page') || 1;

    this.completed = this.countCompleted();

    this.incorrectWords = JSON.parse(localStorage.getItem('incorrect')) || [];
  }

  public nextPage() {
    if (this.answersCounter !== this.bundleSize) {
      return;
    }

    this.page++;
    this.answersCounter = 0;

    localStorage.setItem('page', this.page + '');
    localStorage.setItem('incorrect', JSON.stringify(this.incorrectWords));

    this.completed = this.countCompleted();
    window.scrollTo(0, 0);
  }

  public onAnswerEmit(data: IWord | null) {
    this.answersCounter++;

    if (!data) {
      return;
    }

    const { id, word, translation } = data;

    const isExists =
      this.incorrectWords.length &&
      this.incorrectWords.find((w) => w.id === id);

    if (isExists) {
      return;
    }

    this.incorrectWords.push({
      id,
      word,
      translation,
    });
  }

  private bundle(words: IWord[]) {
    const bundledWords: Array<IWord[]> = [];
    let bundle: IWord[] = [];

    for (let i = 1; i <= words.length; i++) {
      const word = words[i - 1];
      word.id = i;
      bundle.push(word);

      if (i % this.bundleSize === 0 && i !== 0) {
        bundledWords.push(bundle);
        bundle = [];
      }
    }

    return bundledWords;
  }

  private shuffle(array) {
    let currentIndex = array.length,
      temporaryValue,
      randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  private countCompleted(): number {
    return Math.floor((this.page * 100) / this.bundledWords.length);
  }

  public isBtnDisabled(): boolean {
    return (
      this.page >= this.bundledWords.length ||
      this.answersCounter !== this.bundleSize
    );
  }
}
