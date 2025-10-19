import React, { useState, useEffect } from 'react';
import Banner from '../components/ui/Banner';
import BannerBg from '../assets/img/blog/blog_bg.webp';
import BlogModal from '../components/ui/BlogModal';
import SocialMedia from '../components/sections/SocialMedia';
import apiService from '../services/api';
import { getApiUrl } from '../config/api';

const BlogPage = () => {
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

  const handleBlogClick = (e, blog) => {
    // 
    e.stopPropagation();
    if (blog.link) {
      window.open(blog.link, '_blank', 'noopener,noreferrer');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBlog(null);
  };

  const getImageUrl = (imgPath) => {
    if (imgPath.startsWith('http') || imgPath.startsWith('/assets')) {
      return imgPath;
    }
    return `${getApiUrl()}/uploads/blogs/${imgPath}`;
  };

  if (loading) {
    return (
      <>
        <div className="bg-blue-400/40">
          <Banner
            title="Ideas That Matter"
            subtitle="Dive into in-depth blogs, fresh perspectives, and expert insights"
            description=""
            buttonText=""
            buttonVariant="accent"
            hasGradientTransparentBottom={false}
            backgroundImage={BannerBg}
            hasTransparentSides={false}
            hasOverlay={true}
          />
        </div>
        <div className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading blogs...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="bg-blue-400/40">
          <Banner
            title="Ideas That Matter"
            subtitle="Dive into in-depth blogs, fresh perspectives, and expert insights"
            description=""
            buttonText=""
            buttonVariant="accent"
            hasGradientTransparentBottom={false}
            backgroundImage={BannerBg}
            hasTransparentSides={false}
            hasOverlay={true}
          />
        </div>
        <div className="py-16 bg-white">
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
        </div>
      </>
    );
  }

  if (blogs.length === 0) {
    return (
      <>
        <div className="bg-blue-400/40">
          <Banner
            title="Ideas That Matter"
            subtitle="Dive into in-depth blogs, fresh perspectives, and expert insights"
            description=""
            buttonText=""
            buttonVariant="accent"
            hasGradientTransparentBottom={false}
            backgroundImage={BannerBg}
            hasTransparentSides={false}
            hasOverlay={true}
          />
        </div>
        <div className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-primary mb-4">Our Blog</h2>
              <p className="text-gray-600">No blog posts available at the moment.</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="bg-blue-400/40">
        <Banner
          title="Ideas That Matter"
          subtitle="Dive into in-depth blogs, fresh perspectives, and expert insights"
          description=""
          buttonText=""
          buttonVariant="accent"
          hasGradientTransparentBottom={false}
          backgroundImage={BannerBg}
          hasTransparentSides={false}
          hasOverlay={true}
        />
      </div>
      
      {/* Blog Grid Layout - Two Column Design */}
      <div className="py-16 bg-white">
        <div className="container mx-auto ">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Single Large Blog Card */}
            <div>
              {blogs[0] && (
                <div
                  className="bg-white rounded-2xl transition-shadow duration-300 cursor-pointer overflow-hidden min-h-[250px] lg:min-h-[800px]"
                  onClick={(e) => handleBlogClick(e, blogs[0])}
                >
                  {/* Blog Image */}
                  {blogs[0].img && (
                    <div className="w-full h-64 lg:h-96 overflow-hidden">
                      <img
                        src={getImageUrl(blogs[0].img)}
                        alt={blogs[0].title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Blog Content */}
                  <div className="p-6">
                    <h3 className="text-xl lg:text-2xl font-bold text-primary mb-3 line-clamp-2 hover:text-orange-600 transition-colors">
                      {blogs[0].title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-4 text-sm lg:text-base">
                      {blogs[0].description}
                    </p>

                    {/* Read More Button */}
                    <div className="flex items-center justify-between">
                      <div className="rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-primary bg-secondary text-white hover:bg-secondary/80 focus:ring-secondary shadow-md hover:shadow-lg px-8 py-4 min-h-[44px] min-w-[44px]  ">
                        {blogs[0].button || 'Read More'} →
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Three Stacked Blog Cards */}
            <div className="flex flex-col gap-6">
              {blogs.slice(1, 4).map((blog) => (
                <div
                  key={blog.id}
                  className="bg-white rounded-2xl transition-shadow duration-300 cursor-pointer overflow-hidden h-[300px]"
                  onClick={(e) => handleBlogClick(e, blog)}
                >
                  <div className="flex flex-col md:flex-row h-full">
                    {/* Blog Image */}
                    {blog.img && (
                      <div className="w-full md:w-1/2 h-48 md:h-full rounded-2xl overflow-hidden">
                        <img
                          src={getImageUrl(blog.img)}
                          alt={blog.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    {/* Blog Content */}
                    <div className="p-6 flex flex-col justify-between md:w-1/2 h-full">
                      <div className="flex flex-col gap-3">
                        <h3 className="text-lg font-bold text-primary line-clamp-2 hover:text-orange-600 transition-colors">
                          {blog.title}
                        </h3>
                        
                        <p className="text-gray-600 line-clamp-3 text-sm">
                          {blog.description}
                        </p>
                      </div>

                      {/* Read More Button */}
                      <div className="mt-4">
                        <div className="text-center rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-primary bg-secondary text-white hover:bg-secondary/80 focus:ring-secondary shadow-md hover:shadow-lg px-8 py-4 min-h-[44px] min-w-[44px]  ">
                          {blog.button || 'Read More'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Social Media Section */}
      <SocialMedia />

      {/* Blog Modal */}
      <BlogModal
        isOpen={isModalOpen}
        onClose={closeModal}
        blog={selectedBlog}
      />
    </>
  );
};

export default BlogPage;
