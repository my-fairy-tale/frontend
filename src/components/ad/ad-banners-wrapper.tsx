'use client';

import AdBannerPC from './ad-banner-pc';
import AdBannerMobile from './ad-banner-mobile';
import { useIsMobile } from '@/hooks/useMediaQuery';

interface AdBannersWrapperProps {
  mobileFixed?: boolean;
}

const AdBannersWrapper = ({ mobileFixed = false }: AdBannersWrapperProps) => {
  const isMobile = useIsMobile();

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
