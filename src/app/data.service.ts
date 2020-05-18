import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { IWord } from './word';
import jsonData from './api.json';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private words: IWord[][];
  private unsortedWords: IWord[];
  private incorrectWords: IWord[];
  private bundleSize = 24;

  constructor(private storageService: StorageService) {
    this.initialize();
  }

  public initialize(): void {
    const newWords = this.storageService.get('newWords');
    const words = this.storageService.get('words');

    if (newWords) {
      this.unsortedWords = this.setNewWordsAsUnsorted(newWords);
    } else if (words) {
      this.words = words;
    } else {
      this.unsortedWords = jsonData;
    }

    if (!this.words) {
      const shuffledWords = this.shuffle(this.unsortedWords);
      this.words = this.bundle(shuffledWords);

      this.storageService.set('words', this.words);
    }

    this.setIncorrectWordsFromStorage();
  }

  public getAllWords(): IWord[][] {
    if (!this.words) {
      throw new Error('words is missing');
    }

    return this.words;
  }

  public getOneBundle(page: number): IWord[] {
    return this.words[page - 1];
  }

  public setNewWordsFromIncorrect(): void {
    this.storageService.set('newWords', this.incorrectWords);
    this.storageService.delete('page');
    this.clearIncorrectWords();
  }

  public restart(): void {
    this.words = null;
    this.storageService.delete('words');

    this.clearIncorrectWords();

    this.storageService.delete('page');
  }

  // Incorrect Words
  public getIncorrectWords(): IWord[] {
    if (!this.incorrectWords) {
      this.setIncorrectWordsFromStorage();
    }

    return this.incorrectWords;
  }

  public setIncorrectWordsFromStorage(): void {
    this.incorrectWords = this.storageService.get('incorrect') || [];
  }

  public setIncorrectWordsFromArray(array: IWord[]): void {
    this.incorrectWords = array;
    this.storageService.set('incorrect', this.incorrectWords);
  }

  public clearIncorrectWords(): void {
    this.incorrectWords = null;
    this.storageService.delete('incorrect');
  }

  // Private methods
  private setNewWordsAsUnsorted(newWords: IWord[]) {
    this.storageService.delete('newWords');

    this.words = null;
    this.clearIncorrectWords();

    return newWords;
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

  private bundle(words: IWord[]) {
    const bundledWords: IWord[][] = [];
    let bundle: IWord[] = [];

    for (let i = 1; i <= words.length; i++) {
      const word = words[i - 1];
      word.id = i;
      bundle.push(word);

      if ((i % this.bundleSize === 0 && i !== 0) || i === words.length) {
        bundledWords.push(bundle);
        bundle = [];
      }
    }

    return bundledWords;
  }
}
