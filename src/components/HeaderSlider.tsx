"use client";

import React, { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import Image, { StaticImageData } from "next/image";

interface SlideData {
  id: number;
  title: string;
  offer: string;
  buttonText1: string;
  buttonText2: string;
  imgSrc: string | StaticImageData;
}

const HeaderSlider = () => {
  const sliderData: SlideData[] = [
    {
      id: 1,
      title: "Experience Pure Sound - Your Perfect Headphones Awaits!",
      offer: "Limited Time Offer 30% Off",
      buttonText1: "Buy now",
      buttonText2: "Find more",
      imgSrc: assets.header_headphone_image,
    },
    {
      id: 2,
      title: "Next-Level Gaming Starts Here - Discover PlayStation 5 Today!",
      offer: "Hurry up only few lefts!",
      buttonText1: "Shop Now",
      buttonText2: "Explore Deals",
      imgSrc: assets.header_playstation_image,
    },
    {
      id: 3,
      title: "Power Meets Elegance - Apple MacBook Pro is Here for you!",
      offer: "Exclusive Deal 40% Off",
      buttonText1: "Order Now",
      buttonText2: "Learn More",
      imgSrc: assets.header_macbook_image,
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [sliderData.length]);

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="overflow-hidden relative mx-3 sm:mx-6 md:mx-10 lg:mx-15">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
        }}
      >
        {sliderData.map((slide, index) => (
          <div
            key={slide.id}
            className="flex flex-col-reverse md:flex-row items-center justify-between bg-[#E6E9F2] py-6 sm:py-8 px-4 sm:px-6 md:px-10 lg:px-14 mt-4 sm:mt-6 rounded-xl min-w-full"
          >
            <div className="md:pl-8 mt-6 sm:mt-8 md:mt-0">
              <p className="text-sm sm:text-base text-orange-600 pb-1">{slide.offer}</p>
              <h1 className="max-w-lg text-xl sm:text-2xl md:text-3xl lg:text-[40px] md:leading-tight lg:leading-[48px] font-semibold">
                {slide.title}
              </h1>
              <div className="flex flex-col sm:flex-row items-center mt-4 md:mt-6 gap-2 sm:gap-0">
                <button className="w-full sm:w-auto px-6 sm:px-8 md:px-10 py-2 md:py-2.5 bg-orange-600 rounded-full text-white font-medium text-sm sm:text-base">
                  {slide.buttonText1}
                </button>
                <button className="group flex items-center gap-2 px-4 sm:px-6 py-2 md:py-2.5 font-medium text-sm sm:text-base">
                  {slide.buttonText2}
                  <Image className="group-hover:translate-x-1 transition" src={assets.arrow_icon} alt="arrow_icon" />
                </button>
              </div>
            </div>
            <div className="flex items-center flex-1 justify-center">
              <Image
                className="w-40 sm:w-48 md:w-60 lg:w-72"
                src={slide.imgSrc}
                alt={`Slide ${index + 1}`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8">
        {sliderData.map((_, index) => (
          <div
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`h-2 w-2 rounded-full cursor-pointer ${
              currentSlide === index ? "bg-orange-600" : "bg-gray-500/30"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default HeaderSlider;
