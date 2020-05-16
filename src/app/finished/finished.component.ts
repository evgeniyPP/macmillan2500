import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from './../data.service';
import { IWord } from './../word';

@Component({
  selector: 'app-finished',
  templateUrl: './finished.component.html',
  styleUrls: ['./finished.component.scss'],
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
    return;
  }
}
