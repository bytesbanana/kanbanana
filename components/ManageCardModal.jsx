import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { PlusIcon, XIcon } from '@heroicons/react/solid';

const SubTaskListItem = ({ data, onToggleCheck }) => {
  const [editMode, setEditMode] = useState(true);
  const [text, setText] = useState('');

  const handleSaveTask = () => {
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  return (
    <>
      <li>
        <div className='inline-flex flex-row items-start w-full gap-2 p-2'>
          <input
            type='checkbox'
            className='w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded-md focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
            checked={data.done ? 'checked' : ''}
            onChange={() => onToggleCheck(data)}
          />
          {editMode && (
            <textarea
              type='text'
              className='flex-auto h-auto p-2 rounded-sm'
              onChange={(e) => setText(e.target.value)}
              onBlur={() => setEditMode(false)}
              value={text}
            />
          )}
          {!editMode && (
            <p className='w-full h-6 cursor-pointer' onClick={() => setEditMode(true)}>
              {text}
            </p>
          )}
        </div>
        {editMode && (
          <div className='flex gap-2 px-9'>
            <button
              className='px-2 py-1 text-sm font-semibold bg-green-600 rounded-md text-slate-50 hover:bg-green-700'
              onClick={handleSaveTask}
            >
              Save
            </button>
            <button
              className='px-2 py-1 text-sm font-semibold rounded-md text-slate-200 hover:bg-slate-500'
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        )}
      </li>
    </>
  );
};

const ManageCardModal = ({ cardData, onCloseModal }) => {
  const [isBrowse, setIsBrowse] = useState(false);
  const [card, setCard] = useState(cardData);

  useEffect(() => {
    setIsBrowse(true);
  }, []);

  const handleAddSubtask = () => {
    const subtask = {
      id: 'subtask_' + Date.now(),
      text: '',
      done: false,
    };

    setCard((prev) => {
      return {
        ...prev,
        subtasks: [...prev.subtasks, subtask],
      };
    });
  };

  const handleToggleCheck = (task) => {
    setCard((prevCard) => {
      const foundedTask = prevCard.subtasks.find((t) => t.id === task.id);
      foundedTask.done = !foundedTask.done;
      return { ...prevCard };
    });
  };

  const renderSubtask = () => {
    return (
      <>
        <ul className='flex flex-col w-full gap-2'>
          {card.subtasks.map((task) => (
            <SubTaskListItem key={task.id} data={task} onToggleCheck={handleToggleCheck} />
          ))}
        </ul>

        <button
          className='inline-flex items-center p-2 text-xs font-semibold rounded-lg bg-slate-600 w-fit text-slate-200 hover:bg-slate-700 hover:text-slate-50'
          onClick={handleAddSubtask}
        >
          <PlusIcon className='w-4 h-4' /> Add new subtask
        </button>
      </>
    );
  };

  if (isBrowse) {
    return ReactDOM.createPortal(
      <div
        id='defaultModal'
        tabIndex={-1}
        className='fixed z-50 flex items-center justify-center w-full overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full'
      >
        <div className='w-full h-full max-w-2xl p-4 md:h-auto'>
          {/* Modal content */}
          <div className='relative bg-white rounded-lg shadow dark:bg-gray-700'>
            {/* Modal header */}
            <div className='flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600'>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>{cardData.title}</h3>
              <button
                type='button'
                className='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white'
                data-modal-toggle='defaultModal'
              >
                <XIcon className='w-6 h-6' onClick={() => onCloseModal()} />
                <span className='sr-only'>Close modal</span>
              </button>
            </div>
            {/* Modal body */}
            <div className='p-4'>
              <div className='flex flex-col gap-2'>
                <h2 className='font-semibold tracking-wider text-md text-slate-100'>Description</h2>
                <textarea name='description' className='w-full p-2 text-white rounded-sm bg-slate-500' rows={5} />
                <div className='flex flex-col gap-2'>
                  <h2 className='font-semibold tracking-wider text-md text-slate-100'>Sub task</h2>
                  <div className='relative w-full h-2 rounded-md bg-slate-400'>
                    <div
                      className='relative h-2 transition-all duration-500 ease-in-out bg-green-400 rounded-md'
                      style={{ width: `${card.done / Math.max(card.total, 1)}%` }}
                    />
                  </div>
                  {renderSubtask()}
                </div>
              </div>
            </div>
            {/* Modal footer */}
            <div className='flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600'>
              <button
                data-modal-toggle='defaultModal'
                type='button'
                className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
              >
                Save
              </button>
              <button
                data-modal-toggle='defaultModal'
                type='button'
                className='text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600'
                onClick={() => onCloseModal()}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>,
      document.getElementById('modal-root')
    );
  }
  return null;
};

export default ManageCardModal;
