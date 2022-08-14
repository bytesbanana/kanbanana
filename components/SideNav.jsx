import React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { ViewBoardsIcon, PlusCircleIcon, XIcon } from '@heroicons/react/solid';
import useLocalStorage from '../hooks/useLocalStorage';

const BoardListItem = ({ children }) => (
  <Link href={`/board/${children}`}>
    <li className='inline-flex gap-1 font-semibold text-white transition-colors cursor-pointer hover:text-purple-600'>
      <ViewBoardsIcon className='w-6 h-6' />
      {children}
    </li>
  </Link>
);

const SideNav = () => {
  const [boards, setBoards] = useLocalStorage('board', []);
  const [addMode, toggleAddMode] = useState(false);
  const [newBoard, setNewBoard] = useState('');
  const [isAddError, setIsAddError] = useState(false);

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && newBoard) {
      setIsAddError(false);
      if (boards.find((b) => b === newBoard)) {
        setIsAddError(true);
        return;
      }
      setBoards([...boards, newBoard]);
      setNewBoard('');
    }
  };

  const handleBoardNameChange = (e) => {
    setNewBoard(e.target.value);
    setIsAddError(false);
  };

  return (
    <div className='w-[250px] min-w-[250px] bg-neutral-800 drop-shadow-2xl'>
      <div className='flex justify-center p-4 cursor-pointer'>
        <Link href='/'>
          <h1 className='flex items-center gap-2 text-3xl font-extrabold text-center text-transparent text-white lowercase shadow-2xl bg-gradient-to-r from-purple-500 to-yellow-500 bg-clip-text drop-shadow-2xl'>
            Kanbanana
          </h1>
        </Link>
      </div>
      <div className='p-4'>
        <h2 className='text-xs font-semibold tracking-widest uppercase text-slate-300'>
          all boards ({boards?.length})
        </h2>
        <ul className='flex flex-col gap-2 p-1'>
          {boards?.map((boardName, index) => (
            <BoardListItem key={boardName + index}>{boardName}</BoardListItem>
          ))}

          {!addMode && (
            <li
              className='inline-flex gap-1 font-semibold text-purple-500 transition-colors cursor-pointer hover:text-white'
              onClick={() => toggleAddMode(true)}
            >
              <PlusCircleIcon className='w-6 h-6' /> Create New Board
            </li>
          )}
          {addMode && (
            <form className='inline-flex items-center gap-1' onSubmit={(e) => e.preventDefault()}>
              <input
                className={`w-full px-4 py-1 leading-tight text-gray-700 bg-gray-200 border-2 border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-purple-500`}
                id='new-board-name'
                type='text'
                placeholder='New board name'
                onChange={handleBoardNameChange}
                onKeyDown={handleInputKeyDown}
                autoComplete='off'
                value={newBoard}
              />
              <XIcon
                className='w-6 h-6 text-red-300 transition hover:scale-110'
                onClick={() => {
                  toggleAddMode(false);
                  setNewBoard('');
                }}
              />
            </form>
          )}
          {isAddError && <p className='font-semibold text-red-500'>Board name already exists</p>}
        </ul>
      </div>
    </div>
  );
};

export default SideNav;
