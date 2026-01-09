
import React, { useEffect, useCallback } from 'react';

interface ImageLightboxProps {
  images: string[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({ images, initialIndex, isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  const showPrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const showNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Close button */}
      <button 
        className="absolute top-6 right-6 text-white/70 hover:text-white p-2 z-50 transition-colors"
        onClick={onClose}
      >
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-4 transition-colors z-50 hover:bg-white/10 rounded-full"
            onClick={showPrev}
          >
            <svg className="w-8 h-8 md:w-12 md:h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-4 transition-colors z-50 hover:bg-white/10 rounded-full"
            onClick={showNext}
          >
            <svg className="w-8 h-8 md:w-12 md:h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Main Image */}
      <div 
        className="relative max-w-7xl max-h-screen w-full h-full p-4 flex items-center justify-center"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image area
      >
        <img 
          src={images[currentIndex]} 
          alt={`Full screen view ${currentIndex + 1}`} 
          className="max-w-full max-h-full object-contain shadow-2xl rounded-sm animate-in zoom-in-95 duration-300"
        />
        
        {/* Counter */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-1 rounded-full backdrop-blur-md text-sm font-medium border border-white/10">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
      
      {/* Thumbnails strip at bottom (optional, hidden on small screens) */}
      <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2 px-4 pointer-events-none hidden md:flex">
         {images.map((img, idx) => (
             <div 
                key={idx} 
                className={`w-12 h-12 rounded overflow-hidden border-2 transition-all duration-300 pointer-events-auto cursor-pointer ${idx === currentIndex ? 'border-white scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`}
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
             >
                 <img src={img} className="w-full h-full object-cover" />
             </div>
         ))}
      </div>
    </div>
  );
};

export default ImageLightbox;
