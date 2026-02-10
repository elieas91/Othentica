import React, { useState, useEffect, useContext, useRef } from 'react';
import Slider from 'react-slick';
import { PublicLocaleContext } from '../../contexts/PublicLocaleContext';
import { getT } from '../../data/translations';
import apiService from '../../services/api';
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon } from '@heroicons/react/24/solid';

/**
 * Converts YouTube watch URL to embed URL if needed.
 */
function toEmbedUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (trimmed.includes('/embed/')) return trimmed;
  const watchMatch = trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  return trimmed;
}

const VideoTestimonials = () => {
  const { locale } = useContext(PublicLocaleContext);
  const isArabic = locale === 'ar';
  const t = getT(locale);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [videos, setVideos] = useState([]);
  const [sectionMeta, setSectionMeta] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);

  // Section title & description from homepage_sections (video_testimonials); API resolves by locale
  useEffect(() => {
    let cancelled = false;
    apiService.getHomepageSectionByKey('video_testimonials', locale).then((res) => {
      if (cancelled) return;
      if (res?.success && res.data) {
        const d = res.data;
        setSectionMeta({
          title: d.title || '',
          description: d.description || '',
        });
      } else {
        setSectionMeta({ title: '', description: '' });
      }
    });
    return () => { cancelled = true; };
  }, [locale]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiService.getVideoTestimonials();
        if (cancelled) return;
        if (res.success && Array.isArray(res.data)) {
          const list = res.data
            .filter((item) => item.video_url || item.video_file_url)
            .map((item) => ({
              id: item.id,
              url: item.video_url || item.video_file_url || '',
              title: item.title || '',
              titleAr: item.title_ar || '',
            }));
          setVideos(list);
        } else {
          setVideos([]);
        }
      } catch (_) {
        if (!cancelled) setVideos([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) return null;
  if (videos.length === 0) return null;

  const sliderSettings = {
    dots: false,
    infinite: videos.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 8000,
    pauseOnHover: true,
    arrows: false,
    ref: sliderRef,
    beforeChange: (_current, next) => setCurrentSlide(next),
  };

  return (
    <section className="py-16 md:py-20 bg-white relative overflow-hidden" aria-label={t('videoTestimonials')}>
      {/* Subtle decorative background curves */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-orange-100/60 blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-80 h-80 rounded-full bg-teal-100/50 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-4xl relative">
        {/* Section title & description (from CMS or fallback to translations) */}
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-3xl md:text-3xl text-primary font-poppins max-w-2xl mx-auto mb-3 mt-2 prose prose-p:my-1 prose-p:leading-relaxed" dir={isArabic ? 'rtl' : 'ltr'}>
            {sectionMeta.title ? (
              sectionMeta.title
            ) : (
              <>
                <span className="block text-lg md:text-xl text-gray-600 font-normal mb-1">{t('videoTestimonialsWatch')}</span>
                {t('videoTestimonialsBrand')}
              </>
            )}
          </h2>
          {sectionMeta.description && (
            <div
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary font-poppins"
              dir={isArabic ? 'rtl' : 'ltr'}
              dangerouslySetInnerHTML={{ __html: sectionMeta.description }}
            />
          )}
        </div>

        {/* Carousel: one video, rounded card, overlapping circular arrows */}
        <div className="relative max-w-4xl mx-auto">
          <div className="relative px-8 md:px-14">
            <Slider {...sliderSettings} className="video-testimonials-slider">
              {videos.map((item) => {
                const embedUrl = toEmbedUrl(item.url);
                const isEmbed = /youtube\.com\/embed|vimeo\.com\/video|player\.vimeo/.test(embedUrl);
                const title = isArabic && item.titleAr ? item.titleAr : (item.title || '');

                return (
                  <div key={item.id} className="focus:outline-none px-1">
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-lg ring-1 ring-black/10">
                      {isEmbed ? (
                        <iframe
                          src={embedUrl}
                          title={title || `Video testimonial ${item.id}`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="w-full h-full"
                        />
                      ) : (
                        <video
                          src={embedUrl}
                          controls
                          className="w-full h-full object-contain"
                          title={title || `Video testimonial ${item.id}`}
                        >
                          Your browser does not support the video tag.
                        </video>
                      )}
                      {/* Decorative play overlay (reference-style circle with triangle) */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                          <PlayIcon className="w-8 h-8 md:w-10 md:h-10 text-gray-900 ml-1" />
                        </div>
                      </div>
                    </div>
                    {/* {title && (
                      <p className="text-center mt-4 text-gray-700 font-medium font-poppins text-sm md:text-base" dir={isArabic ? 'rtl' : 'ltr'}>
                        {title}
                      </p>
                    )} */}
                  </div>
                );
              })}
            </Slider>
          </div>

          {/* Circular white nav arrows (reference style), overlapping edges */}
          {videos.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => sliderRef.current?.slickPrev()}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-900 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="Previous video"
              >
                <ChevronLeftIcon className="w-6 h-6 md:w-7 md:h-7" />
              </button>
              <button
                type="button"
                onClick={() => sliderRef.current?.slickNext()}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-900 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="Next video"
              >
                <ChevronRightIcon className="w-6 h-6 md:w-7 md:h-7" />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default VideoTestimonials;
