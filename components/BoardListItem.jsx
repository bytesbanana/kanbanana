import { ViewBoardsIcon, XIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import { useState } from 'react';
import { AppAction, useAppContext } from '../contexts/BoardContext';
import DeleteConfirmModal from './DeleteConfirmModal';

const BoardListItem = ({ board }) => {
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { dispatch } = useAppContext();

  const handleDeleteBoard = (boardId) => {
    dispatch({
      type: AppAction.BOARD_DELETE,
      payload: {
        boardId,
      },
    });
    setShowDeleteModal(false);
  };

  return (
    <>
      <Link href={`/board/${board.name}`}>
        <li
          className='inline-flex gap-1 font-semibold text-white transition-colors cursor-pointer hover:text-purple-600'
          onMouseEnter={() => setShowDeleteIcon(true)}
          onMouseLeave={() => setShowDeleteIcon(false)}
        >
          <ViewBoardsIcon className='w-6 h-6' />
          <div className='flex-1'>{board.name}</div>
          <XIcon
            className='w-6 h-6 text-white transition-all hover:text-red-400'
            style={{ opacity: showDeleteIcon ? 1 : 0 }}
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteModal((p) => !p);
            }}
          />
        </li>
      </Link>
      {showDeleteModal && (
        <DeleteConfirmModal
          title={`Are you want to delete board ${board.name} ?`}
          onConfirm={() => handleDeleteBoard(board.id)}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </>
  );
};

export default BoardListItem;
