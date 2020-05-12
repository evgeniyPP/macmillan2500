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
  private shuffledWords: IWord[];
  public bundledWords: Array<IWord[]> = [];
  public page: number;

  ngOnInit() {
    this.shuffledWords = JSON.parse(
      localStorage.getItem('allWords') || 'false'
    );

    if (!this.shuffledWords) {
      this.shuffledWords = this.shuffle(this.words);
      localStorage.setItem('allWords', JSON.stringify(this.shuffledWords));
    }

    this.page = +localStorage.getItem('page') || 1;
    this.bundle();
  }

  public nextPage() {
    this.page++;
    localStorage.setItem('page', this.page + '');
  }

  private bundle() {
    let bundle: IWord[] = [];

    for (let i = 1; i <= this.shuffledWords.length; i++) {
      const word = this.shuffledWords[i - 1];
      const bundleSize = 24;
      word.id = i;
      bundle.push(word);

      if (i % bundleSize === 0 && i !== 0) {
        this.bundledWords.push(bundle);
        bundle = [];
      }
    }
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
}
