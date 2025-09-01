import React, { useState, useEffect } from 'react';

const SocialMedia = () => {
  const [instagramData, setInstagramData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('instagram');

  // Fetch Instagram data from Behold API
  useEffect(() => {
    const fetchInstagramData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'https://feeds.behold.so/yE56Hf1PVSocv26HmhzN'
        );

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
      year: 'numeric',
    });
  };

  const truncateCaption = (caption, maxLength = 100) => {
    if (!caption) return '';
    return caption.length > maxLength
      ? caption.substring(0, maxLength) + '...'
      : caption;
  };

  // Mock data for other social platforms
  const socialPlatforms = {
    instagram: {
      name: 'Instagram',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      hoverColor: 'hover:from-purple-600 hover:to-pink-600',
      data: instagramData,
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
      data: {
        username: 'othentica',
        followers: 1250,
        posts: 89,
        recentPosts: [
          {
            id: 'fb1',
            content:
              'Excited to share our latest insights on personal development and authentic living!',
            timestamp: '2025-01-15T10:00:00+0000',
            likes: 45,
            comments: 12,
            shares: 8,
          },
          {
            id: 'fb2',
            content:
              'Join us for our upcoming workshop on building meaningful relationships.',
            timestamp: '2025-01-12T14:30:00+0000',
            likes: 67,
            comments: 23,
            shares: 15,
          },
        ],
      },
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
      data: {
        username: 'othentica',
        connections: 890,
        posts: 156,
        recentPosts: [
          {
            id: 'li1',
            content:
              "Professional development is not just about skills, it's about authentic growth.",
            timestamp: '2025-01-14T09:00:00+0000',
            reactions: 89,
            comments: 34,
            shares: 22,
          },
          {
            id: 'li2',
            content:
              'Building a strong personal brand starts with understanding your core values.',
            timestamp: '2025-01-10T11:15:00+0000',
            reactions: 156,
            comments: 67,
            shares: 45,
          },
        ],
      },
    },
    youtube: {
      name: 'YouTube',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
      color: 'bg-red-600',
      hoverColor: 'hover:bg-red-700',
      data: {
        username: 'Othentica',
        subscribers: 2340,
        videos: 67,
        recentVideos: [
          {
            id: 'yt1',
            title: 'The Art of Authentic Living',
            description: "Discover how to live authentically in today's world.",
            timestamp: '2025-01-13T16:00:00+0000',
            views: 1240,
            likes: 89,
            duration: '12:34',
          },
          {
            id: 'yt2',
            title: 'Building Meaningful Relationships',
            description:
              'Learn the key principles of building lasting connections.',
            timestamp: '2025-01-08T14:30:00+0000',
            views: 2156,
            likes: 156,
            duration: '18:45',
          },
        ],
      },
    },
  };

  // Loading state
  if (loading) {
    return (
      <section className="py-16 bg-neutral">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-primary text-lg">
              Loading social media content...
            </p>
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
            <h2 className="text-2xl font-bold text-primary mb-2">
              Failed to Load
            </h2>
            <p className="text-primary/70 mb-4">
              {error || 'Unable to load social media data'}
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

  const renderTabContent = () => {
    const platform = socialPlatforms[activeTab];

    if (activeTab === 'instagram') {
      return (
        <div className="w-screen">
          {/* Instagram Profile Header */}
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
                <span className="font-bold">{instagramData.posts.length}</span>{' '}
                posts
              </span>
              <span className="text-lg">
                <span className="font-bold">
                  {instagramData.followersCount}
                </span>{' '}
                followers
              </span>
              <span className="text-lg">
                <span className="font-bold">{instagramData.followsCount}</span>{' '}
                following
              </span>
            </div>
          </div>
          <div className="hidden lg:flex gap-2 overflow-hidden rounded-2xl shadow-2xl w-screen">
            {instagramData.posts.map((post) => (
              <div
                key={post.id}
                className="group relative flex-1 h-120 overflow-hidden transition-all duration-700 ease-in-out hover:flex-[3] cursor-pointer"
                onClick={() =>
                  window.open(
                    `https://www.instagram.com/${instagramData.username}/`,
                    '_blank'
                  )
                }
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage: `url(${
                      post.mediaType === 'VIDEO'
                        ? post.thumbnailUrl
                        : post.mediaUrl
                    })`,
                  }}
                ></div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-amber-800/90 via-amber-800/40 to-transparent transition-all duration-700 group-hover:from-amber-800/70"></div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-all duration-700 group-hover:translate-y-0 translate-y-4">
                  <h3 className="text-neutral text-xl font-bold mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-200">
                    {post.caption
                      ? truncateCaption(post.caption, 60)
                      : 'Instagram Post'}
                  </h3>
                  <p className="text-neutral/80 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-300 line-clamp-3">
                    {post.caption || 'No caption available'}
                  </p>
                  <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-400">
                    <span className="inline-block px-3 py-1 bg-blue-600 text-neutral text-xs rounded-full">
                      {post.mediaType === 'VIDEO'
                        ? 'VIDEO'
                        : post.mediaType === 'CAROUSEL_ALBUM'
                        ? 'ALBUM'
                        : 'IMAGE'}
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
              onClick={() =>
                window.open(
                  `https://www.instagram.com/${instagramData.username}/`,
                  '_blank'
                )
              }
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${
                    instagramData.posts[0].mediaType === 'VIDEO'
                      ? instagramData.posts[0].thumbnailUrl
                      : instagramData.posts[0].mediaUrl
                  })`,
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
                  {instagramData.posts[0].caption
                    ? truncateCaption(instagramData.posts[0].caption, 60)
                    : 'Instagram Post'}
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
                  onClick={() =>
                    window.open(
                      `https://www.instagram.com/${instagramData.username}/`,
                      '_blank'
                    )
                  }
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${
                        post.mediaType === 'VIDEO'
                          ? post.thumbnailUrl
                          : post.mediaUrl
                      })`,
                    }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-800/60 to-transparent"></div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <h4 className="text-neutral text-sm font-semibold line-clamp-1">
                      {post.caption
                        ? truncateCaption(post.caption, 30)
                        : 'Post'}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Render content for other platforms
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="p-8">
          <div className="text-center mb-8">
            {/* <div className="text-6xl mb-4">{platform.icon}</div> */}
            <h2 className="text-3xl font-bold text-primary mb-2">
              @{platform.data.username}
            </h2>
            <div className="flex justify-center space-x-8 text-primary/80">
              {activeTab === 'facebook' && (
                <>
                  <span className="text-lg">
                    <span className="font-bold">{platform.data.followers}</span>{' '}
                    followers
                  </span>
                  <span className="text-lg">
                    <span className="font-bold">{platform.data.posts}</span>{' '}
                    posts
                  </span>
                </>
              )}
              {activeTab === 'linkedin' && (
                <>
                  <span className="text-lg">
                    <span className="font-bold">
                      {platform.data.connections}
                    </span>{' '}
                    connections
                  </span>
                  <span className="text-lg">
                    <span className="font-bold">{platform.data.posts}</span>{' '}
                    posts
                  </span>
                </>
              )}
              {activeTab === 'youtube' && (
                <>
                  <span className="text-lg">
                    <span className="font-bold">
                      {platform.data.subscribers}
                    </span>{' '}
                    subscribers
                  </span>
                  <span className="text-lg">
                    <span className="font-bold">{platform.data.videos}</span>{' '}
                    videos
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid gap-6">
            {activeTab === 'facebook' &&
              platform.data.recentPosts.map((post) => (
                <div key={post.id} className="bg-gray-50 rounded-xl p-6">
                  <p className="text-gray-800 mb-4">{post.content}</p>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{formatDate(post.timestamp)}</span>
                    <div className="flex space-x-4">
                      <span>👍 {post.likes}</span>
                      <span>💬 {post.comments}</span>
                      <span>🔄 {post.shares}</span>
                    </div>
                  </div>
                </div>
              ))}

            {activeTab === 'linkedin' &&
              platform.data.recentPosts.map((post) => (
                <div key={post.id} className="bg-gray-50 rounded-xl p-6">
                  <p className="text-gray-800 mb-4">{post.content}</p>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{formatDate(post.timestamp)}</span>
                    <div className="flex space-x-4">
                      <span>👍 {post.reactions}</span>
                      <span>💬 {post.comments}</span>
                      <span>🔄 {post.shares}</span>
                    </div>
                  </div>
                </div>
              ))}

            {activeTab === 'youtube' &&
              platform.data.recentVideos.map((video) => (
                <div key={video.id} className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {video.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{video.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{formatDate(video.timestamp)}</span>
                    <div className="flex space-x-4">
                      <span>👁️ {video.views}</span>
                      <span>👍 {video.likes}</span>
                      <span>⏱️ {video.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="py-16 bg-white">
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

      {/* Social Media Tabs - Circular Icon Only */}
      <div className="flex justify-center mb-12">
        <div className="flex gap-6">
          {Object.entries(socialPlatforms).map(([key, platform]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg text-white focus:outline-none border-0 border-transparent ${
                activeTab === key
                  ? 'scale-110 border-primary text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-800'
              }`}
              aria-label={platform.name}
            >
              {activeTab === key ? (
                <div
                  className={`w-full h-full rounded-full flex items-center justify-center ${platform.color}`}
                >
                  {platform.icon}
                </div>
              ) : (
                platform.icon
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {renderTabContent()}

      {/* Hover Indicator - Only show for Instagram */}
      {activeTab === 'instagram' && (
        <div className="text-center mt-8">
          <p className="text-primary text-sm">
            Hover over any image to expand and reveal details
          </p>
        </div>
      )}
    </section>
  );
};

export default SocialMedia;
