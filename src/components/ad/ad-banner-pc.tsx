import AdBanner from './ad-banner';
import { AD_CONFIG } from './ad-config';

const AdBannerPC = () => {
  return (
    <div className="hidden md:block w-full py-6 bg-gray-50">
      <AdBanner {...AD_CONFIG.PC_BANNER} />
    </div>
  );
};

export default AdBannerPC;
