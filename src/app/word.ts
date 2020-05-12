export interface IWord {
  word: string;
  translation: string;
  id?: number;
  showAnswer?: boolean;
  correct?: boolean;
  incorrect?: boolean;
}
