import AdBanner from './ad-banner';

interface AdSidebarProps {
  sticky?: boolean; // sticky 여부
}

const AdSidebar = ({ sticky = true }: AdSidebarProps) => {
  const adUnit = 'DAN-8Fa5mGlEZJyUwI0K';
  return (
    <aside
      className={`hidden lg:block ${
        sticky ? 'sticky top-20' : ''
      } w-[160px] flex-shrink-0`}
    >
      <div className="bg-gray-50 rounded-lg overflow-hidden">
        <AdBanner
          adUnit={adUnit}
          width={160}
          height={600}
        />
      </div>
    </aside>
  );
};

export default AdSidebar;
