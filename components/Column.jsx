import React, { useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import AddNewCardForm from './AddNewCardForm';
import ManageCardModal from './ManageCardModal';

const ColumnHeader = ({ data }) => {
  if (!data) return <></>;
  return (
    <div className='flex items-center gap-2 p-1 text-sm font-medium text-slate-500'>
      <div className={`rounded-full w-3 h-3`} style={{ backgroundColor: data.color }} />
      {data.name} ({data.cards.length})
    </div>
  );
};

const CardList = React.forwardRef(({ children, ...rest }, ref) => (
  <ul ref={ref} {...rest}>
    {children}
  </ul>
));
CardList.displayName = 'CardList';

const Column = ({ data, boardName }) => {
  const [showManageCard, setShowManageCard] = useState(false);

  return (
    <>
      <div className='flex  flex-col min-w-[300px] max-w-[300px] p-4' key={data.name}>
        <ColumnHeader data={data} />
        <Droppable droppableId={data.id}>
          {(provided) => (
            <CardList {...provided.droppableProps} ref={provided.innerRef} className='flex flex-col flex-1 gap-2'>
              {data.cards.map((card, index) => (
                <Draggable key={card.id} draggableId={card.id} index={index} id={card.id}>
                  {(provided) => (
                    <li
                      key={card.id}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className='p-4 rounded-md select-none bg-neutral-800 hover:bg-neutral-700'
                      onClick={() => setShowManageCard(true)}
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

              <AddNewCardForm boardName={boardName} columnId={data.id} />
            </CardList>
          )}
        </Droppable>
        {!showManageCard && <ManageCardModal />}
      </div>
    </>
  );
};

export default Column;
