import clsx from 'clsx';
import React, { useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import { PiPlus } from 'react-icons/pi';
import { PiSelectionAllDuotone } from 'react-icons/pi';

import { useEnv } from '@/context/EnvContext';
import useFullScreen from '@/hooks/useFullScreen';
import WindowButtons from '@/components/WindowButtons';

interface LibraryHeaderProps {
  isSelectMode: boolean;
  onImportBooks: () => void;
  onToggleSelectMode: () => void;
}

const LibraryHeader: React.FC<LibraryHeaderProps> = ({
  isSelectMode,
  onImportBooks,
  onToggleSelectMode,
}) => {
  const { appService } = useEnv();
  const { isFullScreen } = useFullScreen();
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.shiftKey) {
        onToggleSelectMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onToggleSelectMode]);

  const handleMinimize = async () => {
    const { getCurrentWindow } = await import('@tauri-apps/api/window');
    getCurrentWindow().minimize();
  };

  const handleToggleMaximize = async () => {
    const { getCurrentWindow } = await import('@tauri-apps/api/window');
    getCurrentWindow().toggleMaximize();
  };

  const handleClose = async () => {
    const { getCurrentWindow } = await import('@tauri-apps/api/window');
    getCurrentWindow().close();
  };

  return (
    <div
      ref={headerRef}
      className={clsx(
        'titlebar fixed z-10 w-full bg-gray-100 py-2 pr-6',
        isFullScreen ? 'pl-2' : 'pl-16',
      )}
    >
      <div className='flex items-center justify-between'>
        <div className='sm:w relative flex w-full items-center pl-4'>
          <span className='absolute left-8 text-gray-500'>
            <FaSearch className='h-4 w-4' />
          </span>
          <input
            type='text'
            placeholder='Search books...'
            className='input input-sm rounded-badge w-full bg-gray-200 pl-10 pr-10 text-base focus:border-none focus:outline-none'
          />
          <div className='absolute right-4 flex items-center space-x-4 text-gray-500'>
            <span className='mx-2 h-5 w-[1px] bg-gray-300'></span>
            <div className='dropdown dropdown-bottom flex h-5 cursor-pointer justify-center text-gray-500'>
              <div className='lg:tooltip lg:tooltip-bottom' data-tip='Add books'>
                <PiPlus tabIndex={-1} className='h-5 w-5' />
              </div>
              <ul
                tabIndex={-1}
                className='dropdown-content dropdown-center menu bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow'
              >
                <li>
                  <button onClick={onImportBooks}>From Local File</button>
                </li>
              </ul>
            </div>
            <button onClick={onToggleSelectMode} aria-label='Select Multiple Books' className='h-6'>
              <div className='lg:tooltip lg:tooltip-bottom cursor-pointer' data-tip='Select books'>
                <PiSelectionAllDuotone
                  role='button'
                  className={`h-6 w-6 ${isSelectMode ? 'fill-gray-400' : 'fill-gray-500'}`}
                />
              </div>
            </button>
          </div>
        </div>
        {!appService?.isNativeWindow && (
          <WindowButtons
            headerRef={headerRef}
            onMinimize={handleMinimize}
            onToggleMaximize={handleToggleMaximize}
            onClose={handleClose}
          />
        )}
      </div>
    </div>
  );
};

export default LibraryHeader;
