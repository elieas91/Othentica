import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { missionVisionValuesData } from '../../../data/missionVisionValuesData';

import 'swiper/css';
import 'swiper/css/navigation';
import './CarouselMVV.css';

const CarouselMVV = ({ className = '' }) => {
  // find the index of the item with id=2
  const initialIndex = missionVisionValuesData.findIndex(
    (slide) => slide.id === 2
  );

  return (
    <div
      id="mission-vision-values"
      className={`w-full max-w-7xl mx-auto relative ${className}`}
    >
      {/* Swiper */}
      <Swiper
        modules={[Navigation]}
        navigation={{
          nextEl: '.custom-next',
          prevEl: '.custom-prev',
        }}
        centeredSlides={true}
        slidesPerView={1.2}
        spaceBetween={30}
        loop={false}
        initialSlide={initialIndex >= 0 ? initialIndex : 0} // fallback to 0
        breakpoints={{
          768: { slidesPerView: 2.2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {missionVisionValuesData.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              className="relative rounded-2xl overflow-hidden shadow-lg group"
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: '100%', // let Swiper control the width
                height: '220px', // smaller height for rectangle shape
                borderRadius: '1rem', // nice rounded rectangle
              }}
            >
              <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center px-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {slide.title}
                </h2>
                {/* <p className="text-gray-200 mb-4">{slide.description}</p> */}
                <a
                  href={slide.link}
                  style={{ cursor: 'pointer' }}
                  className="text-secondary font-semibold hover:underline"
                >
                  Read More
                </a>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Rectangle Buttons */}
      <button className="custom-prev">‹</button>
      <button className="custom-next">›</button>
    </div>
  );
};

export default CarouselMVV;
