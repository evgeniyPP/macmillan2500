import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { FinishedComponent } from './finished.component';
import { DataService } from '../data.service';

describe('FinishedComponent', () => {
  let component: FinishedComponent;
  let fixture: ComponentFixture<FinishedComponent>;
  let mockRouter, mockDataService;

  beforeEach(async(() => {
    mockRouter = jasmine.createSpyObj<Router>(['navigate']);
    mockDataService = jasmine.createSpyObj<DataService>([
      'initialize',
      'getIncorrectWords',
      'setNewWordsFromIncorrect',
    ]);

    TestBed.configureTestingModule({
      declarations: [FinishedComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: DataService, useValue: mockDataService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    mockDataService.getIncorrectWords.and.returnValue([{}, {}]);
    fixture = TestBed.createComponent(FinishedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should show outro text', () => {
    const outro = fixture.debugElement.query(By.css('#finished'));

    expect(outro.nativeElement.textContent).toContain(
      'Ура! Вы прошли все 2500 слов!'
    );
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
        const spyObj = jasmine.createSpyObj('a', ['click']);
        spyOn(document, 'createElement').and.returnValue(spyObj);
        const buttons = fixture.debugElement.queryAll(By.css('.next-move'));
        const downloadBtn = buttons[0];

        downloadBtn.triggerEventHandler('click', null);

        expect(document.createElement).toHaveBeenCalledTimes(1);
        expect(document.createElement).toHaveBeenCalledWith('a');
      });
    });

    describe('should show the correct title', () => {
      it('when there are more words to learn', () => {
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
