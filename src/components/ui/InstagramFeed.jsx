import React, { useState, useEffect } from 'react';

const InstagramFeed = () => {
  const [instagramData, setInstagramData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInstagramData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://feeds.behold.so/evA7qeQ1ZWd12davbREV');
        
        if (!response.ok) {
          throw new Error('Failed to fetch Instagram data');
        }
        
        const data = await response.json();
        setInstagramData(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching Instagram data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInstagramData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Unable to load Instagram feed</p>
      </div>
    );
  }

  const hasPosts = instagramData && instagramData.posts && instagramData.posts.length > 0;

  return (
    <div className="bg-gray-100 py-16">
      {/* Gallery Section Header - Similar to maronitemuseum.org */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Gallery</h2>
        <div className="w-16 h-1 bg-amber-700 mx-auto mb-6"></div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Explore our wellness journey, mindful practices, and authentic growth stories through our immersive Instagram collection.
        </p>
      </div>

      {/* Content based on posts availability */}
      {hasPosts ? (
        <div className="relative">
          {/* Horizontal Scrollable Gallery with Hover Expansion */}
          <div className="flex overflow-x-auto scrollbar-hide gap-4 px-6 py-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {instagramData.posts.slice(0, 8).map((post, index) => (
              <a
                key={post.id}
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex-shrink-0 w-64 h-96 bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 ease-in-out hover:w-96 hover:scale-105"
              >
                {/* Image Container */}
                <div className="relative w-full h-full">
                  <img
                    src={post.sizes?.medium?.mediaUrl || post.mediaUrl}
                    alt={post.caption || 'Instagram post'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Content Overlay - Shows on Hover */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                  {/* Title */}
                  <h3 className="text-white font-bold text-lg mb-3 leading-tight">
                    {post.caption ? 
                      (post.caption.length > 50 ? 
                        post.caption.substring(0, 50) + '...' : 
                        post.caption
                      ) : 
                      `Wellness Post ${index + 1}`
                    }
                  </h3>
                  
                  {/* Description */}
                  <p className="text-white/90 text-sm mb-4 leading-relaxed line-clamp-3">
                    {post.caption && post.caption.length > 100 ? 
                      post.caption.substring(0, 100) + '...' : 
                      post.caption || 'Discover more wellness insights and mindful practices on our Instagram feed. Join our community of authentic growth seekers.'
                    }
                  </p>
                  
                  {/* Action Button */}
                  <div className="flex items-center justify-between">
                    <span className="text-white/80 text-xs font-medium">
                      View on Instagram
                    </span>
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Instagram Icon - Always Visible */}
                <div className="absolute top-4 right-4">
                  <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-gray-800" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                </div>
              </a>
            ))}
          </div>
          
          {/* Scroll indicator */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">← Hover over posts to see details and descriptions →</p>
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-32 h-32 mx-auto mb-8 rounded-full overflow-hidden border-4 border-amber-700 shadow-lg">
            <img
              src={instagramData?.profilePictureUrl || '/default-profile.png'}
              alt="Instagram Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <h4 className="text-2xl font-bold text-gray-800 mb-4">Coming Soon</h4>
          <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
            We're working on creating amazing content for our Instagram feed. 
            Follow us to be the first to see our latest updates and wellness insights.
          </p>
          <a
            href={`https://www.instagram.com/${instagramData?.username || 'othenticaapp'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105 text-lg"
          >
            <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Follow @{instagramData?.username || 'othenticaapp'}
          </a>
        </div>
      )}

      {/* Follow us text */}
      <div className="text-center mt-8">
        <p className="text-gray-600 text-lg">
          Follow us on Instagram for daily wellness tips and updates
        </p>
      </div>
    </div>
  );
};

export default InstagramFeed;
