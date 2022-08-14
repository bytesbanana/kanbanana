import { PlusIcon } from '@heroicons/react/solid';
import React from 'react';
import { useState } from 'react';
import { BoardAction, useBoardContext } from '../contexts/BoardContext';

const buildNewCard = (title) => ({
  id: 'card_' + Date.now(),
  title,
  total: 0,
  done: 0,
});

const AddNewCardForm = ({ boardName, columnId }) => {
  const [showForm, setShowForm] = useState(false);
  const [cardTitle, setCardTitle] = useState('');
  const { state, dispatch } = useBoardContext();

  const handleAddNewCard = () => {
    dispatch({
      type: BoardAction.CARD_ADD,
      payload: {
        boardName,
        columnId,
        card: buildNewCard(cardTitle),
      },
    });
    resetForm();
  };

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'Enter':
        if (!cardTitle) break;
        dispatch({
          type: BoardAction.CARD_ADD,
          boardName,
          columnId,
          card: buildNewCard(title),
        });
        resetForm();
        break;
      case 'Escape':
        resetForm();
        break;
      default:
        break;
    }
  };

  const resetForm = () => {
    setCardTitle('');
    setShowForm(false);
  };

  return (
    <div className='p-2 rounded-md bg-neutral-800'>
      {showForm && (
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type='text'
            className='w-full px-2 py-1 text-white rounded-md bg-neutral-700'
            placeholder='Enter card title'
            onChange={(e) => setCardTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            value={cardTitle}
          />

          <div className='inline-flex justify-end w-full gap-2 py-1'>
            <button
              className='inline-flex items-center px-2 py-1 text-white transition-colors bg-green-600 rounded-md hover:bg-green-700'
              onClick={handleAddNewCard}
            >
              <PlusIcon className='w-4 h-4' /> Add
            </button>
            <button
              className='inline-flex items-center gap-1 px-2 py-1 text-white transition-colors bg-red-500 rounded-md hover:bg-red-600'
              onClick={() => {
                resetForm();
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      {!showForm && (
        <button
          className='inline-flex items-center gap-1 font-semibold text-slate-300'
          onClick={() => setShowForm(true)}
        >
          <PlusIcon className='w-4 h-4' />
          Add card
        </button>
      )}
    </div>
  );
};

export default AddNewCardForm;
