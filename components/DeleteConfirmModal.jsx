import { XIcon } from '@heroicons/react/solid';
import React from 'react';
import ReactDOM from 'react-dom';

const DeleteConfirmModal = ({ title, onClose, onConfirm }) => {
  return ReactDOM.createPortal(
    <div className='fixed z-50 flex items-center justify-center w-full overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full'>
      <div className='w-full h-full max-w-2xl p-4 md:h-auto'>
        <div className='relative bg-white rounded-lg shadow dark:bg-gray-700'>
          <div className='flex items-start justify-between p-4'>
            <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
              Are you want to delete card {title} ?
            </h3>
            <button
              type='button'
              className='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white'
              data-modal-toggle='defaultModal'
            >
              <XIcon className='w-6 h-6' onClick={() => onClose()} />
              <span className='sr-only'>Close modal</span>
            </button>
          </div>

          <div className='flex items-center p-6 space-x-2 rounded-b '>
            <button
              data-modal-toggle='defaultModal'
              type='button'
              className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
              onClick={() => onConfirm()}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default DeleteConfirmModal;
