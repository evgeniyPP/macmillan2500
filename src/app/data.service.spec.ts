import { DataService } from './data.service';

describe('DataService', () => {
  let service: DataService;
  let mockStorageService;

  beforeEach(() => {
    mockStorageService = jasmine.createSpyObj(['get', 'set', 'delete']);
    service = new DataService(mockStorageService);
  });

  describe('initialize()', () => {
    it('should set words from JSON by default', () => {
      mockStorageService.get.and.returnValue(null);

      service.initialize();

      expect(service.getAllWords().length).not.toBe(0);
    });

    it("should set words from 'words' if there is one in the localStorage", () => {
      mockStorageService.get.and.returnValue(null);
      mockStorageService.get.withArgs('words').and.returnValue([[{}, {}]]);

      service.initialize();

      expect(service.getAllWords()[0].length).toBe(2);
    });

    it("should set words from 'newWords' if there is one in the localStorage", () => {
      mockStorageService.get.and.returnValue(null);
      mockStorageService.get.withArgs('newWords').and.returnValue([{}, {}]);

      service.initialize();

      expect(service.getAllWords()[0].length).toBe(2);
    });
  });

  describe('getAllWords()', () => {
    it('should get all words', () => {
      mockStorageService.get.and.returnValue(null);
      mockStorageService.get.withArgs('words').and.returnValue([[{}, {}]]);

      service.initialize();

      expect(service.getAllWords()[0].length).toBe(2);
    });
  });

  describe('getOneBundle()', () => {
    it('should get correct bundle', () => {
      mockStorageService.get.and.returnValue(null);
      mockStorageService.get.withArgs('words').and.returnValue([
        [{ id: 1 }, { id: 2 }],
        [{ id: 3 }, { id: 4 }],
      ]);
      service.initialize();
      const page = 2;

      expect(service.getOneBundle(page)[0].id).toBe(3);
      expect(service.getOneBundle(page)[1].id).toBe(4);
    });
  });

  describe('setNewWordsFromIncorrect()', () => {
    it('should set new words from incorrect, set page to 1 and call clearIncorrectWords()', () => {
      spyOn(service, 'clearIncorrectWords');
      mockStorageService.get.and.returnValue(null);
      mockStorageService.get.withArgs('words').and.returnValue([[{}, {}]]);
      service.initialize();

      service.setNewWordsFromIncorrect();

      expect(mockStorageService.set).toHaveBeenCalledTimes(2);
      expect(mockStorageService.delete).toHaveBeenCalledWith('page');
      expect(service.clearIncorrectWords).toHaveBeenCalled();
    });
  });

  describe('restart()', () => {
    it('should set new words from incorrect, set page to 1 and call clearIncorrectWords()', () => {
      spyOn(service, 'clearIncorrectWords');
      mockStorageService.get.and.returnValue(null);
      mockStorageService.get.withArgs('words').and.returnValue([[{}, {}]]);
      service.initialize();

      service.restart();

      expect(mockStorageService.delete).toHaveBeenCalledWith('words');
      expect(mockStorageService.delete).toHaveBeenCalledWith('page');
      expect(service.clearIncorrectWords).toHaveBeenCalled();
    });
  });
});
