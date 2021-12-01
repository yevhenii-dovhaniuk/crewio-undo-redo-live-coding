import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { addSquare, selectAppSquares, State } from './app.reducer';
import { Observable, of } from 'rxjs';
import { Square } from './app.model';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit{
  title = 'undoredo';
  squares$: Observable<Square[]> = of([]);

  isModalShown = false;
  squareCreationFormGroup: FormGroup = new FormGroup({});

  constructor(private store: Store<State>) {
  }

  ngOnInit(): void {
    this.squares$ = this.store.select(selectAppSquares);
    this.squareCreationFormGroup.addControl('id', new FormControl(''));
    this.squareCreationFormGroup.addControl('x', new FormControl(0));
    this.squareCreationFormGroup.addControl('y', new FormControl(0));
    this.squareCreationFormGroup.addControl('length', new FormControl(0));
  }


  addSquare() {
    const id = '' + Math.random() * 100000;
    const square = {id, x: 0, y: 0, length: 100};
    this.store.dispatch(addSquare({square}))
  }
}
