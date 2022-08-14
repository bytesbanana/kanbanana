import { createContext, useContext, useEffect, useReducer } from 'react';
import useIsMounted from '../hooks/useIsMouted';

import usePrevious from '../hooks/usePrevious';

const BoardContext = createContext({
  state: {},
  dispatch: () => {},
});

const BoardAction = {
  BOARD_SET: 'BOARD_SET',
  BOARD_ADD: 'BOARD_ADD',
  COLUMN_ADD: 'COLUMN_ADD',
  CARD_ADD: 'CARD_ADD',
  CARD_MOVE: 'CARD_MOVE',
};

function useBoardContext() {
  return useContext(BoardContext);
}

const initialState = {
  boards: [],
};

function boardReducer(state, action) {
  let newState;
  let board;
  let column;
  const { type, payload } = action;

  switch (type) {
    case BoardAction.BOARD_SET:
      return {
        ...state,
        boards: payload,
      };
    case BoardAction.BOARD_ADD:
      return {
        ...state,
        boards: [...(state?.boards || []), payload],
      };

    case BoardAction.COLUMN_ADD:
      newState = JSON.parse(JSON.stringify({ ...state }));

      board = (newState.boards || []).find((b) => b.name === payload.boardName);
      board.columns.push(payload.column);
      return newState;
    case BoardAction.CARD_ADD:
      newState = JSON.parse(JSON.stringify({ ...state }));
      board = newState.boards.find((b) => b.name === payload.boardName);
      column = board.columns.find((c) => c.id === payload.columnId);
      column.cards.push(payload.card);
      return newState;

    case BoardAction.CARD_MOVE:
      const { boardName, source, destination } = payload;
      newState = JSON.parse(JSON.stringify({ ...state }));

      board = newState.boards.find((b) => b.name === boardName);
      //POP Source Column
      const srcColumn = board.columns.find((c) => c.id === source.droppableId);
      const srcCard = srcColumn.cards[source.index];
      srcColumn.cards.splice(source.index, 1);

      const desColumn = board.columns.find((c) => c.id === destination.droppableId);
      desColumn.cards.splice(destination.index, 0, srcCard);

      return newState;
    case BoardAction.default:
      return state;
  }
}

const APP_DATA_KEY = 'KANBANANA_DATA';

const BoardContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(boardReducer);
  const prevState = usePrevious(state);
  const isMounted = useIsMounted();

  useEffect(() => {
    if (!isMounted()) return;
    if (!localStorage) return;
    let appData = initialState;
    try {
      appData = JSON.parse(localStorage.getItem(APP_DATA_KEY));
    } catch {}

    localStorage.setItem(APP_DATA_KEY, JSON.stringify(appData));
    dispatch({
      type: BoardAction.BOARD_SET,
      payload: appData?.boards,
    });
  }, [isMounted]);

  useEffect(() => {
    if (JSON.stringify(state) === JSON.stringify(prevState)) return;
    localStorage.setItem(APP_DATA_KEY, JSON.stringify(state));

    dispatch({
      type: BoardAction.BOARD_SET,
      payload: state.boards,
    });
  }, [state, prevState]);

  return <BoardContext.Provider value={{ state, dispatch }}>{children}</BoardContext.Provider>;
};

export { useBoardContext, BoardContextProvider, BoardAction };
