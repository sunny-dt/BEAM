import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class StorageService {

  constructor() {}

  removeLocalStorageByItems(localStorageItems: any) {

    for (let i = 0; i < localStorageItems.length; i++) {

      localStorage.removeItem(localStorageItems[i]);
    }
  }
}