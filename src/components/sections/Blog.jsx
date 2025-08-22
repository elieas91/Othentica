import React, { useState, useEffect } from 'react';

const Blog = () => {
  const [instagramData, setInstagramData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // Fetch Instagram data from Behold API
  useEffect(() => {
    const fetchInstagramData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://feeds.behold.so/yE56Hf1PVSocv26HmhzN');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setInstagramData(data);
      } catch (err) {
        console.error('Error fetching Instagram data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInstagramData();
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const truncateCaption = (caption, maxLength = 100) => {
    if (!caption) return '';
    return caption.length > maxLength ? caption.substring(0, maxLength) + '...' : caption;
  };

  // Loading state
  if (loading) {
    return (
      <section className="py-16 bg-neutral">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-primary text-lg">Loading Instagram feed...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error || !instagramData) {
    return (
      <section className="py-16 bg-neutral">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-primary mb-2">Failed to Load</h2>
            <p className="text-primary/70 mb-4">
              {error || 'Unable to load Instagram data'}
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-primary hover:bg-primary/80 text-neutral px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-neutral">
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .h-120 {
          height: 30rem;
        }
      `}</style>
      
      <div>
        {/* Profile Header */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center mb-8">
            <img 
              src={instagramData.profilePictureUrl} 
              alt={instagramData.username}
              className="w-24 h-24 rounded-full border-4 border-primary shadow-lg"
            />
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-4">
            @{instagramData.username}
          </h2>
          <div className="flex justify-center space-x-8 text-primary/80">
            <span className="text-lg">
              <span className="font-bold">{instagramData.posts.length}</span> posts
            </span>
            <span className="text-lg">
              <span className="font-bold">{instagramData.followersCount}</span> followers
            </span>
            <span className="text-lg">
              <span className="font-bold">{instagramData.followsCount}</span> following
            </span>
          </div>
        </div>
        
        {/* Instagram Gallery - Full Width with Hover Expansion */}
        <div className="w-screen">
          <div className="hidden lg:flex gap-2 overflow-hidden rounded-2xl shadow-2xl w-screen">
            {instagramData.posts.map((post) => (
              <div
                key={post.id}
                className="group relative flex-1 h-120 overflow-hidden transition-all duration-700 ease-in-out hover:flex-[3] cursor-pointer"

                onClick={() => window.open(`https://www.instagram.com/${instagramData.username}/`, '_blank')}
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-110"
                  style={{ 
                    backgroundImage: `url(${post.mediaType === 'VIDEO' ? post.thumbnailUrl : post.mediaUrl})` 
                  }}
                ></div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-amber-800/90 via-amber-800/40 to-transparent transition-all duration-700 group-hover:from-amber-800/70"></div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-all duration-700 group-hover:translate-y-0 translate-y-4">
                  <h3 className="text-neutral text-xl font-bold mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-200">
                    {post.caption ? truncateCaption(post.caption, 60) : 'Instagram Post'}
                  </h3>
                  <p className="text-neutral/80 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-300 line-clamp-3">
                    {post.caption || 'No caption available'}
                  </p>
                  <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-400">
                    <span className="inline-block px-3 py-1 bg-blue-600 text-neutral text-xs rounded-full">
                      {post.mediaType === 'VIDEO' ? 'VIDEO' : post.mediaType === 'CAROUSEL_ALBUM' ? 'ALBUM' : 'IMAGE'}
                    </span>
                    <span className="inline-block px-3 py-1 bg-gray-600 text-neutral text-xs rounded-full ml-2">
                      {formatDate(post.timestamp)}
                    </span>
                  </div>
                </div>

                {/* Side Title - Visible when not hovered */}
                <div className="absolute left-6 bottom-6 transform -rotate-90 origin-left transition-all duration-700 group-hover:opacity-0 group-hover:translate-x-4">
                  <h3 className="text-neutral text-lg font-bold whitespace-nowrap">
                    {post.caption ? truncateCaption(post.caption, 30) : 'Post'}
                  </h3>
                </div>

                {/* Media Type Indicator */}
                {post.mediaType === 'VIDEO' && (
                  <div className="absolute top-4 right-4 bg-black/70 text-neutral px-2 py-1 rounded-full text-xs font-semibold">
                    ▶️ REEL
                  </div>
                )}
                {post.mediaType === 'CAROUSEL_ALBUM' && (
                  <div className="absolute top-4 right-4 bg-black/70 text-neutral px-2 py-1 rounded-full text-xs font-semibold">
                    📷 ALBUM
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Featured Image */}
          <div className="lg:hidden px-4 sm:px-6">
            <div 
              className="relative h-80 sm:h-96 rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
              onClick={() => window.open(`https://www.instagram.com/${instagramData.username}/`, '_blank')}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ 
                  backgroundImage: `url(${instagramData.posts[0].mediaType === 'VIDEO' ? instagramData.posts[0].thumbnailUrl : instagramData.posts[0].mediaUrl})` 
                }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-amber-800/80 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <div className="flex items-center mb-2">
                  <span className="px-2 py-1 bg-blue-600 text-neutral text-xs rounded-full font-bold mr-3">
                    FEATURED
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-neutral mb-2">
                  {instagramData.posts[0].caption ? truncateCaption(instagramData.posts[0].caption, 60) : 'Instagram Post'}
                </h3>
                <p className="text-neutral/90 text-sm leading-relaxed mb-4 line-clamp-2">
                  {instagramData.posts[0].caption || 'No caption available'}
                </p>
                <div className="flex gap-3">
                  <button className="bg-blue-600 hover:bg-blue-700 text-neutral px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 flex-1 sm:flex-none">
                    View Post
                  </button>
                  <button className="border border-white/30 text-neutral hover:bg-white/20 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300">
                    Details
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-6">
              {instagramData.posts.map((post) => (
                <div 
                  key={post.id}
                  className="relative h-32 sm:h-40 rounded-xl overflow-hidden shadow-lg cursor-pointer"
                  onClick={() => window.open(`https://www.instagram.com/${instagramData.username}/`, '_blank')}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ 
                      backgroundImage: `url(${post.mediaType === 'VIDEO' ? post.thumbnailUrl : post.mediaUrl})` 
                    }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-800/60 to-transparent"></div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <h4 className="text-neutral text-sm font-semibold line-clamp-1">
                      {post.caption ? truncateCaption(post.caption, 30) : 'Post'}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Hover Indicator */}
        <div className="text-center mt-8">
          <p className="text-primary text-sm">
            Hover over any image to expand and reveal details
          </p>
        </div>
      </div>
    </section>
  );
};

export default Blog;
