import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { CardsComponent } from './cards.component';
import { DataService } from './../data.service';

@Component({
  template: `<app-cards [page]="1" [wordsLength]="2"></app-cards>`,
})
class WrapperComponent {
  page: number;
  wordsLength: number;
}

@Component({
  selector: 'fa-icon',
  template: `<div></div>`,
})
class FaIcon {
  @Input() icon: any;
}

describe('CardsComponent', () => {
  let wrapperFixture: ComponentFixture<WrapperComponent>;
  let component: CardsComponent;
  let fixture: ComponentFixture<CardsComponent>;
  let mockDataService;
  let mockRouter;
  let BUNDLE;

  beforeEach(async(() => {
    mockDataService = jasmine.createSpyObj(['getOneBundle']);
    mockRouter = jasmine.createSpyObj(['navigate']);

    TestBed.configureTestingModule({
      declarations: [WrapperComponent, CardsComponent, FaIcon],
      providers: [
        { provide: DataService, useValue: mockDataService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    wrapperFixture = TestBed.createComponent(WrapperComponent);
    fixture = TestBed.createComponent(CardsComponent);
    component = fixture.componentInstance;
    BUNDLE = [
      { word: 'ask', translation: 'спрашивать', id: 25 },
      { word: 'knight', translation: 'рыцарь', id: 28 },
      { word: 'little', translation: 'маленький', id: 30 },
    ];
  });

  it('should show a card for every word', () => {
    mockDataService.getOneBundle.and.returnValue(BUNDLE);
    wrapperFixture.detectChanges();

    const cards = wrapperFixture.debugElement.queryAll(By.css('article'));
    for (let i = 0; i < cards.length; i++) {
      expect(cards[i].nativeElement.textContent).toContain(BUNDLE[i].word);
    }
  });

  it('should show the translation on showAnswer click', () => {
    mockDataService.getOneBundle.and.returnValue(BUNDLE);
    wrapperFixture.detectChanges();
    const cards = wrapperFixture.debugElement.queryAll(By.css('article'));
    const buttons = wrapperFixture.debugElement.queryAll(
      By.css('.show-answer')
    );

    buttons[0].triggerEventHandler('click', null);
    wrapperFixture.detectChanges();

    expect(cards[0].nativeElement.textContent).toContain(BUNDLE[0].translation);
  });

  it('should redirect to finished page if there is no words page', () => {
    component.wordsLength = 100;
    component.page = 101;

    component.ngOnChanges();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/finished']);
  });

  describe('answer button', () => {
    beforeEach(() => {
      mockDataService.getOneBundle.and.returnValue(BUNDLE);
      component.words = BUNDLE;
      wrapperFixture.detectChanges();

      const buttons = wrapperFixture.debugElement.queryAll(
        By.css('.show-answer')
      );
      buttons[0].triggerEventHandler('click', null);

      wrapperFixture.detectChanges();
    });

    it('should set word.correct to true if the correct answer was selected', () => {
      const answerBtn = wrapperFixture.debugElement.queryAll(
        By.css('.correct')
      )[0];

      answerBtn.triggerEventHandler('click', null);
      wrapperFixture.detectChanges();

      expect(component.words[0].correct).toBeTrue();
    });

    it('should set word.incorrect to true if the incorrect answer was selected', () => {
      const answerBtn = wrapperFixture.debugElement.queryAll(
        By.css('.incorrect')
      )[0];

      answerBtn.triggerEventHandler('click', null);
      wrapperFixture.detectChanges();

      expect(component.words[0].incorrect).toBeTrue();
    });

    it('should prevent answer changing if the answer has been already selected', () => {
      const answerBtn = wrapperFixture.debugElement.queryAll(
        By.css('.correct')
      )[0];
      answerBtn.triggerEventHandler('click', null);
      wrapperFixture.detectChanges();

      const answerBtn2 = wrapperFixture.debugElement.queryAll(
        By.css('.incorrect')
      )[0];
      answerBtn2.triggerEventHandler('click', null);
      wrapperFixture.detectChanges();

      expect(component.words[0].correct).toBeTrue();
      expect(component.words[0].incorrect).toBeUndefined();
    });
  });
});
