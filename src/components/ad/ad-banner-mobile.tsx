import AdBanner from './ad-banner';

interface AdBannerMobileProps {
  fixed?: boolean; // 하단 고정 여부
}

const AdBannerMobile = ({ fixed = false }: AdBannerMobileProps) => {
  const adUnit = 'DAN-hc06tiFHsYYdon85';
  if (fixed) {
    return (
      <div className="md:hidden fixed bottom-16 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
        <AdBanner
          adUnit={adUnit}
          width={320}
          height={50}
        />
      </div>
    );
  }

  return (
    <div className="md:hidden w-full py-4 bg-gray-50">
      <AdBanner
        adUnit={adUnit}
        width={320}
        height={50}
      />
    </div>
  );
};

export default AdBannerMobile;
