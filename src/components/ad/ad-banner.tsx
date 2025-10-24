'use client';

import { useEffect, useRef } from 'react';

interface AdBannerProps {
  adUnit: string;
  width: number;
  height: number;
  className?: string;
}

const AdBanner = ({ adUnit, width, height, className = '' }: AdBannerProps) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <ins
        className="kakao_ad_area"
        style={{ display: 'none' }}
        data-ad-unit={adUnit}
        data-ad-width={width}
        data-ad-height={height}
      />
      <script
        type="text/javascript"
        src="//t1.daumcdn.net/kas/static/ba.min.js"
        async
      ></script>
    </div>
  );
};

export default AdBanner;
