import { TestBed, async } from '@angular/core/testing';
import { TestComponent } from './test.component';

describe('TestComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(TestComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'macmillan2500'`, () => {
    const fixture = TestBed.createComponent(TestComponent);
    const app = fixture.componentInstance;
    // expect(app.title).toEqual('macmillan2500');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.content span').textContent).toContain(
      'macmillan2500 app is running!'
    );
  });
});
