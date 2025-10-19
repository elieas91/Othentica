import React from 'react';
import Modal from './Modal';
import { getApiUrl } from '../../config/api';

const BlogModal = ({ isOpen, onClose, blog }) => {
  if (!blog) return null;

  const handleLinkClick = (e) => {
    e.stopPropagation();
    if (blog.link) {
      window.open(blog.link, '_blank', 'noopener,noreferrer');
    }
  };

  const getImageUrl = (imgPath) => {
    if (imgPath.startsWith('http') || imgPath.startsWith('/assets')) {
      return imgPath;
    }
    return `${getApiUrl()}/uploads/blogs/${imgPath}`;
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl">
      <div className="space-y-6">
        {/* Blog Image */}
        {blog.img && (
          <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden">
            <img
              src={getImageUrl(blog.img)}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Blog Content */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-primary dark:text-neutral leading-tight">
            {blog.title}
          </h2>
          
          <div className="text-gray-600 dark:text-gray-400 text-sm">
            {blog.date && (
              <span className="inline-flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {blog.date}
              </span>
            )}
          </div>

          <div className="prose prose-lg max-w-none text-primary dark:text-gray-200 leading-relaxed">
            <p className="text-lg">
              {blog.description}
            </p>
          </div>

          {/* External Link Button */}
          {blog.link && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleLinkClick}
                className="inline-flex items-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                {blog.button || 'Read More'}
              </button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default BlogModal;
