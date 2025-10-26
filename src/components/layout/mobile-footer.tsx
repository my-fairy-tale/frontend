'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiBookOpen, FiGrid, FiActivity, FiUser } from 'react-icons/fi';

const navItems = [
  { href: '/', label: 'Home', icon: FiHome },
  { href: '/books', label: '만들기', icon: FiBookOpen },
  { href: '/library', label: '서재', icon: FiGrid },
  { href: '/activity', label: '활동', icon: FiActivity },
  { href: '/mypage', label: 'MY', icon: FiUser },
];

export default function MobileFooter() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === item.href
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-xs ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
