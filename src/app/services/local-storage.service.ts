import {Injectable} from '@angular/core';

function _localStorage() : any {
  // return the global native browser local storage object
  return localStorage;
}

@Injectable()
export class LocalStorageService {

  // getter for native local storage
  get nativeLocalStorage(): any {
    return _localStorage();
  }

}
