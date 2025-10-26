import AdBanner from './ad-banner';
import { AD_CONFIG } from './ad-config';

interface AdBannerMobileProps {
  fixed?: boolean; // 하단 고정 여부
}

const AdBannerMobile = ({ fixed = false }: AdBannerMobileProps) => {
  if (fixed) {
    return (
      <div className="md:hidden fixed bottom-16 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
        <AdBanner {...AD_CONFIG.MOBILE_BANNER} />
      </div>
    );
  }

  return (
    <div className="md:hidden w-full py-4 bg-gray-50">
      <AdBanner {...AD_CONFIG.MOBILE_BANNER} />
    </div>
  );
};

export default AdBannerMobile;
