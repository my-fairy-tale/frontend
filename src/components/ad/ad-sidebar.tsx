import AdBanner from './ad-banner';
import { AD_CONFIG } from './ad-config';

interface AdSidebarProps {
  sticky?: boolean; // sticky 여부
}

const AdSidebar = ({ sticky = true }: AdSidebarProps) => {
  return (
    <aside
      className={`hidden lg:block ${
        sticky ? 'sticky top-20' : ''
      } w-[160px] flex-shrink-0`}
    >
      <div className="bg-gray-50 rounded-lg overflow-hidden">
        <AdBanner {...AD_CONFIG.SIDEBAR_BANNER} />
      </div>
    </aside>
  );
};

export default AdSidebar;
