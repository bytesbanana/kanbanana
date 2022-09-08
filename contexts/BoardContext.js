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
  BOARD_DELETE: 'BOARD_DELETE',
  COLUMN_ADD: 'COLUMN_ADD',
  CARD_ADD: 'CARD_ADD',
  CARD_MOVE: 'CARD_MOVE',
  CARD_UPDATE: 'CARD_UPDATE',
  CARD_DELETE: 'CARD_DELETE',
};

function useAppContext() {
  return useContext(AppContext);
}

function appReducer(state, action) {
  let newState;
  let cardIndex;

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
    case AppAction.BOARD_DELETE:
      const colToDelete = [];

      const newColumns = state.columns.filter((col) => {
        const isSameId = col.boardId !== payload.boardId;
        if (isSameId) {
          colToDelete.push(col.id);
        }
        return isSameId;
      });

      const newCards = state.cards.filter((card) => {
        return !colToDelete.includes(card.columnId);
      });

      const newBoards = state.boards.filter((b) => b.id !== payload.boardId);

      return {
        ...state,
        boards: newBoards,
        columns: newColumns,
        cards: newCards,
      };
    case AppAction.COLUMN_ADD:
      newState = JSON.parse(JSON.stringify({ ...state }));
      newState.columns.push(payload);
      return newState;
    case AppAction.CARD_ADD:
      newState = JSON.parse(JSON.stringify({ ...state }));
      newState.cards.push(payload);
      return newState;

    case AppAction.CARD_MOVE:
      newState = JSON.parse(JSON.stringify({ ...state }));
      let tempIndex = 0;

      const indexToSplice = newState.cards.findIndex((c) => {
        const isColMatch = c.columnId === payload.source.droppableId;
        const isIndexMatch = tempIndex === payload.source.index;
        if (isColMatch) {
          tempIndex += 1;
        }
        return isColMatch && isIndexMatch;
      });

      tempIndex = 0;
      const indexToPlace = newState.cards.findIndex((c) => {
        const isColMatch = c.columnId === payload.destination.droppableId;
        const isIndexMatch = tempIndex === payload.destination.index;
        if (isColMatch) {
          tempIndex += 1;
        }
        return isColMatch && isIndexMatch;
      });

      const cardToMove = newState.cards.splice(indexToSplice, 1)[0];

      newState.cards.splice(Math.max(0, indexToPlace), 0, cardToMove);

      return newState;
    case AppAction.CARD_UPDATE:
      newState = JSON.parse(JSON.stringify({ ...state }));
      cardIndex = newState.cards.findIndex((c) => c.id === payload.id);
      newState.cards[cardIndex] = payload;
      return newState;
    case AppAction.CARD_DELETE:
      newState = JSON.parse(JSON.stringify({ ...state }));
      cardIndex = newState.cards.findIndex((c) => c.id === payload.id);
      newState.cards.splice(cardIndex, 1);
      return newState;
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
