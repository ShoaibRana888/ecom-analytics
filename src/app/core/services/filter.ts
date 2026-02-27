import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FilterService {
  range$ = new BehaviorSubject<number>(30);

  setRange(days: number) {
    this.range$.next(days);
  }
}