import React from 'react';
import { blogData } from '../../data/blogData';
import Card from '../ui/Card';

const Blog = () => {
  return (
    <section className="py-24 px-8 lg:px-16 bg-pink-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold text-blue-900 dark:text-white mb-8">
            Latest Articles
          </h2>
          <p className="text-xl text-blue-900 dark:text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Discover insights and wisdom from our wellness experts.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-10">
          {blogData.map((article) => (
            <Card key={article.id} className="overflow-hidden hover:scale-105 transition-transform duration-300">
              <div className="aspect-video bg-gradient-to-br from-pink-300 to-pink-200 dark:from-pink-700 dark:to-pink-600 rounded-2xl mb-8 overflow-hidden">
                {/* Placeholder for blog images */}
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-6xl">📖</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-blue-900 dark:text-white">
                  {article.title}
                </h3>
                <p className="text-blue-900 dark:text-gray-300 text-sm font-medium">
                  {article.author}
                </p>
                <p className="text-blue-900 dark:text-gray-200 leading-relaxed">
                  {article.excerpt}
                </p>
                <button className="text-pink-500 dark:text-pink-400 font-semibold hover:text-pink-600 dark:hover:text-pink-300 transition-colors text-lg">
                  Read More →
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
