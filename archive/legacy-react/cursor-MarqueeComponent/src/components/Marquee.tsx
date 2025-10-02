import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface MarqueeProps {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children?: React.ReactNode;
  vertical?: boolean;
  repeat?: number;
  [key: string]: any;
}

export default function Marquee({
  className,
  reverse,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [tempOffset, setTempOffset] = useState(0);
  const [hasBeenDragged, setHasBeenDragged] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const [animationOffset, setAnimationOffset] = useState(0);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>();
  
  // Custom animation loop
  useEffect(() => {
    if (shouldAnimate && !isDragging && !isHovering) {
      const animate = (currentTime: number) => {
        if (lastTimeRef.current === undefined) {
          lastTimeRef.current = currentTime;
        }
        
        const deltaTime = currentTime - lastTimeRef.current;
        lastTimeRef.current = currentTime;
        
        // Move at approximately the same speed as the CSS animation (60s duration)
        const speed = reverse ? 1 : -1; // pixels per second, adjust as needed
        setAnimationOffset(prev => prev + (speed * deltaTime / 16)); // 60fps
        
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        lastTimeRef.current = undefined;
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [shouldAnimate, isDragging, isHovering, reverse]);
  
  // Resume animation after drag with a short delay
  useEffect(() => {
    if (hasBeenDragged && !isDragging) {
      const timer = setTimeout(() => {
        setShouldAnimate(true);
      }, 1000); // 1 second pause before resuming
      return () => clearTimeout(timer);
    }
  }, [hasBeenDragged, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setTempOffset(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Multiply by 2 for faster scrolling
    setTempOffset(walk);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setHasBeenDragged(true);
    setShouldAnimate(false); // Stop animation temporarily
    // Persist the drag position by adding temp offset to current offset
    setCurrentOffset(prev => prev + tempOffset);
    setTempOffset(0);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsHovering(false);
    if (tempOffset !== 0) {
      setHasBeenDragged(true);
      setShouldAnimate(false); // Stop animation temporarily
      // Persist the drag position by adding temp offset to current offset
      setCurrentOffset(prev => prev + tempOffset);
      setTempOffset(0);
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  return (
    <div
      ref={containerRef}
      {...props}
      className={cn(
        'group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)] cursor-grab active:cursor-grabbing select-none',
        {
          'flex-row': !vertical,
          'flex-col': vertical,
        },
        className
      )}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn('flex shrink-0 justify-around [gap:var(--gap)]', {
              'flex-row': !vertical,
              'flex-col': vertical,
            })}
            style={{
              transform: `translateX(${currentOffset + tempOffset + animationOffset}px)`,
            }}
          >
            {children}
          </div>
        ))}
    </div>
  );
}
