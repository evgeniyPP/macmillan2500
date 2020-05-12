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
  public bundledWords: Array<IWord[]> = [];
  public page = 1;

  ngOnInit() {
    this.bundle();
  }

  public nextPage() {
    this.page++;
  }

  private bundle() {
    let bundle: IWord[] = [];

    for (let i = 1; i <= this.words.length; i++) {
      const word = this.words[i - 1];
      const bundleSize = 24;
      word['id'] = i;
      word['showAnswer'] = false;
      bundle.push(word);

      if (i % bundleSize === 0 && i !== 0) {
        this.bundledWords.push(bundle);
        bundle = [];
      }
    }
  }
}
