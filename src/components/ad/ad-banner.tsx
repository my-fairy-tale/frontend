'use client';

import { useEffect, useRef } from 'react';

interface AdBannerProps {
  adUnit: string;
  width: number;
  height: number;
  className?: string;
}

declare global {
  interface Window {
    adfit?: {
      destroy?: (unit: string) => void;
    };
  }
}

const AdBanner = ({ adUnit, width, height, className = '' }: AdBannerProps) => {
  const scriptElementRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    // 스크립트 동적 로드
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/kas/static/ba.min.js';
    script.async = true;

    scriptElementRef.current = script;
    document.body.appendChild(script);

    // cleanup: 컴포넌트 언마운트 시 광고 정리
    return () => {
      if (scriptElementRef.current) {
        document.body.removeChild(scriptElementRef.current);
      }

      // adfit.destroy 호출 (존재하는 경우)
      const globalAdfit = 'adfit' in window ? window.adfit : null;
      if (globalAdfit && globalAdfit.destroy) {
        globalAdfit.destroy(adUnit);
      }
    };
  }, [adUnit]);

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <ins
        className="kakao_ad_area"
        style={{ display: 'none' }}
        data-ad-unit={adUnit}
        data-ad-width={width}
        data-ad-height={height}
      />
    </div>
  );
};

export default AdBanner;
