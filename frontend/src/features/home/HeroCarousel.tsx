import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';

import bgImage2 from '../../assets/bg-min.jpg';
import bgImage1 from '../../assets/bg-hero-2.jpg';
import bgImage3 from '../../assets/bg-hero-3.jpg';

const slides = [
  { id: 1, image: bgImage1 },
  { id: 2, image: bgImage2 },
  { id: 3, image: bgImage3 },
];

const HeroCarousel = () => {
  return (
    // THE FIX IS HERE: We lift the entire wrapper div with z-index.
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 5 }}>
      <Swiper
        modules={[Autoplay, EffectFade, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        effect="fade"
        navigation={true}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        style={{ width: '100%', height: '100%' }}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundImage: `url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* This style block now only sets the color and size, not the z-index. */}
      <style>{`
        .swiper-button-next, .swiper-button-prev {
          color: #ffffff;
        }
        .swiper-button-next::after, .swiper-button-prev::after {
          font-size: 2rem;
        }
      `}</style>
    </div>
  );
};

export default HeroCarousel;