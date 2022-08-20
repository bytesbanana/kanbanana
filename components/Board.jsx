import React from 'react';
import { useRouter } from 'next/router';
import { PlusIcon, DotsVerticalIcon, XIcon } from '@heroicons/react/solid';
import { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useEffect } from 'react';
import { useRef } from 'react';

import Column from './Column';
import { AppAction, useAppContext } from '../contexts/BoardContext';

const BoardHeader = ({ boardName }) => (
  <div className='flex justify-between px-4 pt-4 pb-6 select-none bg-neutral-800'>
    <h1 className='text-3xl font-bold tracking-widest text-white'>{boardName}</h1>
    <div className='flex items-center gap-2'>
      <DotsVerticalIcon className='w-6 h-6 transition-colors cursor-pointer text-slate-200 hover:text-purple-600' />
    </div>
  </div>
);

const Board = () => {
  const router = useRouter();
  const { boardName } = router.query;

  const [isAddNewColumn, setIsAddNewColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  const columnListRef = useRef();
  const { state, dispatch } = useAppContext();
  const board = state?.boards?.find((b) => b.name === boardName);

  const { columns } = state || [];

  useEffect(() => {
    if (!router.isReady) return;
    if (board) return;

    router.replace('/');
  }, [router, board]);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    // dispatch({
    //   type: AppAction.CARD_MOVE,
    //   payload: {
    //     destination: result.destination,
    //     source: result.source,
    //     boardName,
    //   },
    // });
  };

  const handleAddColumn = () => {
    const newColId = 'col_' + Date.now();

    if (!newColumnName) return;
    const existCol = columns?.find((col) => col.name === newColumnName);
    if (existCol) return;

    dispatch({
      type: AppAction.COLUMN_ADD,
      payload: {
        id: newColId,
        color: 'grey',
        name: newColumnName,
        boardId: board.id,
      },
    });
    setNewColumnName('');
    setIsAddNewColumn(false);
  };

  // useEffect(() => {
  //   const childrenLength = columnListRef.current?.children?.length;
  //   if (childrenLength <= 1) return;

  //   columnListRef.current?.children[childrenLength - 1].scrollIntoView({
  //     behavior: 'smooth',
  //   });
  // }, [columns]);

  return (
    <div className='flex flex-col bg-neutral-900 max-w-[calc(100vw-250px)] w-full'>
      <BoardHeader boardName={boardName} />
      <DragDropContext onDragEnd={onDragEnd}>
        <div className='flex flex-1 overflow-scroll select-none' ref={columnListRef}>
          {columns &&
            columns.length > 0 &&
            columns.map((col) => <Column boardName={boardName} columnId={col.id} key={col.id} />)}

          <div className='min-w-[300px] max-w-[300px] h-fit p-2 mx-4 mt-11 bg-neutral-800 rounded-md flex items-center justify-center'>
            {!isAddNewColumn && (
              <button
                className='inline-flex items-center justify-center p-4 font-semibold transition text-slate-400 hover:scale-110'
                onClick={() => setIsAddNewColumn(true)}
              >
                <PlusIcon className='w-4 h-4' />
                New Column
              </button>
            )}

            {isAddNewColumn && (
              <form onSubmit={(e) => e.preventDefault()} className=''>
                <input
                  type='text'
                  className='p-2 text-white rounded-md bg-neutral-500'
                  onChange={(e) => setNewColumnName(e.target.value)}
                  value={newColumnName}
                  placeholder='Enter column name'
                />
                <div className='flex items-center justify-start gap-2 py-2'>
                  <button
                    className='p-1 px-2 transition-colors bg-green-500 rounded-md text-slate-500 hover:bg-green-700 hover:text-green-200'
                    onClick={() => handleAddColumn()}
                  >
                    Add column
                  </button>
                  <XIcon
                    className='w-6 h-6 font-semibold text-red-300 cursor-pointer hover:scale-105'
                    onClick={() => setIsAddNewColumn(false)}
                  />
                </div>
              </form>
            )}
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default Board;
