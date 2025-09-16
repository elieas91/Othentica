import React, { useState } from 'react';
import { instagramData } from '../../data/instagramData';

const SocialMedia = () => {
  const [activePlatform, setActivePlatform] = useState('instagram');

  // Social platforms with direct links
  const socialPlatforms = {
    instagram: {
      name: 'Instagram',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      hoverColor: 'hover:from-purple-600 hover:to-pink-600',
      url: 'https://www.instagram.com/othenticaapp',
    },
    facebook: {
      name: 'Facebook',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      color: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700',
      url: 'https://www.facebook.com/share/1C2Qcrsj2d/',
    },
    linkedin: {
      name: 'LinkedIn',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
      color: 'bg-blue-700',
      hoverColor: 'hover:bg-blue-800',
      url: 'https://www.linkedin.com/company/othentica-fzc-llc',
    },
  };


  const handleSocialClick = (platformKey, platform) => {
    if (platformKey === 'instagram') {
      setActivePlatform(activePlatform === 'instagram' ? null : 'instagram');
    } else if (platform.url) {
      window.open(platform.url, '_blank');
    }
  };

  return (
    <section className="py-16 bg-white">

      {/* Social Media Icons - Direct Links */}
      <div className="flex justify-center mb-12">
        <div className="flex gap-6">
          {Object.entries(socialPlatforms).map(([key, platform]) => (
            <button
              key={key}
              onClick={() => handleSocialClick(key, platform)}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg text-white focus:outline-none border-0 border-transparent hover:scale-110 ${
                activePlatform === key 
                  ? 'ring-4 ring-primary/30 scale-110' 
                  : ''
              } ${platform.color} ${platform.hoverColor}`}
              aria-label={`Visit Othentica FZC LLC on ${platform.name}`}
                >
                  {platform.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Instagram Feed Display */}
      {activePlatform === 'instagram' && (
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 shadow-lg border border-purple-100">
            {/* Instagram Profile Header */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-4">
                <img
                  src={instagramData.profilePictureUrl}
                  alt={`${instagramData.username} profile`}
                  className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                />
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-gray-800">@{instagramData.username}</h3>
                  <p className="text-gray-600 text-sm mb-2">{instagramData.biography}</p>
                  <div className="flex space-x-4 text-sm text-gray-500">
                    <span><strong>{instagramData.followersCount}</strong> followers</span>
                    <span><strong>{instagramData.followsCount}</strong> following</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Instagram Posts Grid */}
            {instagramData.posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {instagramData.posts.map((post, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <img
                      src={post.imageUrl}
                      alt={`Instagram post ${index + 1}`}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-4">
                      <p className="text-gray-800 text-sm line-clamp-3">{post.caption}</p>
                      <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                        <span>{post.likesCount} likes</span>
                        <span>{new Date(post.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-700 mb-2">No Posts Yet</h4>
                <p className="text-gray-500 mb-4">
                  We're working on creating amazing content for you!
                </p>
                <p className="text-sm text-gray-400">
                  Follow us on Instagram to be the first to see our wellness content when it's ready.
                </p>
                <a
                  href="https://www.instagram.com/othenticaapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
                >
                  Follow on Instagram
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Company Info */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-4">
          Othentica FZC LLC
        </h2>
        <p className="text-primary/70 text-lg mb-4">
          Follow us on social media for updates and insights
        </p>
        <p className="text-primary/50 text-sm">
          Click on Instagram above to see our latest posts, or follow us for updates!
        </p>
      </div>
    </section>
  );
};

export default SocialMedia;
