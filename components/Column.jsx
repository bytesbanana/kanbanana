import { TrashIcon, XIcon } from '@heroicons/react/solid';
import React, { useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { AppAction, useAppContext } from '../contexts/BoardContext';
import AddNewCardForm from './AddNewCardForm';
import ManageCardModal from './ManageCardModal';
import DeleteConfirmModal from './DeleteConfirmModal';

const ColumnHeader = ({ columnName, columnSize, color, onDeleteClick }) => {
  return (
    <div className='flex items-center justify-between gap-2 p-1 text-sm font-medium text-slate-500'>
      <div className='inline-flex items-center gap-1'>
        <div className={`rounded-full w-3 h-3`} style={{ backgroundColor: color }} />
        {columnName} ({columnSize})
      </div>
      <TrashIcon className='w-5 h-5 text-red-100 transition-colors hover:text-red-300' onClick={onDeleteClick} />
    </div>
  );
};

const CardList = React.forwardRef(({ children, ...rest }, ref) => (
  <ul ref={ref} {...rest}>
    {children}
  </ul>
));
CardList.displayName = 'CardList';

const Column = ({ columnId, boardName }) => {
  const [showManageCardModal, setShowManageCardModal] = useState(false);
  const [showDeleteCardModal, setShowDeleteCardModal] = useState(false);
  const [showDeleteColumnModal, setShowDeleteColumModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState();
  const { state, dispatch } = useAppContext();
  const { columns } = state;
  const columnData = state.columns.find((col) => col.id === columnId);
  const filteredCard = state.cards.filter((card) => card.columnId === columnId);

  const handleSaveCard = (data) => {
    dispatch({
      type: AppAction.CARD_UPDATE,
      payload: data,
    });
    setShowManageCardModal(false);
  };

  const handleDeleteCardClick = (card) => {
    setSelectedCard(card);
    setShowDeleteCardModal(true);
  };

  const handleCloseDeleteCardModal = () => {
    setShowDeleteCardModal(false);
  };

  const handleDeleteCard = (id) => {
    setShowDeleteCardModal(false);
    dispatch({
      type: AppAction.CARD_DELETE,
      payload: {
        id,
      },
    });
  };

  return (
    <>
      <div className='flex  flex-col min-w-[300px] max-w-[300px] p-4' key={columnData.name}>
        <ColumnHeader
          columnName={columnData.name}
          columnSize={columns.length}
          color={columnData.color}
          onDeleteClick={() => setShowDeleteColumModal(true)}
        />
        <Droppable droppableId={columnId}>
          {(provided) => (
            <CardList {...provided.droppableProps} ref={provided.innerRef} className='flex flex-col flex-1 gap-2'>
              {filteredCard.map((card, index) => (
                <Draggable key={card.id} draggableId={card.id} index={index} id={card.id}>
                  {(provided) => (
                    <li
                      key={card.id}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className='relative p-4 rounded-md select-none bg-neutral-800 hover:bg-neutral-700'
                      onClick={() => {
                        setSelectedCard(card);
                        setShowManageCardModal(true);
                      }}
                    >
                      <h2 className='text-lg font-semibold tracking-wide text-slate-300'>{card.title}</h2>
                      <XIcon
                        className='absolute top-0 right-0 w-5 h-5 m-2 transition-colors text-slate-300 hover:text-white hover:scale-110'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCardClick(card);
                        }}
                      />
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

              <AddNewCardForm boardName={boardName} columnId={columnId} />
            </CardList>
          )}
        </Droppable>
        {showManageCardModal && (
          <ManageCardModal
            cardData={selectedCard}
            onSave={handleSaveCard}
            onCloseModal={() => setShowManageCardModal(false)}
          />
        )}
        {showDeleteCardModal && (
          <DeleteConfirmModal
            title={`Are you want to delete card ${selectedCard?.title} ?`}
            onConfirm={() => handleDeleteCard(selectedCard.id)}
            onClose={handleCloseDeleteCardModal}
          />
        )}
        {showDeleteColumnModal && (
          <DeleteConfirmModal
            title={`Are you want to delete column ${columnData.name}?`}
            onConfirm={() =>
              dispatch({
                type: AppAction.COLUMN_DELETE,
                payload: {
                  columnId,
                },
              })
            }
            onClose={() => setShowDeleteColumModal(false)}
          />
        )}
      </div>
    </>
  );
};

export default Column;
