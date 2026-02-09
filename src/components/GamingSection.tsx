import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const GamingSection = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 md:px-12 lg:pl-20 lg:px-20 py-10 sm:py-12 md:py-0 bg-[#E6E9F2] my-10 sm:my-12 md:my-16 rounded-xl overflow-hidden">
      <Image
        className="w-40 sm:w-48 md:max-w-56"
        src={assets.jbl_soundbox_image}
        alt="jbl_soundbox_image"
      />
      <div className="flex flex-col items-center justify-center text-center space-y-2 px-4 md:px-0">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold max-w-[290px]">
          Level Up Your Gaming Experience
        </h2>
        <p className="max-w-[343px] font-medium text-sm sm:text-base text-gray-800/60">
          From immersive sound to precise controls—everything you need to win
        </p>
        <button className="group flex items-center justify-center gap-1 px-8 sm:px-10 md:px-12 py-2 sm:py-2.5 bg-orange-600 rounded text-white text-sm sm:text-base">
          Buy now
          <Image className="group-hover:translate-x-1 transition" src={assets.arrow_icon_white} alt="arrow_icon_white" />
        </button>
      </div>
      <Image
        className="hidden md:block w-60 lg:max-w-80"
        src={assets.md_controller_image}
        alt="md_controller_image"
      />
      <Image
        className="md:hidden w-48 sm:w-56"
        src={assets.sm_controller_image}
        alt="sm_controller_image"
      />
    </div>
  );
};

export default GamingSection;