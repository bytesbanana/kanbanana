import { createContext, useContext, useEffect, useReducer } from 'react';
import * as _ from 'lodash';
import useIsMounted from '../hooks/useIsMouted';

import usePrevious from '../hooks/usePrevious';

const initialState = {
  boards: [],
  columns: [],
  cards: [],
  selectedCard: null,
  showModal: false,
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
  MODAL_SHOW: 'MODAL_SHOW',
  MODAL_HIDE: 'MODAL_HIDE',
};

function useAppContext() {
  return useContext(AppContext);
}

function appReducer(state, action) {
  let newState;

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
    case AppAction.MODAL_SHOW:
      return {
        ...state,
        selectedCard: payload,
        showModal: true,
      };
    case AppAction.MODAL_HIDE:
      return {
        ...state,
        selectedCard: null,
        showModal: false,
      };
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
