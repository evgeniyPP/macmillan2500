import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from './../data.service';
import { IWord } from './../word';

@Component({
  selector: 'app-finished',
  templateUrl: './finished.component.html',
})
export class FinishedComponent {
  public incorrectWords: IWord[];

  constructor(private router: Router, private dataService: DataService) {
    this.incorrectWords = this.dataService.getIncorrectWords();
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
