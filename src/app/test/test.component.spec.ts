import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Input, Component } from '@angular/core';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

import { TestComponent } from './test.component';
import { DataService } from './../data.service';
import { StorageService } from './../storage.service';

@Component({
  selector: 'app-cards',
  template: `<h4 style="color: red">Здесь находятся карточки слов</h4>`,
})
class MockCardComponent {
  @Input() page: number;
}

describe('TestComponent', () => {
  let fixture: ComponentFixture<TestComponent>;
  let mockRouter, mockStorageService, mockDataService;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj<Router>(['navigate']);
    mockStorageService = jasmine.createSpyObj<StorageService>(['get', 'set']);
    mockDataService = jasmine.createSpyObj<DataService>([
      'getOneBundle',
      'getAllWords',
      'getIncorrectWords',
      'setIncorrectWordsFromArray',
    ]);

    TestBed.configureTestingModule({
      declarations: [TestComponent, MockCardComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: StorageService, useValue: mockStorageService },
        { provide: DataService, useValue: mockDataService },
      ],
    });

    fixture = TestBed.createComponent(TestComponent);
  });

  it('should init the app correctly', () => {
    mockStorageService.get.and.returnValue('1');
    mockDataService.getOneBundle.and.returnValue([{}]);
    mockDataService.getAllWords.and.returnValue([[{}], [{}]]);

    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('intro text', () => {
    it('should be showed if it is a page 1', () => {
      mockStorageService.get.and.returnValue('1');
      mockDataService.getOneBundle.and.returnValue([{}]);
      mockDataService.getAllWords.and.returnValue([[{}], [{}]]);

      fixture.detectChanges();

      const intro = fixture.debugElement.query(By.css('#intro'));
      expect(intro.nativeElement.textContent).toContain(
        'Перед вами 2500 самых распространненых слов'
      );
    });

    it('should NOT be showed if it is NOT a page 1', () => {
      mockStorageService.get.and.returnValue('2');
      mockDataService.getOneBundle.and.returnValue([{}]);
      mockDataService.getAllWords.and.returnValue([[{}], [{}]]);

      fixture.detectChanges();

      const intro = fixture.debugElement.query(By.css('#intro'));
      expect(intro).toBeNull();
    });
  });

  it('should show correct percentage of passed pages', () => {
    mockDataService.getOneBundle.and.returnValue([{}]);

    mockStorageService.get.and.returnValue('2'); // 2nd page
    mockDataService.getAllWords.and.returnValue([[{}], [{}], [{}], [{}]]); // 4 pages
    fixture.detectChanges();

    const paragraph = fixture.debugElement.query(By.css('#completed'));
    expect(paragraph.nativeElement.textContent).toContain('Пройдено 50%');
  });

  describe('nextPage button', () => {
    it('should be disabled if all cards are NOT passed', () => {
      mockStorageService.get.and.returnValue('1');
      mockDataService.getAllWords.and.returnValue([[{}], [{}]]);

      mockDataService.getOneBundle.and.returnValue([{}]);
      fixture.detectChanges();

      const button = fixture.debugElement.query(By.css('#nextPage'));
      expect(button.nativeElement.disabled).toBeTrue();
    });

    it('should be active  if all cards are passed', () => {
      mockStorageService.get.and.returnValue('1');
      mockDataService.getAllWords.and.returnValue([[{}], [{}]]);

      mockDataService.getOneBundle.and.returnValue([]); // 0 cards
      fixture.detectChanges();

      const button = fixture.debugElement.query(By.css('#nextPage'));
      expect(button.nativeElement.disabled).toBeFalse();
    });
  });

  describe('nextPage()', () => {
    it('should NOT work if all cards are NOT passed', () => {
      mockStorageService.get.and.returnValue('1');
      mockDataService.getOneBundle.and.returnValue([{}]);
      mockDataService.getAllWords.and.returnValue([[{}], [{}]]);
      fixture.detectChanges();

      fixture.componentInstance.nextPage();

      expect(fixture.componentInstance.page).toBe(1);
    });

    it('should go to the next page if all cards are passed', () => {
      mockStorageService.get.and.returnValue('1');
      mockDataService.getAllWords.and.returnValue([[{}], [{}]]);

      mockDataService.getOneBundle.and.returnValue([]); // 0 cards
      fixture.detectChanges();
      fixture.componentInstance.nextPage();

      expect(fixture.componentInstance.page).toBe(2);
    });

    it('should redirect on /finished if it was a last page', () => {
      mockStorageService.get.and.returnValue('2'); // last page
      mockDataService.getOneBundle.and.returnValue([]); // 0 cards
      mockDataService.getAllWords.and.returnValue([[{}], [{}]]);
      fixture.detectChanges();

      fixture.componentInstance.nextPage();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/finished']);
    });

    it('should call storageService.set with a new page number', () => {
      mockStorageService.get.and.returnValue('1');
      mockDataService.getOneBundle.and.returnValue([]); // 0 cards
      mockDataService.getAllWords.and.returnValue([[{}], [{}]]);
      fixture.detectChanges();

      fixture.componentInstance.nextPage();

      expect(mockStorageService.set).toHaveBeenCalledWith('page', '2');
    });
  });

  describe('onNewAnswer()', () => {
    it('should call dataService.setIncorrectWordsFromArray and pass a data', () => {
      mockStorageService.get.and.returnValue('1');
      mockDataService.getOneBundle.and.returnValue([{}]);
      mockDataService.getAllWords.and.returnValue([[{}], [{}]]);

      const incorrectWords = [{}, {}];
      mockDataService.getIncorrectWords.and.returnValue(incorrectWords);
      fixture.detectChanges();
      const data = { id: 1, word: 'ask', translation: 'спрашивать' };
      fixture.componentInstance.onNewAnswer(data);

      expect(mockDataService.setIncorrectWordsFromArray).toHaveBeenCalledWith([
        {},
        {},
        data,
      ]);
    });

    it('should NOT call dataService.setIncorrectWordsFromArray if a word has already been pushed', () => {
      mockStorageService.get.and.returnValue('1');
      mockDataService.getOneBundle.and.returnValue([{}]);
      mockDataService.getAllWords.and.returnValue([[{}], [{}]]);

      const incorrectWords = [{}, {}, { id: 1 }];
      mockDataService.getIncorrectWords.and.returnValue(incorrectWords);
      fixture.detectChanges();
      const data = { id: 1, word: 'ask', translation: 'спрашивать' };
      fixture.componentInstance.onNewAnswer(data);

      expect(mockDataService.setIncorrectWordsFromArray).not.toHaveBeenCalled();
    });
  });
});
