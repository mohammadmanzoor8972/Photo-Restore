
import React, { useState, useRef, useEffect } from 'react';

interface ImageComparatorProps {
  original: string;
  restored: string;
  showSlider: boolean;
}

export const ImageComparator: React.FC<ImageComparatorProps> = ({ original, restored, showSlider }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  };
  
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDragging.current = true;
    handleMove(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    isDragging.current = true;
    handleMove(e.touches[0].clientX);
  };
  
  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };
  
  const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div 
        ref={containerRef}
        className="relative w-full aspect-auto max-h-[70vh] select-none overflow-hidden rounded-lg group"
        onMouseDown={showSlider ? handleMouseDown : undefined}
        onTouchStart={showSlider ? handleTouchStart : undefined}
    >
      <img
        src={original}
        alt="Original"
        className="block w-full h-auto pointer-events-none"
        draggable={false}
      />
      <div
        className="absolute top-0 left-0 h-full w-full overflow-hidden pointer-events-none"
        style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
      >
        <img
          src={restored}
          alt="Restored"
          className="block w-full h-auto pointer-events-none"
          draggable={false}
        />
      </div>
      {showSlider && (
        <>
        <div
            className="absolute top-0 h-full w-1 bg-white/50 cursor-ew-resize backdrop-invert-[5%]"
            style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm grid place-items-center shadow-lg transition-transform group-hover:scale-110">
                <svg className="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>
            </div>
        </div>
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-md pointer-events-none">Restored</div>
        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-md pointer-events-none">Original</div>
        </>
      )}
    </div>
  );
};
