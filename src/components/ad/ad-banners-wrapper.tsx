'use client';

import { useEffect, useState } from 'react';
import AdBannerPC from './ad-banner-pc';
import AdBannerMobile from './ad-banner-mobile';

interface AdBannersWrapperProps {
  mobileFixed?: boolean;
}

const AdBannersWrapper = ({ mobileFixed = false }: AdBannersWrapperProps) => {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
    };

    // 초기값 설정
    handleChange(mediaQuery);

    // 이벤트 리스너 등록
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // 초기 렌더링 시 깜빡임 방지 (SSR 대응)
  if (isMobile === null) {
    return null;
  }

  return isMobile ? (
    <AdBannerMobile fixed={mobileFixed} />
  ) : (
    <AdBannerPC />
  );
};

export default AdBannersWrapper;
