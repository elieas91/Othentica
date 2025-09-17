import React, { useState, useEffect, useCallback } from 'react';
import Flame from '../../assets/img/flame.webp';
import Testimonial1 from '../../assets/img/testimonials/testimonial-1.webp';
import Testimonial2 from '../../assets/img/testimonials/testimonial-2.webp';
import Testimonial3 from '../../assets/img/testimonials/testimonial-3.webp';
import Testimonial4 from '../../assets/img/testimonials/testimonial-4.webp';
import Testimonial5 from '../../assets/img/testimonials/testimonial-5.webp';
import Testimonial6 from '../../assets/img/testimonials/testimonial-6.webp';
import {
  testimonialsData as fallbackTestimonialsData,
  testimonialCategories,
} from '../../data/testimonialsData';
import Swal from 'sweetalert2';
import apiService from '../../services/api';
import Button from '../ui/Button';
import TestimonialForm from '../ui/TestimonialForm';

const Testimonials = ({ showPics = true, currentCategoryId = null }) => {
  // Map categoryId to API category parameter
  const getApiCategory = (categoryId) => {
    const mapping = {
      'the-othentica-app': 'app',
      'tailored-programs': 'programs', 
      'talks-workshops': 'talks',
      'one-to-one-guidance': 'one-to-one'
    };
    return mapping[categoryId] || null;
  };

  // Map API category back to categoryId
  const getCategoryIdFromApi = (apiCategory) => {
    const mapping = {
      'app': 'the-othentica-app',
      'programs': 'tailored-programs',
      'talks': 'talks-workshops',
      'one-to-one': 'one-to-one-guidance'
    };
    return mapping[apiCategory] || 'general';
  };
  // SweetAlert helper functions for consistent styling
  const showSuccessAlert = (title, text) => {
    return Swal.fire({
      title,
      text,
      icon: 'success',
      confirmButtonColor: '#10b981',
      background: '#ffffff',
      customClass: {
        popup: 'rounded-2xl',
        title: 'font-poppins font-bold text-primary',
        content: 'font-poppins',
        confirmButton: 'rounded-xl font-medium'
      }
    });
  };

  const showErrorAlert = (title, text) => {
    return Swal.fire({
      title,
      text,
      icon: 'error',
      confirmButtonColor: '#ef4444',
      background: '#ffffff',
      customClass: {
        popup: 'rounded-2xl',
        title: 'font-poppins font-bold text-primary',
        content: 'font-poppins',
        confirmButton: 'rounded-xl font-medium'
      }
    });
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [expandedQuotes, setExpandedQuotes] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testimonialsData, setTestimonialsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch testimonials
  const fetchTestimonials = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get API category parameter
      const apiCategory = getApiCategory(currentCategoryId);
      const response = await apiService.getApprovedTestimonials(apiCategory);
      
      if (response.success && response.data) {
        // Transform database testimonials to match component structure
        const transformedTestimonials = response.data.map((testimonial, index) => ({
          id: testimonial.id,
          quote: testimonial.description, // Map description to quote
          author: testimonial.name, // Map name to author
          categoryId: getCategoryIdFromApi(testimonial.category) || currentCategoryId || 'general', // Map database category to frontend categoryId
          image: `testimonial-${(index % 6) + 1}`, // Cycle through available images
          imageUrl: testimonial.imageUrl // Use database image URL if available
        }));
        
        setTestimonialsData(transformedTestimonials);
      } else {
        throw new Error(response.message || 'Failed to fetch testimonials');
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setError(error.message);
      // Fallback to static data
      setTestimonialsData(fallbackTestimonialsData);
    } finally {
      setIsLoading(false);
    }
  }, [currentCategoryId]);

  // Fetch testimonials from API on component mount and when category changes
  useEffect(() => {
    fetchTestimonials();
  }, [currentCategoryId, fetchTestimonials]);

  // Filter testimonials based on category if provided
  const filteredTestimonials = currentCategoryId
    ? testimonialsData.filter((t) => t.categoryId == currentCategoryId)
    : testimonialsData;

  // Auto-rotate through testimonials every 16 seconds
  useEffect(() => {
    if (filteredTestimonials.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(
        (prevIndex) => (prevIndex + 1) % filteredTestimonials.length
      );
    }, 16000);

    return () => clearInterval(interval);
  }, [filteredTestimonials.length]);

  // Get the current testimonial and its category
  const currentTestimonial = filteredTestimonials[currentIndex];
  const currentCategory = testimonialCategories.find(
    (cat) => cat.id === currentTestimonial?.categoryId
  );

  // Get two different categories for the right side images
  const getTwoDifferentCategories = () => {
    if (!currentCategory) {
      // If no current category, return first two categories
      return testimonialCategories.slice(0, 2);
    }
    if (testimonialCategories.length < 2) return [currentCategory];
    // Pick current category and next one (wrap around)
    const currentIdx = testimonialCategories.findIndex(
      (cat) => cat.id === currentCategory.id
    );
    const nextIdx = (currentIdx + 1) % testimonialCategories.length;
    return [testimonialCategories[currentIdx], testimonialCategories[nextIdx]];
  };
  const categoriesForImages = getTwoDifferentCategories();

  // Function to get testimonial image path
  const getTestimonialImagePath = (imageName, imageUrl = null) => {
  // If a database URL is provided
  if (imageUrl) {
    // If it’s already a full URL, just return it
    if (imageUrl.startsWith('http')) return imageUrl;

    // If it's just a filename or relative path, prepend /server/uploads/testimonials/
    return `/server/uploads/testimonials/${imageUrl}`;
  }

  // Otherwise, use static fallback images
  const imageMap = {
    'testimonial-1': Testimonial1,
    'testimonial-2': Testimonial2,
    'testimonial-3': Testimonial3,
    'testimonial-4': Testimonial4,
    'testimonial-5': Testimonial5,
    'testimonial-6': Testimonial6,
  };

  return imageMap[imageName] || Testimonial2;
};


  // Function to truncate quote to 2 lines
  const truncateQuote = (quote) => {
    const words = quote.split(' ');
    const lineLength = 60; // Approximate characters per line
    const maxChars = showPics ? lineLength * 2 : lineLength * 7;

    if (quote.length <= maxChars) {
      return { truncated: quote, needsTruncation: false };
    }

    let truncated = '';
    let charCount = 0;

    for (let i = 0; i < words.length; i++) {
      if (charCount + words[i].length + 1 <= maxChars) {
        truncated += (truncated ? ' ' : '') + words[i];
        charCount += words[i].length + 1;
      } else {
        break;
      }
    }

    return { truncated: truncated + '...', needsTruncation: true };
  };

  // Function to toggle quote expansion
  const toggleQuoteExpansion = (testimonialId) => {
    setExpandedQuotes((prev) => ({
      ...prev,
      [testimonialId]: !prev[testimonialId],
    }));
  };

  // Handle testimonial form submission
  const handleTestimonialSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const testimonialFormData = new FormData();
      testimonialFormData.append('name', formData.name);
      testimonialFormData.append('description', formData.description);
      testimonialFormData.append('status', 'pending');
      testimonialFormData.append('category', formData.category);
      
      // Add image if provided
      if (formData.image) {
        testimonialFormData.append('image', formData.image);
      }
      
      const response = await apiService.createTestimonial(testimonialFormData);
      
      if (response.success) {
        // Show success message
        await showSuccessAlert(
          'Thank You!', 
          'Your testimonial has been submitted successfully and is pending review. We appreciate your feedback!'
        );
        
        // Close form after success
        setShowForm(false);
        
        // Refresh testimonials to show the new one (if approved)
        await fetchTestimonials();
      } else {
        await showErrorAlert('Error', response.message || 'Failed to submit testimonial');
      }
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      await showErrorAlert('Error', error.message || 'Failed to submit testimonial. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form state when modal is closed
  const handleCloseForm = () => {
    setShowForm(false);
    setIsSubmitting(false);
  };

  // Show loading state
  if (isLoading) {
    return (
      <section className="py-12 sm:py-16 px-4 sm:px-8 lg:px-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-primary font-medium">Loading testimonials...</p>
          </div>
        </div>
      </section>
    );
  }

  // Show error state if no testimonials available
  if (filteredTestimonials.length === 0) {
    return (
      <section className="py-12 sm:py-16 px-4 sm:px-8 lg:px-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-6 sm:mb-8">
              Testimonials
            </h2>
            <p className="text-gray-600 mb-8">
              {/* {error ? 'Unable to load testimonials. Please try again later.' : 'No testimonials available at the moment.'} */}
              {error ? 'Unable to load testimonials. Please try again later.' : ''}
            </p>
            <Button
              variant="secondary"
              onClick={() => setShowForm(true)}
            >
              Add your Testimonial
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // Safety check - if no current testimonial, show error state
  if (!currentTestimonial) {
    // return (
    //   <section className="py-12 sm:py-16 px-4 sm:px-8 lg:px-16 bg-white overflow-hidden">
    //     <div className="max-w-7xl mx-auto">
    //       <div className="text-center">
    //         <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-6 sm:mb-8">
    //           Testimonials
    //         </h2>
    //         <p className="text-gray-600 mb-8">
    //           No testimonials available at the moment.
    //         </p>
    //         <Button
    //           variant="secondary"
    //           onClick={() => setShowForm(true)}
    //         >
    //           Add your Testimonial
    //         </Button>
    //       </div>
    //     </div>
    //   </section>
    // );
  }

  // Get truncated quote for current testimonial (only after we know it exists)
  const { truncated, needsTruncation } = truncateQuote(
    currentTestimonial.quote || ''
  );
  const isExpanded = expandedQuotes[currentTestimonial.id];

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-8 lg:px-16 bg-white overflow-hidden">
      {/* Subtle background pattern overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-10"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(212,118,68,0.01)_0%,transparent_50%)]"></div>
      <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(244,223,196,0.03)_0%,transparent_50%)]"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div
          className={`grid ${
            showPics ? 'lg:grid-cols-2' : 'lg:grid-cols-1'
          } gap-12 items-start`}
        >
          {/* Left Side - Testimonial with Carousel */}
          <div className="text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-6 sm:mb-8">
              Testimonials
            </h2>

            {/* Category Badge */}
            {currentCategory && (
              <div className="mb-6">
                <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-semibold rounded-full text-sm">
                  {currentCategory.name}
                </span>
              </div>
            )}

            {/* Carousel Content */}
            <div className="min-h-[200px] md:w-full flex flex-col justify-center">
              <blockquote
                className="text-sm md:text-xl lg:text-2xl text-primary mb-6 sm:mb-8 leading-relaxed font-medium transition-all duration-700 ease-in-out"
                style={{ display: 'inline' }}
              >
                "{isExpanded ? (currentTestimonial?.quote || '') : truncated}"
                {needsTruncation && currentTestimonial?.id && (
                  <button
                    onClick={() => toggleQuoteExpansion(currentTestimonial.id)}
                    className="ml-2 text-primary/80 hover:text-primary font-medium text-md md:text-lg mb-0 transition-colors duration-300 underline decoration-primary/30 hover:decoration-primary/60"
                    style={{ display: 'inline', verticalAlign: 'baseline' }}
                  >
                    {isExpanded ? 'Read Less' : 'Read More'}
                  </button>
                )}
              </blockquote>

              <cite className="text-base sm:text-lg text-primary font-semibold transition-all duration-700 ease-in-out">
                <span className="flex items-center gap-3 mb-4 sm:mb-0">
                  {currentTestimonial?.imageUrl && (
                    <img
                      src={getTestimonialImagePath(currentTestimonial?.image, currentTestimonial?.imageUrl)}
                      alt={currentTestimonial?.author || 'Testimonial author'}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-primary/30 shadow"
                    />
                  )}
                  <span>– {currentTestimonial?.author || 'Anonymous'}</span>
                </span>
              </cite>
            </div>

            {/* Carousel Indicators */}
            <div className="mt-2">
              {/* Desktop: Fixed width container with horizontal scroll */}
              <div className="hidden md:block">
                <div className="relative">
                  {/* Fixed width container to prevent layout shifts */}
                  <div className="w-full max-w-md lg:max-w-lg overflow-hidden">
                    <div className="overflow-x-auto  scroll-smooth">
                      <div className="flex space-x-3 pb-2" style={{ width: 'max-content', minWidth: '100%' }}>
                        {filteredTestimonials.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-8 h-8 flex-shrink-0 transition-all duration-300 ${
                              index === currentIndex
                                ? 'opacity-100 scale-110'
                                : 'opacity-30 hover:opacity-60'
                            }`}
                            aria-label={`Go to testimonial ${index + 1}`}
                          >
                            <img
                              src={Flame}
                              alt={`Testimonial ${index + 1}`}
                              className="w-full h-full object-contain"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Gradient fade indicators for scrollable content */}
                    {filteredTestimonials.length > 6 && (
                      <>
                        <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Mobile: Fixed width with horizontal scroll */}
              <div className="md:hidden">
                <div className="relative">
                  {/* Fixed width container to prevent layout shifts */}
                  <div className="w-full max-w-xs mx-auto overflow-hidden">
                    <div className="overflow-x-auto scrollbar-hide scroll-smooth">
                      <div className="flex space-x-3 pb-2" style={{ width: 'max-content', minWidth: '100%' }}>
                        {filteredTestimonials.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-8 h-8 flex-shrink-0 transition-all duration-300 ${
                              index === currentIndex
                                ? 'opacity-100 scale-110'
                                : 'opacity-30 hover:opacity-60'
                            }`}
                            aria-label={`Go to testimonial ${index + 1}`}
                          >
                            <img
                              src={Flame}
                              alt={`Testimonial ${index + 1}`}
                              className="w-full h-full object-contain"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Gradient fade indicators for scrollable content */}
                    {filteredTestimonials.length > 4 && (
                      <>
                        <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Add Testimonial Button - Outside Carousel */}
              <div className="mt-8">
                <Button
                  variant="secondary"
                  className="w-full sm:w-auto"
                  onClick={() => setShowForm(true)}
                >
                  Add your Testimonial
                </Button>
              </div>
          </div>

          {/* Right Side - Two Images from Different Categories */}
          {showPics && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-8 lg:mt-0">
              {categoriesForImages.length > 0 ? categoriesForImages.map((cat, idx) => {
                // Pick the first image from each category
                const imageName = cat.images[0];
                return (
                  <div
                    key={`${cat.id}-${imageName}-${idx}`}
                    className="rounded-2xl shadow-lg overflow-hidden transition-all duration-700 ease-in-out group hover:shadow-xl bg-gradient-to-br from-primary/5 to-primary/10"
                  >
                    <div className="h-64 w-full relative">
                      <img
                        src={getTestimonialImagePath(imageName)}
                        alt={`${cat.name} - ${imageName}`}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        style={{ minHeight: '100%', minWidth: '100%' }}
                      />
                    </div>
                    <div className="p-6 text-start">
                      <h3 className="text-xl font-bold text-primary mb-2">
                        {cat.name}
                      </h3>
                      <p className="text-gray-600 text-sm">{cat.description}</p>
                      <div className="mt-3 text-xs text-primary/70 font-medium">
                        {cat.count} testimonials
                      </div>
                    </div>
                  </div>
                );
              }) : (
                // Fallback: show first two categories from testimonialCategories
                testimonialCategories.slice(0, 2).map((cat, idx) => {
                  const imageName = cat.images[0];
                  return (
                    <div
                      key={`fallback-${cat.id}-${imageName}-${idx}`}
                      className="rounded-2xl shadow-lg overflow-hidden transition-all duration-700 ease-in-out group hover:shadow-xl bg-gradient-to-br from-primary/5 to-primary/10"
                    >
                      <div className="h-64 w-full relative">
                        <img
                          src={getTestimonialImagePath(imageName)}
                          alt={`${cat.name} - ${imageName}`}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          style={{ minHeight: '100%', minWidth: '100%' }}
                        />
                      </div>
                      <div className="p-6 text-start">
                        <h3 className="text-xl font-bold text-primary mb-2">
                          {cat.name}
                        </h3>
                        <p className="text-gray-600 text-sm">{cat.description}</p>
                        <div className="mt-3 text-xs text-primary/70 font-medium">
                          {cat.count} testimonials
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
      {/* Testimonial Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 relative w-full max-w-md mx-4">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white text-2xl font-bold"
              onClick={handleCloseForm}
              aria-label="Close"
            >
              &times;
            </button>
            <TestimonialForm
              onSubmit={handleTestimonialSubmit}
              isLoading={isSubmitting}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default Testimonials;
