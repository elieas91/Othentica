import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';

const Sidebar = ({ children, isOpen, onToggle, isPinned, onTogglePin }) => {
  return (
    <>
      {/* Sidebar */}
      <div className={`fixed max-h-screen inset-y-0 left-0 z-50 w-80 bg-gradient-to-br from-primary via-primary to-blue-900 shadow-xl transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-secondary to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">O</span>
              </div>
              <h2 className="text-xl font-bold text-white font-poppins">
                Admin Panel
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onTogglePin}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                title={isPinned ? 'Unpin Sidebar' : 'Pin Sidebar'}
              >
                {isPinned ? (
                  <BookmarkIconSolid className="w-5 h-5 text-accent" />
                ) : (
                  <BookmarkIcon className="w-5 h-5 text-white/70" />
                )}
              </button>
              <button
                onClick={onToggle}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <ChevronLeftIcon className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto bg-gradient-to-b from-white/5 to-transparent">
            {children}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && !isPinned && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={onToggle}
        />
      )}
    </>
  );
};

export default Sidebar;
