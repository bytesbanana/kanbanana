import React from 'react';
import { useRouter } from 'next/router';
import { PlusIcon, DotsVerticalIcon } from '@heroicons/react/solid';
import { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import { useEffect } from 'react';

const BoardHeader = ({ boardName }) => (
  <div className='flex justify-between w-full px-4 pt-4 pb-6 select-none bg-neutral-800'>
    <h1 className='text-3xl font-bold tracking-widest text-white'>{boardName}</h1>
    <div className='flex items-center gap-2'>
      <DotsVerticalIcon className='w-6 h-6 transition-colors cursor-pointer text-slate-200 hover:text-purple-600' />
    </div>
  </div>
);

const MOCK_DATA = [
  {
    id: 'todo',
    color: 'grey',
    name: 'TODO',
    cards: [{ id: '1', title: 'Title', total: 5, done: 3 }],
  },
  {
    id: 'doing',
    color: 'yellow',
    name: 'DOING',
    cards: [{ id: '3', title: 'Title', total: 5, done: 3 }],
  },
  {
    id: 'done',
    color: 'green',
    name: 'DONE',
    cards: [],
  },
];

const ColumnHeader = ({ colData }) => {
  if (!colData) return <></>;
  return (
    <div className='flex items-center gap-2 p-1 text-sm font-medium text-slate-500'>
      <div className={`rounded-full w-3 h-3`} style={{ backgroundColor: colData.color }} />
      {colData.name} ({colData.cards.length})
    </div>
  );
};

const KANBANK_PREFIX = 'kanbanana_';

const Board = () => {
  const router = useRouter();
  const { boardName } = router.query;
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    if (!router.isReady) return;
    if (!localStorage) return;
    const data = JSON.parse(localStorage.getItem(KANBANK_PREFIX + boardName));
    if (data) {
      setColumns(JSON.parse(localStorage.getItem(KANBANK_PREFIX + boardName)));
    } else {
      localStorage.setItem(KANBANK_PREFIX + boardName, JSON.stringify(MOCK_DATA));
      setColumns(MOCK_DATA);
    }
  }, [router, boardName]);

  useEffect(() => {
    if (!localStorage) return;
    if (!boardName) return;
    localStorage.setItem(KANBANK_PREFIX + boardName, JSON.stringify(columns));
  }, [columns, boardName]);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const cols = JSON.parse(JSON.stringify(columns));
    const { source, destination } = result;
    const srcColIndex = -1;
    const srcColData = cols.find((col, index) => {
      if (col.id === source.droppableId) srcColIndex = index;
      return col.id === source.droppableId;
    });
    const srcCard = srcColData.cards.find((_, index) => index === source.index);
    srcColData.cards.splice(source.index, 1);

    const desColIndex = -1;
    const desColData = cols.find((col, index) => {
      if (col.id === destination.droppableId) desColIndex = index;
      return col.id === destination.droppableId;
    });

    desColData.cards.splice(destination.index, 0, srcCard);
    cols[srcColIndex] = srcColData;
    cols[desColIndex] = desColData;

    setColumns(cols);
  };

  return (
    <div className='flex flex-col w-full bg-neutral-900'>
      <BoardHeader boardName={boardName}/>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className='flex flex-1 select-none'>
          {columns.map((col) => (
            <div className='flex  flex-col w-[300px] p-4 ' key={col.name}>
              <ColumnHeader colData={col} />
              <Droppable droppableId={col.id}>
                {(provided) => (
                  <ul {...provided.droppableProps} ref={provided.innerRef} className='flex flex-col flex-1 gap-2'>
                    {col.cards.map((card, index) => (
                      <Draggable key={card.id} draggableId={card.id} index={index} id={card.id}>
                        {(provided) => (
                          <li
                            key={card.id}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className='p-4 rounded-md select-none bg-neutral-800'
                          >
                            <h2 className='text-lg font-semibold tracking-wide text-slate-300'>{card.title}</h2>
                            {card.total === 0 && <p className='text-sm text-slate-500'>have no subtask</p>}
                            {card.total > 0 && (
                              <p className='text-sm text-slate-500'>
                                {card.done} of {card.total} subtasks
                              </p>
                            )}
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </div>
          ))}

          <div className='w-[300px] px-4 pt-4 mx-4 mt-11 bg-neutral-800 rounded-t-md flex items-center justify-center'>
            <button className='inline-flex items-center justify-center p-4 font-semibold transition text-slate-400 hover:scale-110'>
              <PlusIcon className='w-4 h-4' />
              New Column
            </button>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default Board;
