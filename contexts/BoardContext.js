import { createContext, useContext, useEffect, useReducer } from 'react';
import * as _ from 'lodash';
import useIsMounted from '../hooks/useIsMouted';

import usePrevious from '../hooks/usePrevious';

const initialState = {
  boards: [],
  columns: [],
  cards: [],
};

const AppContext = createContext({
  state: initialState,
  dispatch: () => {},
});

const AppAction = {
  SAVE_DATA: 'SAVE_DATA',
  BOARD_ADD: 'BOARD_ADD',
  COLUMN_ADD: 'COLUMN_ADD',
  CARD_ADD: 'CARD_ADD',
  CARD_MOVE: 'CARD_MOVE',
};

function useAppContext() {
  return useContext(AppContext);
}

function appReducer(state, action) {
  let newState;
  let board;
  let column;
  const { type, payload } = action;

  switch (type) {
    case AppAction.SAVE_DATA:
      return {
        ...state,
        ...payload,
      };
    case AppAction.BOARD_ADD:
      return {
        ...state,
        boards: [...(state?.boards || []), payload],
      };
      A;
    case AppAction.COLUMN_ADD:
      newState = JSON.parse(JSON.stringify({ ...state }));
      newState.columns.push(payload);
      return newState;
    // case BoardAction.CARD_ADD:
    //   newState = JSON.parse(JSON.stringify({ ...state }));
    //   board = newState.boards.find((b) => b.name === payload.boardName);
    //   column = board.columns.find((c) => c.id === payload.columnId);
    //   column.cards.push(payload.card);
    //   return newState;

    // case BoardAction.CARD_MOVE:
    //   const { boardName, source, destination } = payload;
    //   newState = JSON.parse(JSON.stringify({ ...state }));

    //   board = newState.boards.find((b) => b.name === boardName);
    //   //POP Source Column
    //   const srcColumn = board.columns.find((c) => c.id === source.droppableId);
    //   const srcCard = srcColumn.cards[source.index];
    //   srcColumn.cards.splice(source.index, 1);

    //   const desColumn = board.columns.find((c) => c.id === destination.droppableId);
    //   desColumn.cards.splice(destination.index, 0, srcCard);

    //   return newState;
    default:
      return state;
  }
}

const APP_DATA_KEY = 'KANBANANA_DATA';

const AppContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer);
  const prevState = usePrevious(state);
  const isMounted = useIsMounted();

  useEffect(() => {
    if (!isMounted()) return;
    if (!localStorage) return;
    let appData = initialState;
    try {
      appData = JSON.parse(localStorage.getItem(APP_DATA_KEY));
    } catch {}
    appData = _.isEmpty(appData) ? initialState : appData;

    localStorage.setItem(APP_DATA_KEY, JSON.stringify(appData));

    dispatch({
      type: AppAction.SAVE_DATA,
      payload: appData,
    });
  }, [isMounted]);

  useEffect(() => {
    if (JSON.stringify(state) === JSON.stringify(prevState)) return;
    localStorage.setItem(APP_DATA_KEY, JSON.stringify(state || initialState));

    dispatch({
      type: AppAction.SAVE_DATA,
      payload: state || initialState,
    });
  }, [state, prevState]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

export { useAppContext, AppContextProvider, AppAction };
