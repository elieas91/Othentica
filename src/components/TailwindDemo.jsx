import React from 'react'

const TailwindDemo = () => {
  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8 text-center">
          Tailwind CSS v3 Demo
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Color Demo */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">Colors</h3>
            <div className="space-y-2">
              <div className="h-8 bg-blue-500 rounded"></div>
              <div className="h-8 bg-green-500 rounded"></div>
              <div className="h-8 bg-yellow-500 rounded"></div>
              <div className="h-8 bg-red-500 rounded"></div>
            </div>
          </div>

          {/* Typography Demo */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">Typography</h3>
            <div className="space-y-2">
              <p className="text-xs text-gray-600 dark:text-gray-300">Extra Small Text</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Small Text</p>
              <p className="text-base text-gray-700 dark:text-gray-200">Base Text</p>
              <p className="text-lg font-medium text-gray-800 dark:text-white">Large Text</p>
            </div>
          </div>

          {/* Spacing Demo */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">Spacing</h3>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-8"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-12"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
            </div>
          </div>

          {/* Flexbox Demo */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">Flexbox</h3>
            <div className="flex justify-between items-center">
              <div className="w-8 h-8 bg-blue-400 rounded"></div>
              <div className="w-8 h-8 bg-green-400 rounded"></div>
              <div className="w-8 h-8 bg-yellow-400 rounded"></div>
            </div>
          </div>

          {/* Grid Demo */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">Grid</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="w-8 h-8 bg-purple-400 rounded"></div>
              <div className="w-8 h-8 bg-pink-400 rounded"></div>
              <div className="w-8 h-8 bg-indigo-400 rounded"></div>
              <div className="w-8 h-8 bg-teal-400 rounded"></div>
            </div>
          </div>

          {/* Hover Effects Demo */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">Hover Effects</h3>
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 hover:scale-105 transition-all duration-200">
              Hover Me!
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            This component demonstrates various Tailwind CSS v3 utilities including colors, 
            typography, spacing, flexbox, grid, and hover effects.
          </p>
        </div>
      </div>
    </div>
  )
}

export default TailwindDemo
