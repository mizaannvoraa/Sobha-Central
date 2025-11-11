"use client";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

const Desktop_Slider = [
  { src: "/assets/WebBanner4.webp", alt: 'slide1' },
  { src: "/assets/WebBanner2.webp", alt: 'slide2' },
  { src: "/assets/WebBanner3.webp", alt: 'slide3' },
  { src: "/assets/WebBanner1.webp", alt: 'slide4' },
];

const Mobile_Slider = [
  { src: "/assets/MobBanner1.webp", alt: 'slide5' },
  { src: "/assets/MobBanner2.webp", alt: 'slide6' },
  { src: "/assets/MobBanner3.webp", alt: 'slide7' },
  { src: "/assets/MobBanner4.webp", alt: 'slide8' },
];


export default function Nav_Slider() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const paginationRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const desktopSwiperRef = useRef(null);
  const mobileSwiperRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getExpandedSlides = (slides) => {
    return [...slides, ...slides, ...slides, ...slides];
  };

  // Handle image load and update swiper
  const handleImageLoad = () => {
    // Small delay to ensure all images are processed
    setTimeout(() => {
      if (desktopSwiperRef.current?.swiper) {
        desktopSwiperRef.current.swiper.update();
      }
      if (mobileSwiperRef.current?.swiper) {
        mobileSwiperRef.current.swiper.update();
      }
      setImagesLoaded(true);
    }, 100);
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Navbar ABOVE Swiper */}
      <div className="absolute top-0 left-0 w-full z-30">
        <Navbar />
      </div>

      {/* === DESKTOP SLIDER === */}
      {isMounted && (
        <div className="hidden md:block">
          {/* Aspect ratio container to prevent layout shift */}
          <div className="relative w-full " style={{ aspectRatio: '18.7/9' }}>
            <Swiper
              ref={desktopSwiperRef}
              slidesPerView={1}
              spaceBetween={0}
              loop={false}
              speed={800}
              watchSlidesProgress={true}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              allowTouchMove={false}
              simulateTouch={false}
              modules={[Autoplay]}
              className="mySwiper desktop-swiper absolute inset-0"
              style={{ height: '100%', width: '100%' }}
            >
              {getExpandedSlides(Desktop_Slider).map((item, idx) => (
                <SwiperSlide key={`desktop-${idx}`}>
                  <div className="relative w-full h-full">
                    <Image
                    src={item.src}
                    alt={item.alt}
                    width={1920}
                    height={1080} // Set appropriate aspect ratio
                    priority={idx < 2}
                    className="w-full h-auto object-cover" // Changed to h-auto
                    style={{ display: 'block' }} // Ensure proper display
                  />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}

      {/* === MOBILE SLIDER === */}
      <div className="block md:hidden">
        {/* Aspect ratio container for mobile */}
        <div className="relative w-full">
          <Swiper
            ref={mobileSwiperRef}
            slidesPerView={1}
            spaceBetween={0}
            loop={false}
            speed={800}
            watchSlidesProgress={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            allowTouchMove={false}
            simulateTouch={false}
            modules={[Autoplay]}
            className="mySwiper mobile-swiper absolute inset-0"
            style={{ height: '100%', width: '100%' }}
          >
            {getExpandedSlides(Mobile_Slider).map((item, idx) => (
              <SwiperSlide key={`mobile-${idx}`}>
                <div className="relative w-full h-full">
                  <Image
                  src={item.src}
                  alt={item.alt}
                  width={768} // Appropriate mobile width
                  height={500} // Appropriate mobile height
                  priority={idx < 2}
                  className="w-full h-auto object-cover" // Changed to h-auto
                  style={{ display: 'block' }} // Ensure proper display
                />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Loading skeleton/placeholder */}
      {!imagesLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse">
          <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
        </div>
      )}
    </div>
  );
}
