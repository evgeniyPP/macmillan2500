import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { FinishedComponent } from './finished.component';
import { DataService } from '../data.service';
import { StorageService } from '../storage.service';

describe('FinishedComponent', () => {
  let component: FinishedComponent;
  let fixture: ComponentFixture<FinishedComponent>;
  let mockRouter, mockDataService, mockStorageService;

  beforeEach(async(() => {
    mockRouter = jasmine.createSpyObj<Router>(['navigate']);
    mockDataService = jasmine.createSpyObj<DataService>([
      'initialize',
      'getAllWords',
      'getIncorrectWords',
      'setNewWordsFromIncorrect',
    ]);
    mockStorageService = jasmine.createSpyObj<StorageService>(['get']);

    TestBed.configureTestingModule({
      declarations: [FinishedComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: StorageService, useValue: mockStorageService },
        { provide: DataService, useValue: mockDataService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    mockDataService.getIncorrectWords.and.returnValue([{}, {}]);
    mockDataService.getAllWords.and.returnValue([[{}], [{}]]); // 2 pages total
    fixture = TestBed.createComponent(FinishedComponent);
    component = fixture.componentInstance;
  });

  it('should show outro text', () => {
    const outro = fixture.debugElement.query(By.css('#finished'));

    expect(outro.nativeElement.textContent).toContain(
      'Ура! Вы прошли все 2500 слов!'
    );
  });

  it('should redirect back to homepage if user has not finished his test', () => {
    mockStorageService.get.and.returnValue(1);

    fixture.detectChanges();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  describe('buttons', () => {
    it('should show two buttons', () => {
      const buttons = fixture.debugElement.queryAll(By.css('.next-move'));

      expect(buttons.length).toBe(2);
    });

    describe('moveOn()', () => {
      it('should call been called if moveOn button is clicked', () => {
        spyOn(component, 'moveOn');
        const buttons = fixture.debugElement.queryAll(By.css('.next-move'));
        const moveOnBtn = buttons[1];

        moveOnBtn.triggerEventHandler('click', null);

        expect(component.moveOn).toHaveBeenCalled();
      });
    });

    describe('download()', () => {
      it('should been called if download button is clicked', () => {
        spyOn(component, 'download');
        const buttons = fixture.debugElement.queryAll(By.css('.next-move'));
        const downloadBtn = buttons[0];

        downloadBtn.triggerEventHandler('click', null);

        expect(component.download).toHaveBeenCalled();
      });

      it('should send a file to download', () => {
        const element = jasmine.createSpyObj('a', [
          'click',
          'setAttribute',
          'style',
        ]);
        spyOn(document, 'createElement').and.returnValue(element);
        spyOn(document.body, 'appendChild').and.callFake(() => null);
        spyOn(document.body, 'removeChild').and.callFake(() => null);
        const buttons = fixture.debugElement.queryAll(By.css('.next-move'));
        const downloadBtn = buttons[0];

        downloadBtn.triggerEventHandler('click', null);

        expect(document.createElement).toHaveBeenCalledTimes(1);
        expect(document.createElement).toHaveBeenCalledWith('a');
        expect(document.body.appendChild).toHaveBeenCalledTimes(1);
        expect(document.body.removeChild).toHaveBeenCalledTimes(1);
      });
    });

    describe('should show the correct title', () => {
      it('when there are more words to learn', () => {
        fixture.detectChanges();
        const buttons = fixture.debugElement.queryAll(By.css('.next-move'));

        expect(buttons[0].nativeElement.title).toEqual(
          'Начать заново, но уже только с неизвестными словами'
        );
        expect(buttons[1].nativeElement.title).toEqual(
          'Начать заново, но уже только с неизвестными словами'
        );
      });

      it('when there are no words to learn', () => {
        component.incorrectWords = [];
        fixture.detectChanges();

        const buttons = fixture.debugElement.queryAll(By.css('.next-move'));

        expect(buttons[0].nativeElement.title).toEqual(
          'Вы знаете все 2500 слов. Поздравляем!'
        );
        expect(buttons[1].nativeElement.title).toEqual(
          'Вы знаете все 2500 слов. Поздравляем!'
        );
      });
    });

    it('should be disabled when there are no words to learn', () => {
      component.incorrectWords = [];
      fixture.detectChanges();

      const buttons = fixture.debugElement.queryAll(By.css('.next-move'));

      expect(buttons[0].nativeElement.disabled).toBeTrue();
      expect(buttons[1].nativeElement.disabled).toBeTrue();
    });
  });
});
