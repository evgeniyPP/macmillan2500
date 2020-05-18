import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;
  let savedString: string;
  const STORAGE_NAME = 'StorageService/test';

  beforeEach(() => {
    service = new StorageService();
    savedString = 'Hello World';
  });

  afterEach(() => {
    localStorage.removeItem(STORAGE_NAME);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get()', () => {
    it('should get an item from localStorage', () => {
      localStorage.setItem(STORAGE_NAME, JSON.stringify(savedString));

      expect(service.get(STORAGE_NAME)).toEqual(savedString);
    });

    it('should return null if there is no item in the localStorage', () => {
      expect(service.get(STORAGE_NAME)).toBeNull();
    });
  });

  describe('set()', () => {
    it('should save an item to localStorage', () => {
      service.set(STORAGE_NAME, savedString);

      expect(JSON.parse(localStorage.getItem(STORAGE_NAME))).toEqual(
        savedString
      );
    });
  });

  describe('delete()', () => {
    it('should delete an item from localStorage', () => {
      service.delete(STORAGE_NAME);

      expect(localStorage.getItem(STORAGE_NAME)).toBeNull();
    });
  });
});
