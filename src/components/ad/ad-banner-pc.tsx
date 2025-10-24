import AdBanner from './ad-banner';

const AdBannerPC = () => {
  const adUnit = 'DAN-QyqLwiahlSFDhmcA';
  return (
    <div className="hidden md:block w-full py-6 bg-gray-50">
      <AdBanner
        adUnit={adUnit}
        width={728}
        height={90}
      />
    </div>
  );
};

export default AdBannerPC;
