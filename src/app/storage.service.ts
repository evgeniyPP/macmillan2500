import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  public get(name: string) {
    return JSON.parse(localStorage.getItem(name) || 'null');
  }

  public set(name: string, data: any) {
    return localStorage.setItem(name, JSON.stringify(data));
  }

  public delete(name: string) {
    return localStorage.removeItem(name);
  }
}
