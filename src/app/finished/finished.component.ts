import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from './../data.service';
import { StorageService } from './../storage.service';
import { IWord } from './../word';

@Component({
  selector: 'app-finished',
  templateUrl: './finished.component.html',
})
export class FinishedComponent implements OnInit {
  public incorrectWords: IWord[];

  constructor(
    private router: Router,
    private dataService: DataService,
    private storageService: StorageService
  ) {
    this.incorrectWords = this.dataService.getIncorrectWords();
  }

  ngOnInit() {
    const page = +this.storageService.get('page') || 1;
    const wordsLength = this.dataService.getAllWords().length;

    if (page < wordsLength) {
      this.router.navigate(['/']);
    }
  }

  moveOn() {
    this.dataService.setNewWordsFromIncorrect();
    this.dataService.initialize();
    this.router.navigate(['/']);
  }

  download() {
    const text = this.incorrectWords
      .map((word, index) => {
        return `${index + 1}. ${word.word} – ${word.translation}\n`;
      })
      .join('');

    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
    );
    element.setAttribute('download', 'macmillan-words.txt');

    element.style.display = 'none';

    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
    return;
  }
}
