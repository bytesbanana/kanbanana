import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { XIcon } from '@heroicons/react/solid';

const ManageCardModal = () => {
  const [isBrowse, setIsBrowse] = useState(false);

  useEffect(() => {
    setIsBrowse(true);
  }, []);

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
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>Card name</h3>
              <button
                type='button'
                className='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white'
                data-modal-toggle='defaultModal'
              >
                <XIcon className='w-6 h-6' />
                <span className='sr-only'>Close modal</span>
              </button>
            </div>
            {/* Modal body */}
            <div className='p-6 space-y-6'>Content goes here</div>
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
