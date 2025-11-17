import React, { useState, useEffect } from 'react';
import BlogModal from '../ui/BlogModal';
import apiService from '../../services/api';
import { getApiUrl, normalizeUploadUrl } from '../../config/api';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllBlogs();
      if (response.success) {
        setBlogs(response.data);
      } else {
        setError('Failed to fetch blogs');
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Error loading blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleBlogClick = (blog) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBlog(null);
  };

  const getImageUrl = (imgPath) => {
    if (imgPath.startsWith('/assets')) {
      return imgPath;
    }
    return normalizeUploadUrl(imgPath, 'blogs');
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading blogs...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={fetchBlogs}
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (blogs.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-primary mb-4">Our Blog</h2>
            <p className="text-gray-600">No blog posts available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-4">Our Blog</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay updated with our latest insights, stories, and updates from the world of wellness and professional development.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer overflow-hidden border border-gray-100"
              onClick={() => handleBlogClick(blog)}
            >
              {/* Blog Image */}
              {blog.img && (
                <div className="w-full h-48 overflow-hidden">
                  <img
                    src={getImageUrl(blog.img)}
                    alt={blog.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              {/* Blog Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-primary mb-3 line-clamp-2 hover:text-orange-600 transition-colors">
                  {blog.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {blog.description}
                </p>

                {/* Date and Read More */}
                <div className="flex items-center justify-between">
                  {blog.date && (
                    <span className="text-sm text-gray-500">
                      {blog.date}
                    </span>
                  )}
                  <span className="text-orange-500 font-semibold text-sm hover:text-orange-600 transition-colors">
                    Read More →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Blog Modal */}
        <BlogModal
          isOpen={isModalOpen}
          onClose={closeModal}
          blog={selectedBlog}
        />
      </div>
    </section>
  );
};

export default Blog;