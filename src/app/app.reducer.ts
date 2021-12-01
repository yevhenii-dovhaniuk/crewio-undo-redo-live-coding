import { createAction, createFeatureSelector, createReducer, createSelector, on, props } from '@ngrx/store';
import { Square } from './app.model';


export const appFeatureKey = 'app';

export interface State {
  squares: Square[];
  actionsPerformed: string[];
  squaresHistory: Square[][];
  undoCount: number;
}

export const initialState: State = {
  squares: [],
  actionsPerformed: [],
  squaresHistory: [],
  undoCount: 0
};

export const addSquare = createAction('Add Square', props<{ square: Square }>());
export const moveSquare = createAction('Move Square', props<{ id: string, x: number, y: number }>());
export const deleteSquare = createAction('Delete Square', props<{ id: string }>());

export const undo = createAction('Undo');
export const redo = createAction('Redo');


// s: [{id: 1}], h: [{id: 1}]
// ADD
// s: [{id:1}, {id: 2}], h: [[{id: 1}], [{id:1}, {id: 2}]]
// ADD
// s: [{id: 1}, {id: 2}, {id: 3}], h: [[{id: 1}], [{id: 1}, {id: 2}], [{id: 1}, {id: 2}, {id: 3}]]
// UNDO
// s: [{id: 1}, {id: 2}], h: [[{id: 1}], [{id: 1}, {id: 2}], [{id: 1}, {id: 2}, {id: 3}]]
// ADD
// s: [{id: 1}, {id: 2}, {id: 4}], h: [[{id: 1}], [{id: 1}, {id: 2}], [{id: 1}, {id: 2}, {id: 4}]]

export const reducer = createReducer(
  initialState,
  on(addSquare, (state, action) => {
    const squaresHistory = state.squares;
    const copy = [...state.squaresHistory];
    copy.push(squaresHistory);

    return ({
      ...state,
      squares: state.squares.concat(action.square),
      actionsPerformed: state.actionsPerformed.concat(action.type),
      squaresHistory: copy,
      undoCount: 0
    });
  }),
  on(moveSquare, (state, action) => {
    const squaresHistory = state.squares;


    const squareIndex = state.squares.findIndex(square => square.id === action.id);
    const square = state.squares[squareIndex];
    const updatedSquare = {...square, x: action.x, y: action.y};
    const updatedSquares = [...state.squares];
    updatedSquares[squareIndex] = updatedSquare;

    return ({...state, squares: updatedSquares, squaresHistory: state.squaresHistory.concat(squaresHistory), undoCount: 0});
  }),
  on(deleteSquare, (state, action) => {
    const squaresHistory = state.squares;
    return ({...state,
      squares: state.squares.filter(square => square.id === action.id),
      squaresHistory: state.squaresHistory.concat(squaresHistory),
      undoCount: 0
    });
  }),
  on(undo, (state) => {
    const updatedUndoCount = state.undoCount++;
    const historySquareState = state.squaresHistory[state.squaresHistory.length - 1 - updatedUndoCount];
    return {...state, squares: historySquareState, undoCount: updatedUndoCount}
  }),
  on(redo, (state) => {
    const updatedUndoCount = state.undoCount--;
    const historySquareState = state.squaresHistory[state.squaresHistory.length - 1 - updatedUndoCount];
    return {...state, squares: historySquareState, undoCount: updatedUndoCount}
  })
);

export const selectAppFeature = createFeatureSelector<State>(appFeatureKey);
export const selectAppSquares = createSelector(selectAppFeature, state => state.squares);


