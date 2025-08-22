import React from 'react';
import { blogData } from '../data/blogData';
import Card from '../components/ui/Card';

const Blog = () => {
  return (
    <div className="min-h-screen bg-pink-50 dark:bg-gray-900 py-20 px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl lg:text-6xl font-bold text-blue-900 dark:text-white mb-6">
            Wellness Blog
          </h1>
          <p className="text-xl text-blue-900 dark:text-gray-200 max-w-3xl mx-auto">
            Discover insights, tips, and wisdom from our wellness experts.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {blogData.map((article) => (
            <Card key={article.id} className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-pink-300 to-pink-200 dark:from-pink-700 dark:to-pink-600 rounded-lg mb-6 overflow-hidden">
                {/* Placeholder for blog images */}
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-4xl">📖</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold text-blue-900 dark:text-white">
                  {article.title}
                </h3>
                <p className="text-blue-900 dark:text-gray-300 text-sm">
                  {article.author}
                </p>
                <p className="text-blue-900 dark:text-gray-200 leading-relaxed">
                  {article.excerpt}
                </p>
                <button className="text-pink-500 dark:text-pink-400 font-medium hover:text-pink-600 dark:hover:text-pink-300 transition-colors">
                  Read More →
                </button>
              </div>
            </Card>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-blue-900 dark:text-white mb-6">
            Stay Updated
          </h2>
          <p className="text-lg text-blue-900 dark:text-gray-200 mb-8">
            Subscribe to our newsletter for the latest wellness insights and tips.
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <button className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
