'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface ScrollHeaderProps {
  children: React.ReactNode;
}

export default function ScrollHeader({ children }: ScrollHeaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    // 스크롤을 아래로 내릴 때 (100px 이상 스크롤 시에만)
    if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
      setIsVisible(false);
    }
    // 스크롤을 위로 올릴 때
    else {
      setIsVisible(true);
    }

    lastScrollY.current = currentScrollY;
  }, []);

  useEffect(() => {
    // Throttle을 적용하여 100ms마다 한 번만 실행
    let ticking = false;

    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });

    return () => window.removeEventListener('scroll', throttledScroll);
  }, [handleScroll]);

  return (
    <div
      className={`fixed top-0 w-full left-0 z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {children}
    </div>
  );
}
