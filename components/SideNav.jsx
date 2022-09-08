import React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { PlusCircleIcon, XIcon } from '@heroicons/react/solid';
import { AppAction, useAppContext } from '../contexts/BoardContext';
import BoardListItem from './BoardListItem';

const AddBoardForm = ({ boards, toggleAddMode, onAddBoard }) => {
  const [isAddError, setIsAddError] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');

  const handleBoardNameChange = (e) => {
    setNewBoardName(e.target.value);
    setIsAddError(false);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && newBoardName) {
      setIsAddError(false);
      if (boards?.find((b) => b.name === newBoardName)) {
        setIsAddError(true);
        return;
      }
      onAddBoard({
        id: Date.now(),
        name: newBoardName,
      });
      setNewBoardName('');
    }
  };

  return (
    <>
      <form className='flex flex-col items-center gap-1' onSubmit={(e) => e.preventDefault()}>
        <div className='inline-flex items-center'>
          <input
            className={`w-full px-4 py-1 leading-tight text-gray-700 bg-gray-200 border-2 border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-purple-500`}
            id='new-board-name'
            type='text'
            placeholder='New board name'
            onChange={handleBoardNameChange}
            onKeyDown={handleInputKeyDown}
            autoComplete='off'
            value={newBoardName}
          />
          <XIcon
            className='w-6 h-6 text-red-300 transition hover:scale-110'
            onClick={() => {
              toggleAddMode(false);
              setNewBoardName('');
            }}
          />
        </div>
        <span className='w-full text-xs text-slate-500'>Press enter to create.</span>
      </form>
      {isAddError && <p className='font-semibold text-red-500'>Board name already exists</p>}
    </>
  );
};

const CreateNewBoardButton = ({ toggleAddMode }) => (
  <li
    className='inline-flex gap-1 font-semibold text-purple-500 transition-colors cursor-pointer hover:text-white'
    onClick={() => toggleAddMode(true)}
  >
    <PlusCircleIcon className='w-6 h-6' /> Create New Board
  </li>
);

const SideNavHeader = React.forwardRef((_, ref) => (
  <h1
    ref={ref}
    className='flex items-center gap-2 text-3xl font-extrabold text-center text-transparent text-white lowercase shadow-2xl bg-gradient-to-r from-purple-500 to-yellow-500 bg-clip-text drop-shadow-2xl'
  >
    Kanbanana
  </h1>
));

SideNavHeader.displayName = 'SideNavHeader';

const SideNav = () => {
  const { state, dispatch } = useAppContext();
  const [addMode, toggleAddMode] = useState(false);

  const { boards } = state || {};

  const handleOnAddBoard = (newBoard) => {
    dispatch({
      type: AppAction.BOARD_ADD,
      payload: newBoard,
    });
  };

  return (
    <div className='w-[250px] min-w-[250px] bg-neutral-800 drop-shadow-2xl'>
      <div className='flex justify-center p-4 cursor-pointer'>
        <Link href='/'>
          <SideNavHeader />
        </Link>
      </div>
      <div className='p-4'>
        <h2 className='text-xs font-semibold tracking-widest uppercase text-slate-300'>
          all boards ({boards?.length || 0})
        </h2>
        <ul className='flex flex-col gap-2 p-1'>
          {boards && boards.length > 0 && boards?.map((board, index) => <BoardListItem key={board.id} board={board} />)}
          {!addMode && <CreateNewBoardButton toggleAddMode={toggleAddMode} />}
          {addMode && <AddBoardForm boards={boards} toggleAddMode={toggleAddMode} onAddBoard={handleOnAddBoard} />}
        </ul>
      </div>
    </div>
  );
};

export default SideNav;
