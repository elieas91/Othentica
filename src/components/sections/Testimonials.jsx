import React, { useState, useEffect, useCallback } from 'react';
import Slider from 'react-slick';
import { createPortal } from 'react-dom';
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
import { getApiUrl, normalizeUploadUrl } from '../../config/api';

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

  const [expandedQuotes, setExpandedQuotes] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testimonialsData, setTestimonialsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [sliderRef, setSliderRef] = useState(null);

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

  // Get the first testimonial and its category for the right side images
  const firstTestimonial = filteredTestimonials[0];
  const currentCategory = testimonialCategories.find(
    (cat) => cat.id === firstTestimonial?.categoryId
  );

  // Slick carousel settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: false,
    customPaging: (i) => (
      <button
        className={`w-8 h-8 transition-all duration-300 ${
          i === 0 ? 'opacity-100 scale-110' : 'opacity-30 hover:opacity-60'
        }`}
        aria-label={`Go to testimonial ${i + 1}`}
      >
        <img
          src={Flame}
          alt={`Testimonial ${i + 1}`}
          className="w-full h-full object-contain"
        />
      </button>
    ),
    beforeChange: (current, next) => {
      // Update the active dot when slide changes
      const dots = document.querySelectorAll('.slick-dots li button');
      dots.forEach((dot, index) => {
        if (index === next) {
          dot.classList.add('opacity-100', 'scale-110');
          dot.classList.remove('opacity-30');
        } else {
          dot.classList.remove('opacity-100', 'scale-110');
          dot.classList.add('opacity-30');
        }
      });
    }
  };

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
      return normalizeUploadUrl(imageUrl, 'testimonials');
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
      // Use "Anonymous" as name if anonymous is selected, otherwise use the provided name
      testimonialFormData.append('name', formData.is_anonymous ? 'Anonymous' : formData.name);
      testimonialFormData.append('description', formData.description);
      testimonialFormData.append('status', 'pending');
      testimonialFormData.append('category', formData.category);
      testimonialFormData.append('email', formData.email || '');
      testimonialFormData.append('is_anonymous', formData.is_anonymous);
      
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

  // Handle modal positioning, body scroll, and ESC key
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && showForm) {
        handleCloseForm();
      }
    };

    if (showForm) {
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
      // Ensure modal is positioned correctly
      document.body.style.position = 'relative';
      // Add ESC key listener
      document.addEventListener('keydown', handleEscKey);
    } else {
      // Restore body scrolling when modal is closed
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [showForm]);

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

  // Safety check - if no testimonials, show error state
  if (filteredTestimonials.length === 0) {
    return (
      <section className="py-12 sm:py-16 px-4 sm:px-8 lg:px-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-6 sm:mb-8">
              Testimonials
            </h2>
            <p className="text-gray-600 mb-8">
              {error ? 'Unable to load testimonials. Please try again later.' : 'No testimonials available at the moment.'}
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

  return (
    <>
      <section className="py-6 lg:py-12 px-4 lg:px-16 bg-white overflow-hidden">
        {/* Subtle background pattern overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(212,118,68,0.01)_0%,transparent_50%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(244,223,196,0.03)_0%,transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto relative z-10">
        <div
          className={`grid grid-cols-1 ${
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

            {/* Slick Carousel Content */}
            <div className="min-h-[200px] md:w-full">
              <Slider {...sliderSettings}>
                {filteredTestimonials.map((testimonial) => {
                  const { truncated, needsTruncation } = truncateQuote(testimonial.quote || '');
                  const isExpanded = expandedQuotes[testimonial.id];
                  
                  return (
                    <div key={testimonial.id} className="px-2">
                      <div className="flex flex-col justify-center min-h-[200px]">
                        <blockquote
                          className="text-sm md:text-xl lg:text-2xl text-primary mb-6 sm:mb-8 leading-relaxed font-medium"
                          style={{ display: 'inline' }}
                        >
                          "{isExpanded ? (testimonial.quote || '') : truncated}"
                          {needsTruncation && testimonial.id && (
                            <button
                              onClick={() => toggleQuoteExpansion(testimonial.id)}
                              className="ml-2 text-primary/80 hover:text-primary font-medium text-md md:text-lg mb-0 transition-colors duration-300 underline decoration-primary/30 hover:decoration-primary/60"
                              style={{ display: 'inline', verticalAlign: 'baseline' }}
                            >
                              {isExpanded ? 'Read Less' : 'Read More'}
                            </button>
                          )}
                        </blockquote>

                        <cite className="text-base sm:text-lg text-primary font-semibold">
                          <span className="flex items-center gap-3 mb-4 sm:mb-0">
                            {testimonial.imageUrl && (
                              <img
                                src={getTestimonialImagePath(testimonial.image, testimonial.imageUrl)}
                                alt={testimonial.author || 'Testimonial author'}
                                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-primary/30 shadow"
                              />
                            )}
                            <span>– {testimonial.author || 'Anonymous'}</span>
                          </span>
                        </cite>
                      </div>
                    </div>
                  );
                })}
              </Slider>
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
                        src={getTestimonialImagePath(imageName, null)}
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
                          src={getTestimonialImagePath(imageName, null)}
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
      </section>
      
      {/* Testimonial Form Modal - Rendered via Portal */}
      {showForm && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 relative w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white text-2xl font-bold z-10 bg-white dark:bg-gray-800 rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={handleCloseForm}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="pr-8">
              <h3 className="text-2xl font-bold text-primary font-poppins mb-2">
                Share Your Experience
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Help others by sharing your experience with Othentica
              </p>
              <TestimonialForm
                onSubmit={handleTestimonialSubmit}
                isLoading={isSubmitting}
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default Testimonials;
