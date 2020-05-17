import { By } from '@angular/platform-browser';
import { TestBed, async } from '@angular/core/testing';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { DataService } from './data.service';

@Component({
  selector: 'app-header',
  template: '<h3 style="color: red">Header</h3>',
})
export class MockHeaderComponent {
  @Output() restartClicked = new EventEmitter();
}

describe('LayoutComponent', () => {
  let mockRouter, mockDataService;

  beforeEach(async(() => {
    mockRouter = jasmine.createSpyObj<Router>(['url', 'navigate']);
    mockDataService = jasmine.createSpyObj<DataService>(['restart']);

    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      declarations: [LayoutComponent, MockHeaderComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: DataService, useValue: mockDataService },
      ],
    }).compileComponents();
  }));

  it('should show h1', () => {
    const fixture = TestBed.createComponent(LayoutComponent);

    const h1 = fixture.debugElement.query(By.css('h1'));

    expect(h1.nativeElement.textContent).toBeTruthy(
      '2500 самых распространенных английских слов'
    );
  });

  describe('restart()', () => {
    it('should be called when header emit restartClicked', () => {
      const fixture = TestBed.createComponent(LayoutComponent);
      const app = fixture.componentInstance;
      spyOn(app, 'restart');
      const header = fixture.debugElement.query(
        By.directive(MockHeaderComponent)
      ).componentInstance;

      header.restartClicked.emit();

      expect(app.restart).toHaveBeenCalled();
    });

    // it('should call dataService.restart()', () => {
    //   mockRouter.navigate.and.returnValue(
    //     new Promise((resolve, reject) =>
    //       reject(
    //         'Ошибка вызвана специально, чтобы не вызывать вечный цикл при тестировании'
    //       )
    //     )
    //   );
    //   const fixture = TestBed.createComponent(LayoutComponent);
    //   const header = fixture.debugElement.query(
    //     By.directive(MockHeaderComponent)
    //   ).componentInstance;

    //   header.restartClicked.emit();

    //   expect(mockDataService.restart).toHaveBeenCalled();
    // });
  });
});
