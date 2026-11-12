import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const images = [
  '/images/slide1.png',
  '/images/slide2.png',
  '/images/slide3.png'
];

export const AuthLayout = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl flex rounded-2xl shadow-2xl overflow-hidden bg-white min-h-[600px]">
        {/* Left Side - Image Slider */}
        <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-between p-12 bg-amber-900">
          {/* Slider Background */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={currentImageIndex}
              src={images[currentImageIndex]}
              alt="School Environment"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
          </AnimatePresence>
          
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-amber-900/40 to-black/40 z-10"></div>

          {/* Text Content */}
          <div className="relative z-20">
            <h1 className="text-4xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">
              School Management System
            </h1>
            <p className="text-amber-50 text-lg font-medium drop-shadow-md">
              Empowering education through comprehensive digital administration and seamless workflows.
            </p>
          </div>
          
          <div className="relative z-20 mt-auto">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/30 shadow-lg">
                <span className="text-white font-bold text-xl drop-shadow">SMS</span>
              </div>
              <div>
                <p className="text-white font-semibold drop-shadow">Premium Edition</p>
                <p className="text-amber-100 text-sm drop-shadow">v2.0.0</p>
              </div>
            </div>

            {/* Slider Indicators */}
            <div className="flex gap-2 mt-8">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentImageIndex 
                      ? 'w-8 bg-amber-400' 
                      : 'w-2 bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Form Content */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};
